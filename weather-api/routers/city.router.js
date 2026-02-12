import {Router} from 'express';
import { getForcast } from '../weather.js';


export const cityRouter = Router();

cityRouter.get('/:city', async (req,res) => {
  const { city } = req.params;
  const data = await getForcast(city);

  if(data?.failure) {
    res.status(data?.code).send(data?.message);
  }else {
    res.status(200).json(data);
  }
})