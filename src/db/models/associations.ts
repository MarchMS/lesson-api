// src/db/models/associations.ts

import Lesson from './lesson.model';
import Teacher from './teacher.model';
import Student from './student.model';


Lesson.belongsToMany(Teacher, {
  through: 'lesson_teachers',
  as: 'teachers',
  foreignKey: 'lesson_id',
  otherKey: 'teacher_id',
  timestamps: false,
});

Teacher.belongsToMany(Lesson, {
  through: 'lesson_teachers',
  as: 'lessons',
  foreignKey: 'teacher_id',
  otherKey: 'lesson_id',
  timestamps: false,
});


Lesson.belongsToMany(Student, {
  through: 'lesson_students',
  as: 'students',
  foreignKey: 'lesson_id',
  otherKey: 'student_id',
  timestamps: false,
});

Student.belongsToMany(Lesson, {
  through: 'lesson_students',
  as: 'lessons',
  foreignKey: 'student_id',
  otherKey: 'lesson_id',
  timestamps: false,
});