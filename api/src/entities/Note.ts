import {NoteCategories} from '@/constants/enums';

export default class Note {
  public readonly id?: string;
  public readonly title: string;
  public readonly content: string;
  public readonly category: NoteCategories;
  public readonly userId: string;
  public readonly isArchived: boolean;
  public readonly modifiedAt: Date;
  public readonly createdAt: Date;

  constructor({
    id,
    title,
    content,
    category,
    userId,
    isArchived,
    modifiedAt,
    createdAt
  }: {
    id?: string;
    title: string;
    content: string;
    category: NoteCategories;
    userId: string;
    isArchived?: boolean;
    modifiedAt?: Date;
    createdAt?: Date;
  }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.category = category;
    this.userId = userId;
    this.isArchived = isArchived || true;

    const now = new Date();
    this.createdAt = createdAt || now;
    this.modifiedAt = modifiedAt || now;
  }

  update({
    title,
    content,
    category,
    isArchived
  }: {
    title?: string;
    content?: string;
    category?: NoteCategories;
    isArchived?: boolean;
  }): Note {
    return new Note({
      id: this.id,
      userId: this.userId,
      title: title || this.title,
      content: content || this.content,
      category: category || this.category,
      isArchived: isArchived !== undefined ? isArchived : this.isArchived,
      createdAt: this.createdAt
    });
  }
}
