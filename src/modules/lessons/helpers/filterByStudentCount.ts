import { handleStudentsCount } from './handleStudentsCount';

export function filterByStudentCount(lessons: any[], studentsCount: string): any[] {
  const countCondition = handleStudentsCount(studentsCount);

  return lessons.filter((lesson: any) => {
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