import { TArgs } from "../interfaces/args.interface.js";

export const getArgs = (args: string[]) => {
  const res: TArgs = {};
  const [executer, file, ...rest] = args;
  for(let index = 0; index < rest.length; index++) {
    const value = rest[index];
    
    if(value?.charAt(0) == '-'){
      if(value.charAt(1) == 's') {
        let pos = index + 1;
        res.s = [];
        while(pos < rest.length && rest[pos]?.charAt(0) != '-'){
          if(rest[pos]) {
            res.s.push(rest[pos] as string);
          }
          pos++;
        }
        continue;
      }
      if(index == rest.length - 1) {
        res[value.substring(1) as string] = true as boolean;

      }
      else if(rest[index + 1 ] != undefined && rest[index + 1]!.charAt(0) != '-'){
        const nextValue = rest[index + 1];
        if (value.substring(1) && nextValue !== undefined) {
          res[value.substring(1)] = nextValue; 
        }
      } else {
        res[value.substring(1)] = true;
      }
    }
}

  return res;
};

