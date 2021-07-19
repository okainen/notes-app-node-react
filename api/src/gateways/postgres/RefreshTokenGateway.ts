import {RefreshToken} from '@/entities';
import {IRefreshTokenGateway} from '@/interfaces/gateways';
import {RefreshTokenMapper} from '@/mappers';
import {RefreshTokenAttrs as RefreshTokenRec} from './models/interfaces';
import {RefreshTokenModel} from './models/RefreshToken';

export default class RefreshTokenGateway implements IRefreshTokenGateway {
  RefreshTokenModel: RefreshTokenModel;

  constructor(RefreshTokenModel: RefreshTokenModel) {
    this.RefreshTokenModel = RefreshTokenModel;
  }

  private recToEntity(entityRec: RefreshTokenRec) {
    const {id, userId, ttl, createdAt} = entityRec;
    return new RefreshToken({id, userId, ttl, createdAt});
  }

  async create(entity: RefreshToken): Promise<RefreshToken> {
    const entityRec = await this.RefreshTokenModel.create(
      RefreshTokenMapper.toPersistence(entity)
    );

    return this.recToEntity(entityRec);
  }

  async get(id: string): Promise<RefreshToken | null> {
    const entityRec = await this.RefreshTokenModel.findByPk(id);
    if (!entityRec) {
      return null;
    }

    return this.recToEntity(entityRec);
  }

  async getByUserId(userId: string): Promise<RefreshToken | null> {
    const entityRec = await this.RefreshTokenModel.findOne({where: {userId}});
    if (!entityRec) {
      return null;
    }

    return this.recToEntity(entityRec);
  }

  async delete(id: string): Promise<RefreshToken | null> {
    const entityRec = await this.RefreshTokenModel.findByPk(id);
    if (!entityRec) {
      return null;
    }

    await this.RefreshTokenModel.destroy({where: {id}});

    return this.recToEntity(entityRec);
  }
}
