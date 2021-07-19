import {CurrentUser} from '@/entities/valueObjects';
import {CreateNoteReqModel, UpdateNoteReqModel} from '@/requestModels';
import {NoteResModel} from '@/responseModels';

export default interface INoteService {
  create: (
    currentUser: CurrentUser | null,
    reqModel: CreateNoteReqModel
  ) => Promise<NoteResModel>;

  get: (
    currentUser: CurrentUser | null,
    id: string,
    queryParams: any
  ) => Promise<NoteResModel>;

  getAll: (
    currentUser: CurrentUser | null,
    queryParams: any
  ) => Promise<NoteResModel[]>;

  update: (
    currentUser: CurrentUser | null,
    id: string,
    reqModel: UpdateNoteReqModel
  ) => Promise<NoteResModel>;

  delete: (
    currentUser: CurrentUser | null,
    id: string
  ) => Promise<NoteResModel>;
}
