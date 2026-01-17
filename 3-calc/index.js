import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firstNum = process.argv[2];
let secondNum = process.argv[3];
let opr = process.argv[4];

calc(firstNum, secondNum, opr);

async function calc(num1, num2, operation)
{
  try {

    if(isNaN(Number(num1)) || isNaN(Number(num2))) {
      console.log("use numbers in operations.");
      return;
    }
    
    const filePath =  path.join(__dirname, `${operation}.js`)
    const file = await import(pathToFileURL(filePath).href);
    
    console.log(file.calc(parseInt(num1),parseInt(num2)));
  }catch(err) {
    console.log("invalid operation: "+ operation);
    return;
  } 
}