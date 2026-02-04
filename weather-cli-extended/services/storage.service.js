import { homedir} from 'os'
import { join } from 'path';
import { promises } from 'fs';
const filepath = join(homedir(), 'weather-data-extented.json');

export const saveKeyValue = async (key, value) => {
    let data = {};
    if(await isExist(filepath)){
      const file = await promises.readFile(filepath);
      data = JSON.parse(file);
    }
    
    data[key] = value;
    await promises.writeFile(filepath, JSON.stringify(data));
}

export const getKeyValue = async (key) => {
    if(await isExist(filepath)){
      const file = await promises.readFile(filepath);
      const data = JSON.parse(file);
      return data[key]; 
    }

    return undefined;
}


const isExist = async (path) => {
  try {
    await promises.stat(path);
    return true ;
  } catch (error) {
    return false ;
  }
}