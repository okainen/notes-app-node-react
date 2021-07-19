import {RefreshToken} from '..';

export default class TokenPair {
  constructor(
    public readonly refreshToken: RefreshToken,
    public readonly accessToken: string
  ) {}
}
