import {CurrentUser, TokenPair} from '@/entities/valueObjects';
import {
  CreateUserReqModel,
  ResetForgottenPasswordReqModel,
  ResetPasswordReqModel,
  UpdateUserReqModel,
  UserCredentialsReqModel,
  UserEmailReqModel
} from '@/requestModels';
import {UserResModel} from '@/responseModels';

export default interface IUserService {
  signUp: (
    currentUser: CurrentUser | null,
    reqModel: CreateUserReqModel
  ) => Promise<UserResModel>;

  get: (
    currentUser: CurrentUser | null,
    id: string,
    queryParams: any
  ) => Promise<UserResModel>;

  getCurrent: (
    currentUser: CurrentUser | null,
    queryParams: any
  ) => Promise<UserResModel>;

  signIn: (
    currentUser: CurrentUser | null,
    reqModel: UserCredentialsReqModel
  ) => Promise<TokenPair>;

  useRefreshToken: (refreshTokenId: string | null) => Promise<TokenPair>;

  signOut: (currentUser: CurrentUser | null) => Promise<void>;

  activate: (currentUser: CurrentUser | null, token: string) => Promise<void>;

  update: (
    currentUser: CurrentUser | null,
    reqModel: UpdateUserReqModel
  ) => Promise<UserResModel>;

  resetPassword: (
    currentUser: CurrentUser | null,
    reqModel: ResetPasswordReqModel
  ) => Promise<void>;

  resetEmail: (
    currentUser: CurrentUser | null,
    reqModel: UserEmailReqModel
  ) => Promise<void>;

  verifyEmailReset: (token: string) => Promise<void>;

  resetForgottenPassword: (
    currentUser: CurrentUser | null,
    reqModel: ResetForgottenPasswordReqModel
  ) => Promise<void>;

  verifyForgottenPasswordReset: (token: string) => Promise<void>;
}
