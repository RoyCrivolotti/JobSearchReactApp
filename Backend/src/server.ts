/* eslint-env es6*/

// Native packages
import path from 'path';
import fs from 'fs';

// Third party libraries
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';

// load routes
import routes from './router';
import errorHandler from './handlers/errorHandlers';

const app = express();

import { envs } from './server/config';

const PORT = process.env.NODE_ENV && process.env.NODE_ENV === 'development'
    ? envs.SERVER_PORT
    : envs.PORT;

// log only 4xx and 5xx responses to console
app.use(logger('dev', {
    skip: (req, res) => res.statusCode < 400,
}));

// log all requests to access.log
app.use(logger('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }),
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// route handling
app.use('/api', routes);
app.get('/*', (req, res, next) => res.sendFile(path.join(__dirname, 'build', 'index.html'), error => {
    if (error) next(error);
}));

// if the routes above didn't catch it, we 404 it and forward it to the error handler
app.use(errorHandler.notFound);

// otherwise, forward the error to the corresponding error handler given the environment
app.get('env') === 'development'
    ? app.use(errorHandler.developmentErrors)
    : app.use(errorHandler.productionErrors);

app.listen(PORT, error => {
    if (error) next(error);
    else console.log(`Listening on port ${PORT}`);
});

module.exports = app;
