#!/usr/bin/env node
import { AxiosError } from 'axios';
import {getArgs} from './helpers/args.js';
import { KEYS_DICTIONARY } from './helpers/keyDictionary.js';
import { checkCity, getIcon, getWeather } from './services/api.service.js';
import { printError, printHelp, printSuccess, printWeather } from './services/log.service.js';
import { getKeyValue, saveKeyValue } from './services/storage.service.js';


const saveToken = async(token) => {
  if(!token.length) {
    printError('Не передан токен');
    return;
  }
  try {
    await saveKeyValue(KEYS_DICTIONARY.apiKey, token);
    printSuccess('Ключ сохранен');
  } catch (error) {
    printError(error.message);
  }
}

const saveCity = async (cities) => {
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
    cities = checkedCities.filter(Boolean);
      saveKeyValue(KEYS_DICTIONARY.cities, cities);
      cities.length ? printSuccess( cities.length > 1 ? 'Города сохранены' : 'Город сохранен') : printError("Переданные значения невалидны");
}
  catch (error) {
        if(error?.response?.status == 401){
        printError('Неверно указан ключ API');
        } else{
        printError(error.message); 
      }
  }
}

const saveLanguage = async (language) => {
  try {
      if(!await getKeyValue(KEYS_DICTIONARY.language) && (!language || !language.length)) {
      language = 'ru'
    }
    await saveKeyValue(KEYS_DICTIONARY.language, language);
  } catch (error) {
    printError(error.message);
  }
}

const getForcast = async () => {
  try {
    const searchCitys = await getKeyValue(KEYS_DICTIONARY.cities);
    if(!searchCitys || !searchCitys.length){
      printError('Передайте город или сохраните его командой -s [CITY]');
      return;
    }
    for(const cityname of searchCitys) {
      const weather = await getWeather(cityname);
      printWeather(weather, getIcon(weather.weather[0].icon) ?? '');
    }
  } catch (error) {
    if(error?.response?.status == 404){
      printError('Неверно указан город');
    }
    else if(error?.response?.status == 401){
      printError('Неверно указан ключ API');
    } else{
      printError(error.message); 
    }
  }
}

const initCLI = async () => {
  const args = getArgs(process.argv);

  await saveLanguage(args.l); 

  if(args.h){
    return printHelp();
  }

  if(args.s){
    return await saveCity(args.s);
  }

  if(args.t){
    return await saveToken(args.t);
  }

  await getForcast(); 
}

initCLI()