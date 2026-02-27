#!/usr/bin/env node
import { CustomError } from './helpers/customError.js';
import { getIcon, getWeather } from './services/api.service.js';


export const getForcast = async (city) => {
  try {
    if(!city.length){
      throw new Error("Город не должен быть пустым.");
    }
      const weather = await getWeather(city);
      return parseResponse(weather);
    }
  catch (error) {
    if(error?.response?.status == 404) {
      return new CustomError('Неверно указан город', error.response.status);
    } 
    else if(error?.response?.status) {
      return new CustomError('Неполадки на стороне сервер, обратитесь в поддержку', error.response.status);
    }else {
      return new CustomError(error.message, 400);
    }
  }
}

const parseResponse = (data) => {
  return {
    city: data.name,
    description: data.weather[0].description,
    temp: data.main.temp,
    feels_like: data.main.feels_like,
    humidity: data.main.humidity + "%",
    wind_speed: data.wind.speed,
    icon: getIcon(data.weather[0].icon) != undefined ? getIcon(data.weather[0].icon): 'Иконка отсутствует'
  }
}

