import {Note} from '@/entities';
import {INoteGateway} from '@/interfaces/gateways';
import {NoteMapper} from '@/mappers';
import {NoteAttrs as NoteRec} from './models/interfaces';
import {NoteModel} from './models/Note';

export default class NoteGateway implements INoteGateway {
  NoteModel: NoteModel;

  constructor(NoteModel: NoteModel) {
    this.NoteModel = NoteModel;
  }

  private recToEntity(entityRec: NoteRec) {
    const {
      id,
      userId,
      title,
      content,
      category,
      isArchived,
      modifiedAt,
      createdAt
    } = entityRec;
    return new Note({
      id,
      userId,
      title,
      content,
      category,
      isArchived,
      modifiedAt,
      createdAt
    });
  }

  async get(id: string): Promise<Note | null> {
    const entityRec = await this.NoteModel.findByPk(id);
    if (!entityRec) {
      return null;
    }

    return this.recToEntity(entityRec);
  }

  async getCount(filterParams: {
    userId?: string;
    title?: RegExp;
    isArchived?: boolean;
  }): Promise<number> {
    const {count} = await this.NoteModel.findAndCountAll({
      where: {
        ...filterParams,
        title: {$regexp: filterParams.title!.toString()}
      }
    });

    return count;
  }

  async getAll(
    filterParams: {
      userId?: string;
      title?: RegExp;
      isArchived?: boolean;
    },
    page: number = 1,
    pageSize: number = 10
  ): Promise<Note[]> {
    const count = await this.getCount(filterParams);
    const offset = (page - 1) * pageSize;
    const limit = Math.min(count - offset, pageSize);

    const entityRecs = await this.NoteModel.findAll({
      where: {
        ...filterParams,
        title: {$regexp: filterParams.title!.toString()}
      },
      order: ['createdAt', 'DESC'],
      offset,
      limit
    });

    return entityRecs.map(rec => this.recToEntity(rec));
  }

  async create(entity: Note): Promise<Note> {
    const entityRec = await this.NoteModel.create(
      NoteMapper.toPersistence(entity)
    );

    return this.recToEntity(entityRec);
  }

  async update(entity: Note): Promise<Note | null> {
    const entityRec = await this.NoteModel.findByPk(entity.id!);
    if (!entityRec) {
      return null;
    }

    return this.recToEntity(
      await entityRec.update(NoteMapper.toPersistence(entity))
    );
  }

  async delete(id: string): Promise<Note | null> {
    const entityRec = await this.NoteModel.findByPk(id);
    if (!entityRec) {
      return null;
    }

    await this.NoteModel.destroy({where: {id}});

    return this.recToEntity(entityRec);
  }
}
