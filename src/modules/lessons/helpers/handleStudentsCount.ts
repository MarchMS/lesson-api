export type StudentCountCondition =
  | { type: 'exact'; value: number }
  | { type: 'range'; min: number; max: number };

export function handleStudentsCount(studentsCount: string): StudentCountCondition {
  const range = studentsCount.split(',').map(Number);

  if (range.length === 1) {
    return { type: 'exact', value: range[0] };
  }

  if (range.length === 2) {
    const [min, max] = range;
    return { type: 'range', min, max };
  }

  throw new Error('Invalid studentsCount format');
}