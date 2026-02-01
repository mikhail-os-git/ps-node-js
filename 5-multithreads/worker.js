import { parentPort, workerData} from 'worker_threads';
import {compute} from './compute.js'

parentPort.postMessage(compute(workerData));