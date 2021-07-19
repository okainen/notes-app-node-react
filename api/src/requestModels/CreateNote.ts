import Joi from 'joi';
import {BadRequestError} from '@/errors';
import {NoteCategories} from '@/constants/enums';
import {INVALID_INPUT} from '@/constants/errors';

export default class CreateNote {
  public readonly title: string;
  public readonly content: string;
  public readonly category: NoteCategories;

  constructor(reqBody: any) {
    const schema = Joi.object({
      title: Joi.string().min(1).required(),
      content: Joi.string().min(1).required(),
      category: Joi.string().valid(
        NoteCategories.TASK,
        NoteCategories.IDEA,
        NoteCategories.RANDOM_THOUGHT
      )
    });
    if (schema.validate(reqBody).error) {
      throw new BadRequestError(INVALID_INPUT);
    }

    this.title = reqBody.title;
    this.content = reqBody.content;
    this.category = reqBody.category;
  }
}
