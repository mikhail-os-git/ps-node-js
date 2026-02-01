'use strict';
import { performance,PerformanceObserver } from 'perf_hooks'
import {compute} from './compute.js';
import os from 'os';
import { chunkArray } from './chunkArray.js';
import { Worker } from 'worker_threads';

const array = Array.from({length: 300000}, (v,i) => i+1);
const performanceObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}`);
  })
});

performanceObserver.observe({entryTypes: ['measure']});

await main();

async function main() {
const mainThreadResult = mainThreadExecute(array);
const multiThreadsResult = await multiThreadsExecute(array);

console.log(mainThreadResult == multiThreadsResult);

}

async function multiThreadsExecute(array) {
  const splitter = os.availableParallelism();
  let sum = 0;
  const chunkSize = Math.ceil(array.length / splitter);
  const arrays = chunkArray(array, chunkSize);

  try {
    performance.mark('multi threads start');
    sum = (await Promise.all(arrays.map(a => getFromWorker(a)))).reduce((acc, item) => acc+item, 0);
    performance.mark('multi threads end');
    performance.measure('multi threads', 'multi threads start','multi threads end');
  } catch (error) {
    console.log(error);
  }
  return sum;
}

async function getFromWorker(array){
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', {
      workerData: {
        array
      }
    })

    worker.on('message', (msg) => resolve(msg));

    worker.on('error', (err) => reject(err));

  });
}

export function mainThreadExecute(array) {
  performance.mark('main thread start');
  const res = compute({array});
  performance.mark('main thread end');
  performance.measure('main thread', 'main thread start', 'main thread end');

  return res;
}