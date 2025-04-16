
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db';

class Lesson extends Model {
  public id!: number;
  public date!: string;
  public title!: string;
  public status!: number;
}

Lesson.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: 'lessons', timestamps: false }
);

export default Lesson;