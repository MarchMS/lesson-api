import { Request, Response, NextFunction } from 'express';
import { getLessonsService } from './lessons.service';
import { lessonFiltersSchema } from './lessonFilters.schema';

export const getLessonsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = lessonFiltersSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      date, status, teacherIds, studentsCount,
      page, lessonsPerPage,
    } = value;

    const lessons = await getLessonsService(
      { date, status, teacherIds, studentsCount },
      page,
      lessonsPerPage
    );

    res.status(200).json(lessons);
  } catch (error) {
    next(error);
  }
};