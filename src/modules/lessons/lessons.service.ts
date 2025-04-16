import { Op } from 'sequelize';
import Lesson from '../../db/models/lesson.model';
import Teacher from '../../db/models/teacher.model';
import Student from '../../db/models/student.model';
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
  const whereConditions: any = {};

  // 📅 Обработка даты (через handleDate)
  if (date) {
    Object.assign(whereConditions, handleDate(date));
  }

  // ✅ Статус (0 или 1) — можно смело использовать
  if (status !== undefined) {
    whereConditions.status = status;
  }

  // 👨‍🏫 Фильтр по учителям (если есть)
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

  // 🧮 Фильтрация по количеству учеников
  let filteredLessons = lessons;

  if (studentsCount) {
    const countCondition = handleStudentsCount(studentsCount);

    filteredLessons = lessons.filter((lesson: any) => {
      const studentCount = (lesson.students || []).length;

      if (countCondition.type === 'exact') {
        return studentCount === countCondition.value;
      }

      if (countCondition.type === 'range') {
        return studentCount >= countCondition.min && studentCount <= countCondition.max;
      }

      return true;
    });
  }

  // 🎨 Приводим к нужному формату
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