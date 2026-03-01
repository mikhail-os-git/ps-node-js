#!/usr/bin/env node
import { AxiosError } from 'axios';
import {getArgs} from './helpers/args.js';
import { KEYS_DICTIONARY } from './helpers/keyDictionary.js';
import { checkCity, getIcon, getWeather } from './services/api.service.js';
import { printError, printHelp, printSuccess, printWeather } from './services/log.service.js';
import { getKeyValue, saveKeyValue } from './services/storage.service.js';
import type { TArgs } from './interfaces/args.interface.js';
import { IWeatherResolve } from './interfaces/api.response.interface.js';


const saveToken = async(token: string): Promise<void> => {
  if(!token.length) {
    printError('Не передан токен');
    return;
  }
  try {
    await saveKeyValue(KEYS_DICTIONARY.apiKey, token);
    printSuccess('Ключ сохранен');
  } catch (error) {
    if(error instanceof Error)
      printError(error.message);
  }
}

const saveCity = async (cities: string[]): Promise<void> => {
  if(!cities.length) {
    printError('Город не передан');
    return;
  }
  try {
    const checkedCities = await Promise.all(
      cities.map(async city => {
        return (await checkCity(city)) ? city : null;
      }) 
    );
    const validCities = checkedCities.filter(Boolean) as string[];
    await saveKeyValue(KEYS_DICTIONARY.cities, validCities); // await!
    validCities.length 
      ? printSuccess(validCities.length > 1 ? 'Города сохранены' : 'Город сохранен') 
      : printError("Переданные значения невалидны");
  }
  catch (error) {
    if(error instanceof AxiosError) {
      if(error?.response?.status == 401){
        printError('Неверно указан ключ API');
      } else {
        printError(error.message);
      }
    } else if(error instanceof Error) {
      printError(error.message); 
    }
  }
}


const saveLanguage = async (language: string | undefined): Promise<void> => {
  try {
      if(!await getKeyValue<string>(KEYS_DICTIONARY.language) && (!language || !language.length)) {
      language = 'ru'
    }
    await saveKeyValue(KEYS_DICTIONARY.language, language);
  } catch (error) {
    if(error instanceof Error)
      printError(error.message);
  }
}

const getForcast = async (): Promise<void> => {
  try {
    const searchCitys: string[] | undefined = await getKeyValue<string[]>(KEYS_DICTIONARY.cities);
    if(!searchCitys || !searchCitys.length){
      printError('Передайте город или сохраните его командой -s [CITY]');
      return;
    }
    for(const cityname of searchCitys) {
      const weather : IWeatherResolve = await getWeather(cityname);
      printWeather(weather, getIcon(weather.weather[0]?.icon as string) ?? '');
    }
  } catch (error) {
    if(error instanceof AxiosError) {
        if(error?.response?.status == 404){
        printError('Неверно указан город');
      }
      else if(error?.response?.status == 401){
        printError('Неверно указан ключ API');
      }
    } 
    else if(error instanceof Error){
      printError(error.message); 
    }
  }
}

const initCLI = async (): Promise<void> => {
  const args: TArgs = getArgs(process.argv);
  const la = args?.l as string | undefined;
  await saveLanguage(la); 

  if(args.h){
    return printHelp();
  }

  if(args.s && Array.isArray(args.s)){
    return await saveCity(args.s);
  }

  if(args.t && typeof args.t === "string"){
    console.log(args.t);
    return await saveToken(args.t);
  }

  await getForcast(); 
}

initCLI();