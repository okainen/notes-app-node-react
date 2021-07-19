import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {CurrentUser} from '@/entities/valueObjects';
import config from '@/config';
import {BadRequestError} from '@/errors';

const {
  app: {
    accessToken: {secret}
  }
} = config;

declare global {
  namespace Express {
    interface Request {
      currentUser: CurrentUser | null;
    }
  }
}

interface ICurrentUser {
  id: string;
}

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-access-token');
  if (!token) {
    req.currentUser = null;
  } else {
    try {
      const {id} = jwt.verify(token, secret) as ICurrentUser;
      const currentUser = new CurrentUser(id);
      req.currentUser = currentUser;
    } catch (err) {
      throw new BadRequestError('Invalid token provided.');
    }
  }
  next();
};
