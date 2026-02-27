export class CustomError{
  
  constructor(message, code) {
    this.message = message;
    this.code = code;
    this.failure = true;
  }
}