import express from 'express';
import dotenv from 'dotenv';
import lessonsRouter from './lessons.route';
import sequelize from './config/db';
import './db/models/associations';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', lessonsRouter);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к БД установлено');

    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error);
    process.exit(1);
  }
};

start();