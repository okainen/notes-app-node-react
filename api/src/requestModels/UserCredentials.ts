import Joi from 'joi';
import {BadRequestError} from '@/errors';
import {INVALID_INPUT} from '@/constants/errors';

export default class UserCredentials {
  public readonly email: string;
  public readonly password: string;

  constructor(reqBody: any) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(1).required()
    });
    if (schema.validate(reqBody).error) {
      throw new BadRequestError(INVALID_INPUT);
    }

    this.email = reqBody.email;
    this.password = reqBody.password;
  }
}
