import Joi from 'joi';

export const lessonFiltersSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}(,\d{4}-\d{2}-\d{2})?$/)
    .messages({
      'string.pattern.base': 'Дата должна быть в формате YYYY-MM-DD или YYYY-MM-DD,YYYY-MM-DD',
    }),

  status: Joi.number()
    .valid(0, 1)
    .messages({
      'any.only': 'Статус должен быть 0 (не проведено) или 1 (проведено)',
    }),

  teacherIds: Joi.string()
    .pattern(/^\d+(,\d+)*$/)
    .messages({
      'string.pattern.base': 'teacherIds должен быть строкой с ID, разделёнными запятыми (например: 1,2,3)',
    }),

  studentsCount: Joi.string()
    .pattern(/^\d+(,\d+)?$/)
    .messages({
      'string.pattern.base': 'studentsCount должен быть числом или диапазоном через запятую (например: 10 или 5,15)',
    }),

  page: Joi.number().integer().min(1).default(1)
    .messages({
      'number.base': 'Параметр page должен быть числом',
      'number.integer': 'page должен быть целым числом',
      'number.min': 'Минимальное значение page — 1',
    }),

  lessonsPerPage: Joi.number().integer().min(1).default(5)
    .messages({
      'number.base': 'Параметр lessonsPerPage должен быть числом',
      'number.integer': 'lessonsPerPage должен быть целым числом',
      'number.min': 'Минимальное значение lessonsPerPage — 1',
    }),
});