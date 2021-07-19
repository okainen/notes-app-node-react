import {User} from '@/entities';
import {UserMapper} from '@/mappers';
import {UserAttrs as UserRec} from './models/interfaces';
import {UserModel} from './models/User';

export default class UserGateway {
  private UserModel: UserModel;

  constructor(UserModel: UserModel) {
    this.UserModel = UserModel;
  }

  private recToEntity(entityRec: UserRec) {
    const {
      id,
      email,
      password,
      username,
      firstName,
      lastName,
      isActive,
      modifiedAt,
      createdAt
    } = entityRec;
    return new User({
      id,
      email,
      password,
      username,
      firstName,
      lastName: lastName || undefined,
      isActive,
      modifiedAt,
      createdAt
    });
  }

  async get(id: string): Promise<User | null> {
    const entityRec = await this.UserModel.findByPk(id);
    if (!entityRec) {
      return null;
    }

    return this.recToEntity(entityRec);
  }

  async getByEmail(email: string): Promise<User | null> {
    const entityRec = await this.UserModel.findOne({where: {email}});
    if (!entityRec) {
      return null;
    }

    return this.recToEntity(entityRec);
  }

  async getByUsername(username: string): Promise<User | null> {
    const entityRec = await this.UserModel.findOne({where: {username}});
    if (!entityRec) {
      return null;
    }

    return this.recToEntity(entityRec);
  }

  async create(entity: User): Promise<User> {
    const entityRec = await this.UserModel.create(
      UserMapper.toPersistence(entity)
    );

    return this.recToEntity(entityRec);
  }

  async update(entity: User): Promise<User | null> {
    const entityRec = await this.UserModel.findByPk(entity.id!);
    if (!entityRec) {
      return null;
    }

    return this.recToEntity(
      await entityRec.update(UserMapper.toPersistence(entity))
    );
  }

  async delete(id: string): Promise<User | null> {
    const entityRec = await this.UserModel.findByPk(id);
    if (!entityRec) {
      return null;
    }

    await this.UserModel.destroy({where: {id}});

    return this.recToEntity(entityRec);
  }
}
