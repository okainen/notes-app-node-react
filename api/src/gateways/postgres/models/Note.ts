import {NoteCategories} from '@/constants/enums';
import {Sequelize, DataTypes, Model} from 'sequelize';
import {dateType} from './common';
import {CreateNoteAttrs, NoteAttrs} from './interfaces';

class Note extends Model<NoteAttrs, CreateNoteAttrs> implements NoteAttrs {
  public readonly id!: string;
  public readonly userId!: string;
  public title!: string;
  public content!: string;
  public category!: NoteCategories;
  public isArchived: boolean = false;

  public readonly createdAt!: Date;
  public readonly modifiedAt!: Date;
}

export type NoteModel = typeof Note;

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
  title: {field: 'title', type: DataTypes.STRING, allowNull: false},
  content: {field: 'content', type: DataTypes.STRING, allowNull: false},
  category: {
    field: 'category',
    type: DataTypes.ENUM(
      NoteCategories.IDEA,
      NoteCategories.RANDOM_THOUGHT,
      NoteCategories.TASK
    ),
    allowNull: false
  },
  isArchived: {
    field: 'is_archived',
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  modifiedAt: {...dateType, field: 'modified_at'},
  createdAt: {...dateType, field: 'created_at'}
};

export default (connection: Sequelize) =>
  Note.init(schema, {
    tableName: 'notes',
    sequelize: connection,
    timestamps: false
  });
