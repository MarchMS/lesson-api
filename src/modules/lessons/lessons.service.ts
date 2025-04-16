import { Op, QueryTypes, Sequelize, WhereOptions } from 'sequelize';
import Lesson from '../../db/models/lesson.model';
import Student from '../../db/models/student.model';
import Teacher from '../../db/models/teacher.model';
import { handleDate } from './helpers/handleDate';
import { handleStudentsCount } from './helpers/handleStudentsCount';

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

  const whereConditions: WhereOptions = {};
  if (date) Object.assign(whereConditions, handleDate(date));
  if (status !== undefined) whereConditions.status = status;

  const offset = (page - 1) * lessonsPerPage;
  const limit = lessonsPerPage;

  // 👨‍🏫 Подготовка фильтра по учителям
  const teacherFilter = teacherIds
    ? { id: { [Op.in]: teacherIds.split(',').map(Number) } }
    : undefined;

  const teachersInclude = {
    model: Teacher,
    as: 'teachers',
    attributes: ['id', 'name'],
    required: !!teacherFilter,
    ...(teacherFilter && { where: teacherFilter }),
  };

  const studentsInclude = {
    model: Student,
    as: 'students',
    attributes: ['id', 'name'],
    through: { attributes: ['visit'] },
    required: false,
  };

  let lessonIds: number[] | null = null;

  if (studentsCount) {
    const havingCondition = handleStudentsCount(studentsCount);

    const result = await Lesson.sequelize?.query(
      `SELECT lesson_id
       FROM lesson_students
       GROUP BY lesson_id
       HAVING ${havingCondition}`,
      { type: QueryTypes.SELECT }
    );

    lessonIds = (result || []).map((row: any) => row.lesson_id);
    if (!lessonIds.length) {
      return { lessons: [], totalLessons: 0, totalPages: 0 };
    }

    whereConditions.id = { [Op.in]: lessonIds };
  }

  const totalLessons = await Lesson.count({
    where: whereConditions,
    include: [teachersInclude],
    distinct: true,
  });

  const lessons = await Lesson.findAll({
    where: whereConditions,
    include: [teachersInclude, studentsInclude],
    offset,
    limit,
    order: [['date', 'ASC']],
  });

  const formattedLessons = lessons.map((lesson: any) => ({
    id: lesson.id,
    date: lesson.date,
    title: lesson.title,
    status: lesson.status,
    visitCount: (lesson.students || []).filter(
      (s: any) => s.lesson_students?.visit === true
    ).length,
    students: (lesson.students || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      visit: s.lesson_students?.visit ?? false,
    })),
    teachers: (lesson.teachers || []).map((t: any) => ({
      id: t.id,
      name: t.name,
    })),
  }));

  return {
    lessons: formattedLessons,
    totalLessons: formattedLessons.length,
    totalPages: Math.ceil(totalLessons / lessonsPerPage),
  };
};
