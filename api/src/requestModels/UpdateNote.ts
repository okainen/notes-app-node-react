import Joi from 'joi';
import {BadRequestError} from '@/errors';
import {NoteCategories} from '@/constants/enums';
import {INVALID_INPUT} from '@/constants/errors';

export default class UpdateNote {
  public readonly title?: string;
  public readonly content?: string;
  public readonly category?: NoteCategories;
  public readonly isArchived?: boolean;

  constructor(reqBody: any) {
    const schema = Joi.object({
      title: Joi.string().min(1),
      content: Joi.string().min(1),
      category: Joi.string().valid(
        NoteCategories.TASK,
        NoteCategories.IDEA,
        NoteCategories.RANDOM_THOUGHT
      ),
      isArchived: Joi.boolean()
    });
    if (schema.validate(reqBody).error) {
      throw new BadRequestError(INVALID_INPUT);
    }

    this.title = reqBody.title;
    this.content = reqBody.content;
    this.category = reqBody.category;
    this.isArchived = reqBody.isArchived;
  }
}
