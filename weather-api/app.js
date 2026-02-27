import express from 'express';
import { cityRouter } from './routers/city.router.js';

const port = 8000;

const app = express();

app.use('/weather', cityRouter);

app.listen(port, () => console.log("Приложение запущено."))