export function handleStudentsCount(studentsCount: string): string {
  const range = studentsCount.split(',').map(Number);

  if (range.length === 1) {
    return `COUNT(student_id) = ${range[0]}`;
  }

  if (range.length === 2) {
    const [min, max] = range;
    return `COUNT(student_id) BETWEEN ${min} AND ${max}`;
  }

  throw new Error('Invalid studentsCount format');
}