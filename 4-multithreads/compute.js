export function compute({array}) {
  let count = 0;
  array.forEach(n => {
    if(n%3 == 0) count++;
  });

  return count;
}

