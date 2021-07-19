import {EventEmitter} from 'events';
import postgresConnection from '@/db/postgres';
import {
  makeUserModel,
  makeNoteModel,
  makeRefreshTokenModel
} from '@/gateways/postgres/models';
import {
  UserGateway,
  NoteGateway,
  RefreshTokenGateway
} from '@/gateways/postgres';
import {UserService, MailerService, NoteService} from '@/services';
import {UserController, NoteController} from '@/controllers';
import {
  HashingHelper,
  authorizeUser,
  validateUuid,
  getFieldsQuery
} from '@/services/helpers';
import config from '@/config';
import {emailSubscriber} from './subscribers';

const UserModel = makeUserModel(postgresConnection);

const RefreshTokenModel = makeRefreshTokenModel(postgresConnection);

const NoteModel = makeNoteModel(postgresConnection);

import sequelize from '@/db/postgres';
(async () => {
  await sequelize.sync();
  console.log('All models were synchronized successfully.');
})();

const userGateway = new UserGateway(UserModel);

const refreshTokenGateway = new RefreshTokenGateway(RefreshTokenModel);

const noteGateway = new NoteGateway(NoteModel);

const {
  app: {
    email: {host, username, password}
  }
} = config;

const hashingHelper = new HashingHelper();

const mailerService = new MailerService(host, {
  username: username,
  password: password
});

const emitter = new EventEmitter();

emailSubscriber(emitter, mailerService);

const userService = new UserService(
  userGateway,
  refreshTokenGateway,
  hashingHelper,
  authorizeUser,
  validateUuid,
  getFieldsQuery,
  emitter
);

const noteService = new NoteService(
  noteGateway,
  authorizeUser,
  validateUuid,
  getFieldsQuery
);

export const userController = new UserController(userService);

export const noteController = new NoteController(noteService);
