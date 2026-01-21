'use strict';

const input = process.argv;

startProcess(input);

function startProcess(input){
    let duration = 0;
    let start = 2;
    let stop = input.length;
    let message = "Ваш таймер сработает через: "
    while(start < stop)
    {
      console.log(input[start]);
      message += `${input[start]} `;
      duration += parseInput(input[start]);
      start++;
    }

    console.log(message);
    const timerID = setTimeout(()=> {
      console.log("Конец")
    }, duration);
}

function parseInput(value)
{
  let res = "";
    if(value.includes('h')){
    res = splitter(value, 'h')
      if(!isNaN(Number(res))) {
        return Number(res) * 60 * 60 * 1000;
      }
    }

    if(value.includes('m')){
        res = splitter(value, 'm')
          if(!isNaN(Number(res))) {
            return Number(res) * 60 * 1000;
      }
    }
    if(value.includes('s')){
        res = splitter(value, 's')
          if(!isNaN(Number(res))) {
            return Number(res) * 1000;
      }
    }

    return 0;
}

function splitter(string,char){
  return string.split('').filter(c => c != char).join();
}