# Task Management Application

A full-stack Task Management Web Application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

### Task Management
- Create Tasks
- View Tasks
- Update Tasks
- Delete Tasks
- Mark Tasks as Completed/Pending


### Bonus Features
- Search Tasks
- Filter Tasks by Status
- Pagination Support
- Get AI tip for the task
- Track task
- Add Subtask in a task
- Drage and Drop
- And more you check out
---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Context API / Redux (Optional)
- Tailwind CSS / Bootstrap
- Gemini AI 

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs

### Database
- MongoDB
- Mongoose

---

## 📂 Project Structure

```bash
task-management-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/happy0945/task-management-app.git

cd task-management-app
```

---

## Backend Setup

### Navigate to Server Folder

```bash
cd backend
```

### Install Dependencies

```bash
npm install
```

### Create .env File

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key

NODE_ENV=add
```

### Start Backend Server

```bash
npm run dev
```

Server will run on:

```bash
http://localhost:5000
```

---

## Frontend Setup

### Navigate to Client Folder

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```



### Start Frontend

```bash
npm run dev
```

Application will run on:

```bash
http://localhost:5173
```

---

## 🔐 API Endpoints

### Authentication

#### Register

```http
POST /api/auth/register
```

#### Login

```http
POST /api/auth/login
```

---

### Tasks

#### Get All Tasks

```http
GET /api/tasks
```

#### Create Task

```http
POST /api/tasks
```

#### Update Task

```http
PUT /api/tasks/:id
```

#### Delete Task

```http
DELETE /api/tasks/:id
```

#### Toggle Task Status

```http
PATCH /api/tasks/:id/status
```

---

## 📄 Database Schema

### User Schema

```javascript
{
  name: String,
  email: String,
  password: String
}
```

### Task Schema

```javascript
{
  title: String,
  description: String,
  status: String,
  userId: ObjectId
}
```

---

## 📸 Screenshots

### Login Page


<img width="1919" height="866" alt="image" src="https://github.com/user-attachments/assets/a44820b6-25e6-4d06-9c59-aec25284188b" />

### Dashboard

<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/7b98a298-2ade-47b4-bfe6-39a7e8921841" />
<img width="1919" height="864" alt="image" src="https://github.com/user-attachments/assets/1a01c90d-98d9-47ec-a5bc-ff91e93334a7" />



### Task Management

<img width="1919" height="793" alt="image" src="https://github.com/user-attachments/assets/53d6991a-5540-4068-8798-b5b4187b8dcb" />


---

## 🎥 Demo Video

Watch the complete application demo:

👉 (https://www.youtube.com/watch?v=JqGj_OJPI2Y)

## 🧪 Test Credentials

```text
Email: happykumaryadav23@gmail.com
Password: Happchet2823#
```


---

## 👨‍💻 Author

Happy Yadav

GitHub: https://github.com/happy0945

---

## 📜 License

This project is developed for the MERN Stack Internship Assignment.
