import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db';

class Teacher extends Model {
  public id!: number;
  public name!: string;
}

Teacher.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: 'teachers', timestamps: false }
);

export default Teacher;