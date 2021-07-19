import {INVALID_QUERY_PARAMS} from '@/constants/errors';
import {BadRequestError} from '@/errors';
import Joi from 'joi';

export default (queryParams: any) => {
  const querySchema = Joi.object({
    fields: Joi.array().items(Joi.string())
  });

  if (querySchema.validate(queryParams).error) {
    throw new BadRequestError(INVALID_QUERY_PARAMS);
  }

  const validQueryParams = queryParams as {
    fields?: string[];
  };

  return validQueryParams.fields || null;
};
