import {Sequelize, DataTypes, Model} from 'sequelize';
import {dateType} from './common';
import {CreateRefreshTokenAttrs, RefreshTokenAttrs} from './interfaces';

class RefreshToken
  extends Model<RefreshTokenAttrs, CreateRefreshTokenAttrs>
  implements RefreshTokenAttrs
{
  public readonly id!: string;
  public readonly userId!: string;
  public readonly ttl!: number;
  public readonly createdAt!: Date;
}

export type RefreshTokenModel = typeof RefreshToken;

const schema = {
  id: {
    field: 'id',
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  userId: {
    field: 'user_id',
    type: DataTypes.UUID,
    allowNull: false
  },
  ttl: {field: 'ttl', type: DataTypes.INTEGER, allowNull: false},
  createdAt: {...dateType, field: 'created_at'}
};

export default (connection: Sequelize) =>
  RefreshToken.init(schema, {
    tableName: 'refresh_tokens',
    sequelize: connection,
    timestamps: false
  });
