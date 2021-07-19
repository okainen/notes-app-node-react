import Joi from 'joi';
import {Note} from '@/entities';
import {CurrentUser} from '@/entities/valueObjects';
import {
  BadRequestError,
  DataIntegrityError,
  ForbiddenError,
  NotFoundError
} from '@/errors';
import {INoteGateway} from '@/interfaces/gateways';
import {CreateNoteReqModel, UpdateNoteReqModel} from '@/requestModels';
import {NoteResModel} from '@/responseModels';
import {ObjectsHelper} from '@/helpers';
import {NOTE_NOT_FOUND, INVALID_QUERY_PARAMS} from '@/constants/errors';
import {INoteService} from '@/interfaces/services';
import {authorizeUser, validateId, getFieldsQuery} from './helpers/interfaces';

export default class NoteService implements INoteService {
  constructor(
    private noteGateway: INoteGateway,
    private authorizeUser: authorizeUser,
    private validateId: validateId,
    private getFieldsQuery: getFieldsQuery
  ) {}

  private async entityToResModel(note: Note, fields: string[] | null = null) {
    const {id, title, content, isArchived, category, modifiedAt, createdAt} =
      fields ? ObjectsHelper.projection(note, fields) : note;

    return new NoteResModel(
      id!,
      title,
      content,
      category,
      isArchived,
      modifiedAt,
      createdAt
    );
  }

  async create(currentUser: CurrentUser | null, reqModel: CreateNoteReqModel) {
    this.authorizeUser(currentUser);

    const {title, content, category} = reqModel;

    const note = await this.noteGateway.create(
      new Note({
        userId: currentUser!.id,
        title,
        content,
        category
      })
    );

    return this.entityToResModel(note);
  }

  private async getNote(id: string) {
    if (!this.validateId(id)) {
      throw new NotFoundError(NOTE_NOT_FOUND);
    }

    const note = await this.noteGateway.get(id);
    if (!note) {
      throw new NotFoundError(NOTE_NOT_FOUND);
    }

    return note;
  }

  async get(currentUser: CurrentUser | null, id: string, queryParams: any) {
    this.authorizeUser(currentUser);

    const note = await this.getNote(id);
    const fields = this.getFieldsQuery(queryParams);

    if (note.userId !== currentUser!.id) {
      throw new NotFoundError();
    }

    return await this.entityToResModel(note, fields);
  }

  private titleQueryToRegex(title?: string) {
    // tokenizing query string by extracting words
    const titleTokens = title?.match(/\w+/g);
    return titleTokens
      ? new RegExp(
          `${titleTokens.map(token => `(?=.*\\b${token}\\b)`)}.*`,
          'gi'
        )
      : undefined;
  }

  private getNoteQueryParams(queryParams: any) {
    const querySchema = Joi.object({
      title: Joi.string(),
      userId: Joi.string(),
      fields: Joi.string(),
      page: Joi.number()
    });

    if (querySchema.validate(queryParams).error) {
      throw new BadRequestError(INVALID_QUERY_PARAMS);
    }

    const validQueryParams = queryParams as {
      title?: string;
      userId?: string;
      fields?: string;
      page?: number;
    };

    return {
      ...validQueryParams,
      title: this.titleQueryToRegex(validQueryParams.title),
      fields: validQueryParams.fields
        ? validQueryParams.fields.split(',')
        : null
    };
  }

  async getAll(currentUser: CurrentUser | null, queryParams: any) {
    const {title, userId, fields, page} = this.getNoteQueryParams(queryParams);

    if (currentUser) {
      const filterParams = ObjectsHelper.deleteUndefinedFields({
        title: title,
        userId
      });
      const notes = await this.noteGateway.getAll(
        filterParams,
        queryParams?.page
      );

      return await Promise.all(
        notes.map((note: Note) => {
          return this.entityToResModel(note, fields);
        })
      );
    }

    const filterParams = ObjectsHelper.deleteUndefinedFields({
      userId,
      title,
      isArchived: true
    });

    const notes = await this.noteGateway.getAll(filterParams, page);
    return await Promise.all(
      notes.map((note: Note) => {
        if (currentUser) {
          return this.entityToResModel(note, fields);
        }
        return this.entityToResModel(note, fields);
      })
    );
  }

  async update(
    currentUser: CurrentUser | null,
    id: string,
    reqModel: UpdateNoteReqModel
  ) {
    this.authorizeUser(currentUser);

    const note = await this.getNote(id);
    if (currentUser!.id !== note.userId) {
      throw new NotFoundError();
    }

    const {title, content, category, isArchived} = reqModel;

    const updatedNote = await this.noteGateway.update(
      note.update({
        title,
        content,
        category,
        isArchived
      })
    );
    if (!updatedNote) {
      throw new DataIntegrityError(NOTE_NOT_FOUND);
    }

    return this.entityToResModel(updatedNote);
  }

  async delete(currentUser: CurrentUser | null, id: string) {
    this.authorizeUser(currentUser);

    const note = await this.getNote(id);

    const deletedNote = await this.noteGateway.delete(id);
    if (!deletedNote) {
      throw new DataIntegrityError(NOTE_NOT_FOUND);
    }

    return this.entityToResModel(deletedNote);
  }
}
