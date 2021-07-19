import {Request, Response} from 'express';
import {
  CreateUserReqModel,
  UpdateUserReqModel,
  UserCredentialsReqModel,
  ResetPasswordReqModel,
  UserEmailReqModel,
  ResetForgottenPasswordReqModel
} from '@/requestModels';
import {toJson} from './helpers';
import {RefreshToken} from '@/entities';
import config from '@/config';
import {IUserService} from '@/interfaces/services';

export default class UserController {
  constructor(private userService: IUserService) {}

  signUp = async (req: Request, res: Response) => {
    await this.userService.signUp(
      req.currentUser!,
      new CreateUserReqModel(req.body)
    );
    res.status(201).end();
  };

  activate = async (req: Request, res: Response) => {
    await this.userService.activate(req.currentUser!, req.params.token);
    res.status(200).end();
  };

  resetPassword = async (req: Request, res: Response) => {
    await this.userService.resetPassword(
      req.currentUser!,
      new ResetPasswordReqModel(req.body)
    );
    res.status(200).end();
  };

  resetForgottenPassword = async (req: Request, res: Response) => {
    await this.userService.resetForgottenPassword(
      req.currentUser!,
      new ResetForgottenPasswordReqModel(req.body)
    );
    res.status(200).end();
  };

  verifyForgottenPasswordReset = async (req: Request, res: Response) => {
    await this.userService.verifyForgottenPasswordReset(req.params.token);
    res.status(200).end();
  };

  resetEmail = async (req: Request, res: Response) => {
    await this.userService.resetEmail(
      req.currentUser!,
      new UserEmailReqModel(req.body)
    );
    res.status(200).end();
  };

  verifyEmailReset = async (req: Request, res: Response) => {
    await this.userService.verifyEmailReset(req.params.token);
    res.status(200).end();
  };

  private setRefreshTokenCookie(res: Response, token: RefreshToken) {
    return res.cookie('refresh-token', token.id, {
      expires: new Date(Date.now() + token.ttl * 1000 * 60),
      httpOnly: true,
      signed: true
    });
  }

  signIn = async (req: Request, res: Response) => {
    const {accessToken, refreshToken} = await this.userService.signIn(
      req.currentUser!,
      new UserCredentialsReqModel(req.body)
    );

    res.status(200).header({'x-access-token': accessToken}).end();
  };

  useRefreshToken = async (req: Request, res: Response) => {
    const refreshTokenId = req.cookies['refresh-token'];
    const {accessToken, refreshToken} = await this.userService.useRefreshToken(
      refreshTokenId || null
    );
    res.status(200).header({'x-access-token': accessToken}).end();
  };

  get = async (req: Request, res: Response) => {
    const resModel = await this.userService.get(
      req.currentUser!,
      req.params.id,
      req.query
    );
    res.status(200).json(toJson(resModel));
  };

  getCurrent = async (req: Request, res: Response) => {
    const resModel = await this.userService.getCurrent(
      req.currentUser!,
      req.query
    );
    res.status(200).json(toJson(resModel));
  };

  update = async (req: Request, res: Response) => {
    const resModel = await this.userService.update(
      req.currentUser!,
      new UpdateUserReqModel(req.body)
    );
    res.status(200).json(toJson(resModel));
  };

  signOut = async (req: Request, res: Response) => {
    await this.userService.signOut(req.currentUser);
    res.status(200).clearCookie('refresh-token').end();
  };
}
