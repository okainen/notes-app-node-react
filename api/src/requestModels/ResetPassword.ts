import Joi from 'joi';
import {BadRequestError} from '@/errors';
import { INVALID_INPUT } from '@/constants/errors';

export default class UserCredentials {
  public readonly oldPassword: string;
  public readonly newPassword: string;

  constructor(reqBody: any) {
    const schema = Joi.object({
      oldPassword: Joi.string().min(8).max(128).required(),
      newPassword: Joi.string().min(8).max(128).required()
    });
    if (schema.validate(reqBody).error) {
      throw new BadRequestError(INVALID_INPUT);
    }

    this.oldPassword = reqBody.oldPassword;
    this.newPassword = reqBody.newPassword;
  }
}
