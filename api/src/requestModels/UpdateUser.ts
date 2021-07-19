import Joi from 'joi';
import {BadRequestError} from '@/errors';
import { INVALID_INPUT } from '@/constants/errors';

export default class UpdateUser {
  public readonly username?: string;
  public readonly firstName?: string;
  public readonly lastName?: string;

  constructor(reqBody: any) {
    const schema = Joi.object({
      password: Joi.string().min(8).max(128),
      firstName: Joi.string().min(1).max(18),
      lastName: Joi.string().min(1).max(18)
    });
    if (schema.validate(reqBody).error) {
      throw new BadRequestError(INVALID_INPUT);
    }

    this.username = reqBody.username;
    this.firstName = reqBody.firstName;
    this.lastName = reqBody.lastName;
  }
}
