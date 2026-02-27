export const getArgs = (args) => {
  const res = {};
  const [executer, file, ...rest] = args;
  for(let index = 0; index < rest.length; index++) {
    const value = rest[index];

    if(value.charAt(0) == '-'){
      if(value.charAt(1) == 's') {
        let pos = index + 1;
        res.s = [];
        while(pos < rest.length && rest[pos].charAt(0) != '-'){
          res.s.push(rest[pos]);
          pos++;
        }
        continue;
      }
      if(index == rest.length - 1) {
        res[value.substring(1)] = true;

      }
      else if(rest[index + 1].charAt(0) != '-'){
        res[value.substring(1)] = rest[index+1];
      } else {
        res[value.substring(1)] = true;
      }
    }
}

  return res;
};

