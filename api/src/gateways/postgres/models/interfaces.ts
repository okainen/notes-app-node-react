import {Optional} from 'sequelize';
import {NoteCategories} from '@/constants/enums';

export interface UserAttrs {
  id: string;
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string | null;
  isActive: boolean;
  modifiedAt: Date;
  createdAt: Date;
}

export interface CreateUserAttrs extends Optional<UserAttrs, 'id'> {}

export interface RefreshTokenAttrs {
  id: string;
  userId: string;
  ttl: number;
  createdAt: Date;
}

export interface CreateRefreshTokenAttrs
  extends Optional<RefreshTokenAttrs, 'id'> {}

export interface NoteAttrs {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: NoteCategories;
  isArchived?: boolean;
  modifiedAt: Date;
  createdAt: Date;
}

export interface CreateNoteAttrs extends Optional<NoteAttrs, 'id'> {}
