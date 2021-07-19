import Joi from 'joi';
import {BadRequestError} from '@/errors';
import { INVALID_INPUT } from '@/constants/errors';

export default class UserCredentials {
  public readonly email: string;

  constructor(reqBody: any) {
    const schema = Joi.object({
      email: Joi.string().email().required()
    });
    if (schema.validate(reqBody).error) {
      throw new BadRequestError(INVALID_INPUT);
    }

    this.email = reqBody.email;
  }
}
