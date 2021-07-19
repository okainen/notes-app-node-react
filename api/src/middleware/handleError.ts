import {Request, Response, NextFunction} from 'express';
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
} from '@/errors';

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  switch (err.constructor) {
    case BadRequestError: {
      res.status(400);
      break;
    }
    case UnauthorizedError: {
      res.status(401);
      break;
    }
    case ForbiddenError: {
      res.status(403);
      break;
    }
    case NotFoundError: {
      res.status(404);
      break;
    }
    case ConflictError: {
      res.status(409);
      break;
    }
    default: {
      console.error(err);
      res.status(500).json({error: 'Internal server error.'});
    }
  }
  if (err.message) {
    res.json({error: err.message});
  }
  res.end();
  next();
};
