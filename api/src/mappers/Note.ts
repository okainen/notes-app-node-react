import {NoteCategories} from '@/constants/enums';
import {Note} from '@/entities';

class NotePersistenceModel {
  constructor(
    public readonly userId: string,
    public readonly title: string,
    public readonly content: string,
    public readonly isArchived: boolean,
    public readonly category: NoteCategories,
    public readonly modifiedAt: Date,
    public readonly createdAt: Date
  ) {}
}

export default class NoteMapper {
  public static toPersistence(note: Note) {
    const {
      userId,
      title,
      content,
      isArchived,
      category,
      modifiedAt,
      createdAt
    } = note;
    return new NotePersistenceModel(
      userId,
      title,
      content,
      isArchived,
      category,
      modifiedAt,
      createdAt
    );
  }
}
