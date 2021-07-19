import {RefreshToken} from '@/entities';

class RefreshTokenPersistenceModel {
  constructor(
    public readonly userId: string,
    public readonly ttl: number,
    public readonly createdAt: Date
  ) {}
}

export default class RefreshTokenMapper {
  public static toPersistence(token: RefreshToken) {
    const {userId, ttl, createdAt} = token;
    return new RefreshTokenPersistenceModel(userId, ttl, createdAt);
  }
}
