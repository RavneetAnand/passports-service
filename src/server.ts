import express from 'express';
import cors from 'cors';

import { routes } from '../api/routes';
import { passportsService } from './plugins/passports';

export type Options = {
  service: {
    host: string;
    type: string;
    port: number;
    protocol: string;
  };
};

const app = express();

/**
 * Start the microservice.
 * @param {*} options Object containing details of the service.
 */
const startService = (options: Options) => {
  try {
    app.use(express.json());
    app.use(cors());

    routes(app);

    app.listen(options.service.port, () => {
      console.log('Server listening on the port: ' + options.service.port);
    });
  } catch (err: any) {
    console.error('Error starting the service' + err.message);
  }
};

/**
 * Handle the tasks to be performed on service start.
 * @param options Object containing details of the service.
 * @returns {Promise<void>}
 */
async function start(options: Options) {
  passportsService();

  return startService(options);
}

//Error handling code within middleware
process.on('uncaughtException', (error: any) => {
  if (!error.isOperational) {
    throw error;
  }
});

// Prepare the configuration object for the service and the connected database.
let config = {
  service: {
    host: '0.0.0.0',
    type: 'http',
    port: parseInt(process.env.PORT || '') || 3903,
    protocol: 'http',
  },
};

start(config);
