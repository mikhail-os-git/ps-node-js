import chalk from 'chalk';
import dedent from 'dedent-js';
import { IWeatherResolve } from '../interfaces/api.response.interface.js';

export const printError = (error: string) : void => {
  console.log(chalk.bgRed('ERROR:') + ` ${error}`);
}

export const printSuccess = (msg: string): void => {
  console.log(chalk.bgGreen('SUCCESS ') + ` ${msg}`);
}

export const printHelp = (): void => {
  console.log(
    dedent`${chalk.bgCyan('HELP')}
    Без параметров - вывод погоды
    -s [CITY] для установки города
    -h для вывода помощи
    -t [API_KEY] для сохранения токена
    -l используете сокращение [LG] 
    `);
}

export const printWeather = (res: IWeatherResolve, icon: string) => {
  console.log(
    dedent`${chalk.bgYellow('WEATHER: ')} Погода в городе ${res.name}
    ${icon} ${res.weather[0]?.description}
    Температура: ${res.main.temp} (ощущается как ${res.main.feels_like})
    Влажность: ${res.main.humidity}%
    Скорость ветра: ${res.wind.speed}
    `
  );
}