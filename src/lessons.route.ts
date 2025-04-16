import express from 'express';
import { getLessonsController } from './modules/lessons/lessons.controller';

const router = express.Router();

router.get('/lessons', getLessonsController);

export default router;