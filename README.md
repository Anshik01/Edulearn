# EduLearn - Quiz Management System

A full-stack web application for quiz management with role-based access control for Faculty and Students.

## Features

### Authentication & Authorization
- JWT-based authentication with HS256 algorithm
- Role-based access control (Faculty/Student)
- Secure password encryption with BCrypt

### Faculty Features
- Create and manage quizzes with multiple-choice questions
- View all created quizzes
- Delete owned quizzes
- View student list with search functionality
- Add remarks for students
- View given remarks
- Profile management

### Student Features
- View available quizzes
- Take quizzes (one attempt per quiz)
- View leaderboard based on XP points
- View received remarks from faculty
- Profile management
- XP system based on quiz performance

## Technology Stack

### Backend
- Spring Boot 3.5.6
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Lombok
- Bean Validation
- Maven

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast

## Setup Instructions

### Prerequisites
- Java 21
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

### Database Setup
1. Install MySQL and create a database:
```sql
CREATE DATABASE edulearn_db;
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Backend Setup
1. Navigate to the project root directory
2. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Default Test Users

The application creates default users for testing:

### Faculty User
- Username: `faculty`
- Password: `password`
- Email: `faculty@edulearn.com`

### Student User
- Username: `student`
- Password: `password`
- Email: `student@edulearn.com`

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Student Endpoints
- `GET /api/student/quizzes` - Get all quizzes
- `GET /api/student/quizzes/{id}` - Get quiz by ID
- `POST /api/student/quiz-attempts` - Submit quiz attempt
- `GET /api/student/leaderboard` - Get leaderboard
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `GET /api/student/remarks` - Get student remarks

### Faculty Endpoints
- `POST /api/faculty/quizzes` - Create quiz
- `GET /api/faculty/quizzes` - Get faculty quizzes
- `DELETE /api/faculty/quizzes/{id}` - Delete quiz
- `GET /api/faculty/students` - Get students list
- `POST /api/faculty/remarks` - Add remark
- `GET /api/faculty/remarks` - Get faculty remarks
- `GET /api/faculty/profile` - Get faculty profile
- `PUT /api/faculty/profile` - Update faculty profile

## Security Features

- JWT tokens with configurable expiration
- Password encryption using BCrypt
- Role-based endpoint protection
- CORS configuration for frontend integration
- Input validation on all endpoints
- SQL injection prevention through JPA

## Database Schema

The application uses the following main entities:
- **Users** - Store user information with roles
- **Quizzes** - Quiz metadata and questions
- **Questions** - Individual quiz questions
- **Options** - Multiple choice options for questions
- **QuizAttempts** - Student quiz submissions
- **Answers** - Individual question responses
- **Remarks** - Faculty feedback to students

## Development Notes

- The application uses Hibernate for ORM with automatic schema generation
- JWT secret key should be changed in production
- Database credentials should be externalized in production
- CORS is configured for development (localhost:5173)
- All endpoints include proper validation and error handling# Edulearn
