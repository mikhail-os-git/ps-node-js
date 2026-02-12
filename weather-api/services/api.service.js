import https from 'https';
import { getKeyValue } from './storage.service.js';
import { KEYS_DICTIONARY } from '../helpers/keyDictionary.js';
import axios from 'axios';



export const getIcon = (icon) => {
  switch(icon.slice(0, -1)) {
    case '01': return '☀️';
    case '02': return '⛅'
    case '03': return '☁️'
    case '04': return '☁️'
    case '09': return '🌧️'
    case '10': return '🌦️'
    case '11': return '⛈️'
    case '13': return '❄️'
    case '50': return '🌫️'

    default: 
      return undefined;
  }
}

export const getWeather = async (city) => {
  const token = await getKeyValue(KEYS_DICTIONARY.apiKey);
  // const language = await getKeyValue(KEYS_DICTIONARY.language)

  if(!token) {
    throw new Error('Ошибки конфигурации на стороне сервер, обратитесь в поддержку.');
  }

  const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      q: city,
      appid: token,
      lang: 'ru',
      units: 'metric'
    }
  })

  return data;
};


export const checkCity = async (cityname) => {
    const token = await getKeyValue(KEYS_DICTIONARY.apiKey);

  if(!token) {
    throw new Error('Какие то неполадки, пожалуйста повторите позже.');
  }

  const {data} = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
    params: {
      q: cityname,
      limit: 1,
      appid: token,
    }
  })

  return data?.length > 0;
}