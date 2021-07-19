import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {verifyUser, handleError} from './middleware';
import {userRouter, noteRouter} from './routers';
import config from './config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser(config.app.signedCookie.secret));
app.use(verifyUser);

app.use('/api/users', userRouter);
app.use('/api/notes', noteRouter);

app.use(handleError);

app.listen(config.app.port, () =>
  console.log(`Listening on port ${config.app.port}...`)
);
