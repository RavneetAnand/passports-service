import { Express } from 'express';
import controller from './controller';
import bodyParser from 'body-parser';

export const routes = (app: Express) => {
  // URL to get the data from the API.
  app.post(
    '/getPassportDetails',
    bodyParser.raw({ type: ['image/jpeg', 'image/png'], limit: '5mb' }),
    controller.getPassportDetails,
  );
};
