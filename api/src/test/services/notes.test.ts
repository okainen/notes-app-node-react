import {NoteCategories} from '@/constants/enums';
import {Note} from '@/entities';
import {CurrentUser} from '@/entities/valueObjects';
import {INoteGateway} from '@/interfaces/gateways';
import {NoteService} from '@/services';
import {authorizeUser, getFieldsQuery} from '@/services/helpers';
import {NoteResModel} from '@/responseModels';
import {NotFoundError, UnauthorizedError} from '@/errors';

const currentUser = new CurrentUser('1');

const createNoteReqModel = {
  get title() {
    return 'title';
  },
  get content() {
    return 'content';
  },
  get category() {
    return NoteCategories.IDEA;
  }
};
const createdNote = new Note({...createNoteReqModel, userId: currentUser.id});
const note = new Note({
  ...createdNote,
  id: '1'
});
const noteResModel = new NoteResModel(
  note.id!,
  note.title,
  note.content,
  note.category,
  note.isArchived,
  note.modifiedAt,
  note.createdAt
);

const updateNoteReqModel = {
  get title() {
    return 'title_updated';
  },
  get content() {
    return 'content_updated';
  }
};
const updatedNote = new Note({
  ...note,
  ...updateNoteReqModel
});
const updatedNoteResModel = {...updatedNote, userId: undefined} as NoteResModel;

const noteGateway = {
  create: jest.fn().mockResolvedValue(note),
  get: jest
    .fn()
    .mockResolvedValueOnce(note)
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce(note)
    .mockResolvedValueOnce(note)
    .mockResolvedValueOnce(updatedNote),
  // .mockResolvedValueOnce(null),
  // .mockResolvedValueOnce(null)
  // .mockResolvedValueOnce(note),
  getCount: jest.fn().mockResolvedValue(2),
  getAll: jest.fn().mockResolvedValue([
    note,
    new Note({
      ...note,
      id: '2',
      title: 'title_2'
    })
  ]),
  update: jest.fn().mockResolvedValue(updatedNote),
  delete: jest.fn().mockResolvedValue(updatedNote)
} as INoteGateway;

const validateId = jest
  .fn()
  .mockReturnValueOnce(false)
  .mockReturnValueOnce(true)
  .mockReturnValueOnce(true)
  .mockReturnValueOnce(true)
  .mockReturnValueOnce(false)
  .mockReturnValueOnce(true)
  .mockReturnValueOnce(true);
// .mockReturnValueOnce(true)
// .mockReturnValueOnce(true);

const noteService = new NoteService(
  noteGateway,
  authorizeUser,
  validateId,
  getFieldsQuery
);

describe('create', () => {
  it('should return NoteResModel', () => {
    expect(
      noteService.create(currentUser, createNoteReqModel)
    ).resolves.toEqual(noteResModel);
  });

  it('should throw UnauthorizedError if currentUser is null', () => {
    expect(noteService.create(null, createNoteReqModel)).rejects.toThrow(
      UnauthorizedError
    );
  });
});

describe('get', () => {
  it('should throw UnauthorizedError if currentUser is null', () => {
    expect(noteService.get(null, note.id!, {})).rejects.toThrow(
      UnauthorizedError
    );
  });

  it('should throw NotFoundError if provided id is not valid', () => {
    expect(noteService.get(currentUser, '', {})).rejects.toThrow(NotFoundError);
  });

  it('should return NoteResModel', () => {
    expect(noteService.get(currentUser, note.id!, {})).resolves.toEqual(
      noteResModel
    );
  });

  it('should throw NotFoundError if note was not found', () => {
    expect(noteService.get(currentUser, '3', {})).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw NotFoundError if note was created by another user', () => {
    expect(noteService.get(new CurrentUser('2'), '1', {})).rejects.toThrow(
      NotFoundError
    );
  });
});

describe('update', () => {
  it('should throw UnauthorizedError if currentUser is null', () => {
    expect(
      noteService.update(null, note.id!, updateNoteReqModel)
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw NotFoundError if provided id is not valid', () => {
    expect(
      noteService.update(currentUser, '', updateNoteReqModel)
    ).rejects.toThrow(NotFoundError);
  });

  it('should return NoteResModel', () => {
    expect(
      noteService.update(currentUser, note.id!, updateNoteReqModel)
    ).resolves.toEqual(updatedNoteResModel);
  });

  // it('should throw NotFoundError if note was not found', () => {
  //   expect(
  //     noteService.update(currentUser, '3', updateNoteReqModel)
  //   ).rejects.toThrow(NotFoundError);
  // });

  // it('should throw NotFoundError if note was created by another user', () => {
  //   expect(
  //     noteService.update(new CurrentUser('2'), '1', updateNoteReqModel)
  //   ).rejects.toThrow(NotFoundError);
  // });
});
