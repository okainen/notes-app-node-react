import {User} from '@/entities';

class UserPersistenceModel {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly username: string,
    public readonly firstName: string,
    public readonly lastName: string | null,
    public readonly isActive: boolean,
    public readonly modifiedAt: Date,
    public readonly createdAt: Date
  ) {}
}

export default class UserMapper {
  public static toPersistence(user: User) {
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      isActive,
      modifiedAt,
      createdAt
    } = user;
    return new UserPersistenceModel(
      email,
      password,
      username,
      firstName,
      lastName || null,
      isActive,
      modifiedAt,
      createdAt
    );
  }
}
