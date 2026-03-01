import { homedir} from 'os'
import { join } from 'path';
import { promises } from 'fs';
const filepath: string = join(homedir(), 'weather-ts-data.json');

export const saveKeyValue = async (key: string, value: unknown): Promise<void> => {
    let data: {[key: string]: unknown} = {} ;
    if(await isExist(filepath)){
      const file: string  = await promises.readFile(filepath, 'utf-8');
      data = JSON.parse(file);
    }
    data[key] = value;
    await promises.writeFile(filepath, JSON.stringify(data));
}

export const getKeyValue = async <T = unknown> (key: string): Promise<T | undefined> => {
    if(await isExist(filepath)){
      const file: string = await promises.readFile(filepath, 'utf-8');
      const data = JSON.parse(file);
      return data[key] as T; 
    }

    return undefined;
}


const isExist = async (path: string): Promise<boolean> => {
  try {
    await promises.stat(path);
    return true ;
  } catch (error) {
    return false ;
  }
}