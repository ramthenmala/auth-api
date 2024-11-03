require('dotenv').config();
import express from 'express';
import dotenv from 'dotenv';

import connect from './utils/connect';
import logStatus from './utils/logStatus';

import appRouter from './routes';

dotenv.config();

const appPort = process.env.APP_PORT || 3001;

const app = express();

app.use(express.json())

app.listen(appPort, async () => {
    logStatus.info(`App is running at http://localhost:${appPort}`);
    await connect();
    appRouter(app);
});
