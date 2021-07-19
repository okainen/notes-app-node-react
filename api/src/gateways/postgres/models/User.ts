import {Sequelize, DataTypes, Model} from 'sequelize';
import {dateType} from './common';
import {CreateUserAttrs, UserAttrs} from './interfaces';

class User extends Model<UserAttrs, CreateUserAttrs> implements UserAttrs {
  public readonly id!: string;
  public email!: string;
  public password!: string;
  public username!: string;
  public firstName!: string;
  public lastName!: string | null;
  public isActive!: boolean;

  public readonly modifiedAt!: Date;
  public readonly createdAt!: Date;
}

export type UserModel = typeof User;

const schema = {
  id: {
    field: 'id',
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  email: {
    field: 'email',
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {field: 'password', type: DataTypes.STRING, allowNull: false},
  username: {
    field: 'username',
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  firstName: {field: 'first_name', type: DataTypes.STRING, allowNull: false},
  lastName: {field: 'last_name', type: DataTypes.STRING},
  isActive: {field: 'is_active', type: DataTypes.BOOLEAN, defaultValue: false},
  modifiedAt: {...dateType, field: 'modified_at'},
  createdAt: {...dateType, field: 'created_at'}
};

export default (connection: Sequelize) =>
  User.init(schema, {
    tableName: 'users',
    sequelize: connection,
    timestamps: false
  });
