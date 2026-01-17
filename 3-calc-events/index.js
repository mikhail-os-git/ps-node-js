import EventEmitter from "node:events";
const em = new EventEmitter()

let firstNum = process.argv[2];
let secondNum = process.argv[3];
let opr = process.argv[4];



em.on('result', (res)=> console.log(res));
em.on('add', (a,b) => {
  em.emit('result', a+b);
});

em.on('subtract', (a,b) => {
  em.emit('result', a-b);
});

em.on('division', (a,b) => {
  em.emit('result', a/b);
});

em.on('multiply', (a,b) => {
  em.emit('result', a*b);
});

calc(firstNum,secondNum,opr);

function calc(a,b,op){
  if(isNaN(Number(a)) || isNaN(Number(b)))  {
      console.log("use numbers in operations.");
      return;
    }
    
    if(em.eventNames().includes(op)){
      em.emit(op, Number(a),Number(b));
    }else{
      console.log("invalid operation: "+ op);
      return;
    }

}

