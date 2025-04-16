# 📚 Lesson API

REST API для управления занятиями, учителями и учениками. Поддерживает фильтрацию, пагинацию и подсчёт посещений.

---

## 🚀 Быстрый старт

### 📦 Требования

- [Node.js](https://nodejs.org/) `>=18`
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 🐳 Запуск с Docker Compose

1. Клонируйте репозиторий:

```bash
git clone https://github.com/MarchMS/lesson-api.git
cd lesson-api
```

2. Убедитесь, что файл `db/test.sql` существует и содержит миграции/данные.

3. Поднимите базу данных:

```bash
docker-compose up -d
```

> Это запустит контейнер `lesson_api_db` с PostgreSQL и применит `test.sql`.

4. Установите зависимости и запустите сервер:

```bash
npm install
npm run dev
```

5. Готово! API доступен по адресу:

```
http://localhost:3000/api/lessons
```

---

## 📂 Структура проекта

```
├── src/
│   ├── config/           # Конфигурация Sequelize
│   ├── db/
│   │   ├── models/       # Модели Sequelize
│   │   └── test.sql      # Начальные миграции и данные
│   ├── modules/
│   │   └── lessons/      # Контроллер, сервис, схема
│   └── index.ts          # Точка входа
├── docker-compose.yml
├── .env
├── package.json
```

---

## ⚙️ Переменные окружения

Создайте файл `.env` и добавьте:

```
DB_HOST=lesson_api_db
DB_PORT=5432
DB_NAME=lessons
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
```

---

## 📬 Примеры запросов

Получить список занятий с фильтрами:

```bash
curl "http://localhost:3000/api/lessons?page=1&status=1&teacherIds=1,2&studentsCount=2,5"
```

---

## ✅ Проверка запуска

Если всё работает правильно, в консоли появятся сообщения:

```
✅ Подключение к БД установлено
🚀 Server is running at http://localhost:3000
```

---

## 🛡️ Безопасность

- Все входные параметры валидируются через Joi.
- Sequelize ORM обеспечивает безопасные SQL-запросы.