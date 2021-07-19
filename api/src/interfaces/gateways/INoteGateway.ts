import {Note} from '@/entities';

export default interface INoteGateway {
  create: (note: Note) => Promise<Note>;
  get: (id: string) => Promise<Note | null>;
  getCount: (filterParams: {
    userId?: string;
    name?: RegExp;
    isArchived?: boolean;
  }) => Promise<number>;
  getAll: (
    filterParams: {
      userId?: string;
      name?: RegExp;
      isArchived?: boolean;
    },
    page?: number,
    pageSize?: number
  ) => Promise<Note[]>;
  update: (note: Note) => Promise<Note | null>;
  delete: (id: string) => Promise<Note | null>;
}
