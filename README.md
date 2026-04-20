# Task Management Backend API 🚀

This is a backend application for a Task Management System built using **Node.js**, **Express.js**, and **MongoDB**. It supports full CRUD operations for tasks and includes an **AI-powered feature** to automatically generate task descriptions and priorities using the **Gemini API**.

---

## 📌 Features

- Create, Read, Update, Delete (CRUD) tasks
- AI-powered task enhancement (description + priority)
- RESTful API structure
- Unit Testing & Integration Testing
- Modular architecture (MVC pattern)

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Gemini API (for AI features)
- Jest & Supertest (for testing)

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the server

```bash
npm start
```

---

## 📡 API Endpoints

Task Routes

| Method | Endpoint       | Description     |
| ------ | -------------- | --------------- |
| POST   | /api/tasks     | Create a task   |
| GET    | /api/tasks     | Get all tasks   |
| GET    | /api/tasks/:id | Get single task |
| PUT    | /api/tasks/:id | Update task     |
| DELETE | /api/tasks/:id | Delete task     |

AI Routes

| Method | Endpoint         | Description                     |
| ------ | ---------------- | ------------------------------- |
| POST   | /api/ai/generate | Generate description & priority |

---

## 🤖 AI Feature

When creating a task, the system can automatically:

Generate a meaningful description
Assign a priority level (Low / Medium / High)

This is powered by the Gemini API.

---

## 🧪 Testing

The project includes both Unit Testing and Integration Testing.

Run tests

```bash
npm test
```

---

## 👨‍💻 Author

Dinushika Nishadini
