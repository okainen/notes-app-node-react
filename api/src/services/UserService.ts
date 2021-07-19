import jwt from 'jsonwebtoken';
import {EventEmitter} from 'events';
import {RefreshToken, User} from '@/entities';
import {CurrentUser} from '@/entities/valueObjects';
import {
  BadRequestError,
  ConflictError,
  DataIntegrityError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError
} from '@/errors';
import {IRefreshTokenGateway, IUserGateway} from '@/interfaces/gateways';
import {
  authorizeUser,
  HashingHelper,
  validateId,
  getFieldsQuery
} from './helpers/interfaces';
import {
  CreateUserReqModel,
  ResetForgottenPasswordReqModel,
  ResetPasswordReqModel,
  UpdateUserReqModel,
  UserCredentialsReqModel,
  UserEmailReqModel
} from '@/requestModels';
import {UserResModel} from '@/responseModels';
import config from '@/config';
import {ObjectsHelper} from '@/helpers';
import {
  INVALID_REFRESH_TOKEN_PROVIDED,
  REFRESH_TOKEN_EXPIRED,
  REFRESH_TOKEN_NOT_FOUND,
  REFRESH_TOKEN_NOT_PROVIDED,
  USER_NOT_ACTIVE,
  USER_NOT_FOUND,
  USER_WITH_PROVIDED_EMAIL_ALREADY_EXISTS,
  USER_WITH_PROVIDED_USERNAME_ALREADY_EXISTS,
  WRONG_CREDENTIALS_PROVIDED
} from '@/constants/errors';
import {
  EMAIL_RESET_STARTED,
  INACTIVE_USER_SIGNED_IN,
  PASSWORD_RESET,
  PASSWORD_RESET_STARTED,
  USER_ACTIVATED,
  USER_CREATED
} from '@/constants/events';
import {IUserService} from '@/interfaces/services';

const {
  app: {
    activationToken: activationTokenConf,
    accessToken: accessTokenConf,
    refreshToken: refreshTokenConf,
    emailResetToken: emailResetTokenConf,
    passwordResetToken: passwordResetTokenConf
  }
} = config;

export default class UserService implements IUserService {
  constructor(
    private userGateway: IUserGateway,
    private refreshTokenGateway: IRefreshTokenGateway,
    private hashingHelper: HashingHelper,
    private authorizeUser: authorizeUser,
    private validateId: validateId,
    private getFieldsQuery: getFieldsQuery,
    private emitter: EventEmitter
  ) {}

  private entityToResModel(
    user: User,
    currentUser: CurrentUser | null = null,
    fields: string[] | null = null
  ) {
    const {
      id,
      email,
      username,
      firstName,
      lastName,
      imgPath,
      modifiedAt,
      createdAt
    } = fields ? ObjectsHelper.projection(user, fields) : user;

    if (currentUser) {
      if (currentUser!.id === user.id) {
        return new UserResModel(
          id,
          email,
          username,
          firstName,
          lastName,
          imgPath,
          modifiedAt,
          createdAt
        );
      }
    }

    return new UserResModel(
      id,
      undefined,
      username,
      firstName,
      lastName,
      imgPath
    );
  }

  private async generateTokenPair(currentUser: CurrentUser) {
    const createdToken = await this.refreshTokenGateway.create(
      new RefreshToken({
        userId: currentUser.id,
        ttl: Number(refreshTokenConf.ttl)
      })
    );

    const createdAccessToken = jwt.sign(
      {id: currentUser.id},
      accessTokenConf.secret,
      {expiresIn: accessTokenConf.ttl}
    );

    return {refreshToken: createdToken, accessToken: createdAccessToken};
  }

  async signUp(currentUser: CurrentUser | null, reqModel: CreateUserReqModel) {
    const {email, password, username, firstName, lastName} = reqModel;

    const user = await this.userGateway.getByEmail(email);
    if (user) {
      throw new ConflictError(USER_WITH_PROVIDED_EMAIL_ALREADY_EXISTS);
    }

    if (await this.userGateway.getByUsername(username)) {
      throw new ConflictError(USER_WITH_PROVIDED_USERNAME_ALREADY_EXISTS);
    }

    const createdUser = await this.userGateway.create(
      new User({
        email,
        password: await this.hashingHelper.hash(password),
        username,
        firstName,
        lastName
      })
    );

    const activationToken = jwt.sign(
      {userId: createdUser.id},
      activationTokenConf.secret,
      {
        expiresIn: activationTokenConf.ttl
      }
    );

    this.emitter.emit(USER_CREATED, {
      email,
      activationToken
    });

    return this.entityToResModel(createdUser, currentUser);
  }

  async get(currentUser: CurrentUser | null, id: string, queryParams: any) {
    this.authorizeUser(currentUser);

    const fields = this.getFieldsQuery(queryParams);

    const user = await this.userGateway.get(id);
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }

    return this.entityToResModel(user, currentUser, fields);
  }

  async getCurrent(currentUser: CurrentUser | null, queryParams: any) {
    this.authorizeUser(currentUser);

    const fields = this.getFieldsQuery(queryParams);

    const user = await this.userGateway.get(currentUser!.id);
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }

    return this.entityToResModel(user, currentUser, fields);
  }

  async signIn(
    currentUser: CurrentUser | null,
    reqModel: UserCredentialsReqModel
  ) {
    if (currentUser) {
      throw new ForbiddenError();
    }

    const {email, password} = reqModel;

    const user = await this.userGateway.getByEmail(email);
    if (!user) {
      throw new UnauthorizedError(WRONG_CREDENTIALS_PROVIDED);
    }

    if (!user.isActive) {
      const activationToken = jwt.sign(
        {userId: user.id},
        activationTokenConf.secret,
        {expiresIn: activationTokenConf.ttl}
      );

      this.emitter.emit(INACTIVE_USER_SIGNED_IN, {
        email,
        activationToken
      });

      throw new UnauthorizedError(USER_NOT_ACTIVE);
    }

    if (this.hashingHelper.compare(user.password, password)) {
      return await this.generateTokenPair({
        id: user.id!
      });
    }

    throw new UnauthorizedError(WRONG_CREDENTIALS_PROVIDED);
  }

  async useRefreshToken(refreshTokenId: string | null) {
    if (!refreshTokenId) {
      throw new BadRequestError(REFRESH_TOKEN_NOT_PROVIDED);
    }

    const existingToken = await this.refreshTokenGateway.get(refreshTokenId);
    if (!existingToken || !this.validateId(refreshTokenId)) {
      throw new UnauthorizedError(INVALID_REFRESH_TOKEN_PROVIDED);
    }
    if (existingToken.isExpired()) {
      throw new UnauthorizedError(REFRESH_TOKEN_EXPIRED);
    }

    const user = await this.userGateway.get(existingToken.userId);
    if (!user) {
      throw new DataIntegrityError(USER_NOT_FOUND);
    }

    const deletedToken = await this.refreshTokenGateway.delete(refreshTokenId);
    if (!deletedToken) {
      throw new DataIntegrityError(REFRESH_TOKEN_NOT_FOUND);
    }

    return await this.generateTokenPair({
      id: user.id!
    });
  }

  async signOut(currentUser: CurrentUser | null) {
    this.authorizeUser(currentUser);

    const user = await this.userGateway.get(currentUser!.id);
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }

    const refreshToken = await this.refreshTokenGateway.getByUserId(
      currentUser!.id
    );
    if (refreshToken) {
      await this.refreshTokenGateway.delete(refreshToken.id!);
    }
  }

  async activate(currentUser: CurrentUser | null, token: string) {
    if (currentUser) {
      throw new ForbiddenError();
    }

    try {
      const {userId} = jwt.verify(token, activationTokenConf.secret) as {
        userId: string;
      };

      const user = await this.userGateway.get(userId);
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      if (!user.isActive) {
        const activatedUser = await this.userGateway.update(
          user.update({isActive: true})
        );
        if (!activatedUser) {
          throw new DataIntegrityError(USER_NOT_FOUND);
        }

        this.emitter.emit(USER_ACTIVATED, user.email);
      }
    } catch (err) {
      throw new NotFoundError();
    }
  }

  async update(currentUser: CurrentUser | null, reqModel: UpdateUserReqModel) {
    this.authorizeUser(currentUser);

    const user = await this.userGateway.get(currentUser!.id);
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }

    const {username, firstName, lastName} = reqModel;

    if (username) {
      const existingWithUsername = await this.userGateway.getByUsername(
        username
      );
      if (existingWithUsername && existingWithUsername.id !== currentUser!.id) {
        throw new ConflictError(USER_WITH_PROVIDED_USERNAME_ALREADY_EXISTS);
      }
    }

    const updatedUser = await this.userGateway.update(
      user.update({username, firstName, lastName})
    );
    if (!updatedUser) {
      throw new DataIntegrityError(USER_NOT_FOUND);
    }

    return this.entityToResModel(updatedUser, currentUser);
  }

  async resetPassword(
    currentUser: CurrentUser | null,
    reqModel: ResetPasswordReqModel
  ) {
    this.authorizeUser(currentUser);

    const user = await this.userGateway.get(currentUser!.id);
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }

    const {oldPassword, newPassword} = reqModel;
    if (!this.hashingHelper.compare(user.password, oldPassword)) {
      throw new ForbiddenError();
    }

    const updatedUser = await this.userGateway.update(
      user.update({
        password: await this.hashingHelper.hash(newPassword)
      })
    );
    if (!updatedUser) {
      throw new DataIntegrityError(USER_NOT_FOUND);
    }
  }

  async resetEmail(
    currentUser: CurrentUser | null,
    reqModel: UserEmailReqModel
  ) {
    this.authorizeUser(currentUser);

    const user = await this.userGateway.get(currentUser!.id);
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }

    const {email} = reqModel;
    const emailResetToken = jwt.sign({email}, emailResetTokenConf.secret, {
      expiresIn: emailResetTokenConf.ttl
    });

    this.emitter.emit(EMAIL_RESET_STARTED, {email, emailResetToken});
  }

  async verifyEmailReset(token: string) {
    try {
      const {email} = jwt.verify(token, emailResetTokenConf.secret) as {
        email: string;
      };

      const user = await this.userGateway.getByEmail(email);
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      await this.userGateway.update(user.update({email}));
    } catch (err) {
      throw new NotFoundError();
    }
  }

  async resetForgottenPassword(
    currentUser: CurrentUser | null,
    reqModel: ResetForgottenPasswordReqModel
  ) {
    if (currentUser) {
      throw new ForbiddenError();
    }

    const user = await this.userGateway.getByEmail(reqModel.email);
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }

    const {newPassword} = reqModel;
    const passwordResetToken = jwt.sign(
      {userId: user.id, newPassword},
      passwordResetTokenConf.secret,
      {
        expiresIn: passwordResetTokenConf.ttl
      }
    );

    this.emitter.emit(PASSWORD_RESET_STARTED, {
      email: user.email,
      passwordResetToken
    });
  }

  async verifyForgottenPasswordReset(token: string) {
    try {
      const {newPassword, userId} = jwt.verify(
        token,
        passwordResetTokenConf.secret
      ) as {
        userId: string;
        newPassword: string;
      };

      const user = await this.userGateway.get(userId);
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      const updatedUser = await this.userGateway.update(
        user.update({password: await this.hashingHelper.hash(newPassword)})
      );
      if (!updatedUser) {
        throw new DataIntegrityError(USER_NOT_FOUND);
      }

      this.emitter.emit(PASSWORD_RESET, user.email);
    } catch (err) {
      throw new NotFoundError();
    }
  }
}
