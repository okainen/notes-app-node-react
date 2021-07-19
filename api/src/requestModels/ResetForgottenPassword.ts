import Joi from 'joi';
import {BadRequestError} from '@/errors';
import { INVALID_INPUT } from '@/constants/errors';

export default class ResetForgottenPassword {
  public readonly email: string;
  public readonly newPassword: string;

  constructor(reqBody: any) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      newPassword: Joi.string().min(8).max(128).required()
    });
    if (schema.validate(reqBody).error) {
      throw new BadRequestError(INVALID_INPUT);
    }

    this.email = reqBody.email;
    this.newPassword = reqBody.newPassword;
  }
}
