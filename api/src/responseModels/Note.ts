import {NoteCategories} from '@/constants/enums';

export default class Note {
  constructor(
    public readonly id?: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly category?: NoteCategories,
    public readonly isArchived?: boolean,
    public readonly modifiedAt?: Date,
    public readonly createdAt?: Date
  ) {}
}
