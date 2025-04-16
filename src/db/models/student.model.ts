import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db';

class Student extends Model {
  public id!: number;
  public name!: string;
}

Student.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: 'students', timestamps: false }
);

export default Student;