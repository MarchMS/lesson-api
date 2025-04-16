import { Op } from 'sequelize';
import Lesson from '../../db/models/lesson.model';
import Teacher from '../../db/models/teacher.model';
import Student from '../../db/models/student.model';
import { handleDate } from './helpers/handleDate';
import { filterByStudentCount } from './helpers/filterByStudentCount';

export const getLessonsService = async (
  filters: {
    date?: string;
    status?: number;
    teacherIds?: string;
    studentsCount?: string;
  },
  page: number,
  lessonsPerPage: number
) => {
  const { date, status, teacherIds, studentsCount } = filters;
  const whereConditions: any = {};

  if (date) {
    Object.assign(whereConditions, handleDate(date));
  }

  if (status !== undefined) {
    whereConditions.status = status;
  }

  const teacherFilter = teacherIds
    ? { id: { [Op.in]: teacherIds.split(',').map(Number) } }
    : undefined;

  let lessons;
  try {
    lessons = await Lesson.findAll({
      where: whereConditions,
      include: [
        {
          model: Teacher,
          as: 'teachers',
          attributes: ['id', 'name'],
          where: teacherFilter,
          required: !!teacherFilter,
        },
        {
          model: Student,
          as: 'students',
          attributes: ['id', 'name'],
          through: { attributes: ['visit'] },
          required: false,
        },
      ],
      offset: (page - 1) * lessonsPerPage,
      limit: lessonsPerPage,
      subQuery: false,
    });
  } catch (error: any) {
    console.error('❌ Ошибка при выполнении запроса:', error.message);
    console.dir(error, { depth: 5 }); // ← покажет больше деталей
    throw error;
  }

  let filteredLessons = lessons;

  if (studentsCount) {
    filteredLessons = filterByStudentCount(lessons, studentsCount);
  }

  const formattedLessons = filteredLessons.map((lesson: any) => ({
    id: lesson.id,
    date: lesson.date,
    title: lesson.title,
    status: lesson.status,
    visitCount: lesson.students.filter(
      (s: any) => s.lesson_students?.visit === true
    ).length,
    students: lesson.students.map((s: any) => ({
      id: s.id,
      name: s.name,
      visit: s.lesson_students?.visit ?? false,
    })),
    teachers: lesson.teachers.map((t: any) => ({
      id: t.id,
      name: t.name,
    })),
  }));

  return {
    lessons: formattedLessons,
    totalLessons: formattedLessons.length,
    totalPages: Math.ceil(formattedLessons.length / lessonsPerPage),
  };
};