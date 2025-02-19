# TSI E-Learning Platform

TSI E-LearningAdvance is a comprehensive online learning platform designed to facilitate course creation, enrollment, and management for instructors and students.

This platform provides a robust backend infrastructure for managing courses, user authentication, and enrollment processes. It offers features such as course creation with multimedia support, user role management (student and instructor), enrollment tracking, and email notifications for various user actions.

Key features include:

- User authentication and authorization with role-based access control
- Course management (creation, updating, deletion) for instructors
- File upload support for course materials (images and videos)
- Student enrollment system with email notifications
- Course analytics for instructors
- Password reset functionality with email support

## Repository Structure

The repository is organized as follows:

- `app.js`: Main entry point of the application
- `config/`: Configuration files for external services
  - `cloudinary.js`: Cloudinary configuration for file uploads
  - `multer.js`: Multer configuration for handling file uploads
- `controllers/`: Business logic for different features
  - `AuthController.js`: Handles user authentication and password management
  - `BookController.js`: Manages book-related operations
  - `CourseController.js`: Handles course management and analytics
  - `enrollmentController.js`: Manages student course enrollments
- `database/`: Database connection and configuration
  - `booksDb.js`: MongoDB connection setup
- `Emails/`: Email-related functionality
  - `emailTemplates.js`: Email templates for various notifications
  - `sendEmail.js`: Email sending utility
- `middleware/`: Custom middleware functions
  - `authmiddleware.js`: Authentication middleware
  - `rolemiddleware.js`: Role-based authorization middleware
  - `validationmiddleware.js`: Request validation middleware
- `models/`: Mongoose models for database schemas
- `routes/`: Express route definitions
- `package.json`: Project dependencies and scripts

## Usage Instructions

### Prerequisites

- Node.js (v14 or later)
- MongoDB (v4.4 or later)
- Cloudinary account for file storage
- Nodemailer for sending emails when a new user signup, request for password reset and enrole to a course

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/jibrinmasud/TSIE-LearningAdvance
   cd TSI-E-Learning
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   MONGO_URL=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   PASSWORD_RESETLINK=<your-password-reset-frontend-url>
   ```

4. Start the server:
   ```
   npm start
   ```

### API Endpoints

#### Authentication

- `POST https://tsie-learningadvance.onrender.com/auth/signup`: Register a new user
- `POST https://tsie-learningadvance.onrender.com/auth/login`: Authenticate a user and receive a JWT
- `POST https://tsie-learningadvance.onrender.com/auth/forgot-password`: Initiate password reset process
- `GET https://tsie-learningadvance.onrender.com/auth/reset-password/:token`: Reset password with token

#### Courses

- `GET https://tsie-learningadvance.onrender.com/course`: List all courses
- `POST https://tsie-learningadvance.onrender.com/course`: Create a new course (instructor only)
- `GET https://tsie-learningadvance.onrender.com/course/:category`: List courses by category
- `PATCH https://tsie-learningadvance.onrender.com/course/:id`: Update a course (instructor only)
- `DELETE https://tsie-learningadvance.onrender.com/course/:id`: Delete a course (instructor only)
- `GET https://tsie-learningadvance.onrender.com/course/analytics`: Get course analytics (instructor only)

#### Enrollments

- `GET https://tsie-learningadvance.onrender.com/enrollment`: List user's enrollments (student only)
- `POST https://tsie-learningadvance.onrender.com/enrollment`: Enroll in a course (student only)
- `GET https://tsie-learningadvance.onrender.com/enrollment/:id`: Get specific enrollment details (student only)
- `PATCH https://tsie-learningadvance.onrender.com/enrollment/:id`: Update enrollment status (student only)
- `DELETE https://tsie-learningadvance.onrender.com/enrollment/:id`: Cancel enrollment (student only)

### Testing & Quality

To run tests (if implemented):

```
npm test
```

### Troubleshooting

1. Connection Issues:

   - Ensure MongoDB is running and the connection string in `.env` is correct.
   - Check if Cloudinary credentials are set correctly in `.env`.

2. File Upload Errors:

   - Verify that the file size is within the 1GB limit.
   - Ensure the file type is JPEG, PNG, or MP4.

3. Authentication Errors:
   - Check if the JWT_SECRET in `.env` matches the one used to sign tokens.
   - Ensure the token is included in the Authorization header as "Bearer <token>".

For more detailed logs, set `DEBUG=app:*` before starting the server:

```
DEBUG=app:* npm start
```

## Data Flow

The TSI E-Learning platform follows a typical client-server architecture. Here's an overview of the data flow for a course creation request:

1. Client sends a POST request to `/courses` with course data and files.
2. Request passes through authentication and role middleware.
3. `CourseController.create` handles the request:
   - Validates course data
   - Uploads files to Cloudinary
   - Creates a new course in the database
4. Response with course details is sent back to the client.

```
Client -> Auth Middleware -> Role Middleware -> CourseController -> Cloudinary -> MongoDB -> Client
```

Note: Ensure proper error handling and validation at each step of the process.

## Deployment

### Prerequisites

- Node.js hosting environment (e.g., Heroku, DigitalOcean)
- MongoDB database (e.g., MongoDB Atlas)
- Cloudinary account

### Deployment Steps

1. Set up your hosting environment and database.
2. Configure environment variables on your hosting platform.
3. Push your code to the hosting platform's repository.
4. Run database migrations if necessary.
5. Start the Node.js application using the provided start script.

### Environment Configurations

Ensure the following environment variables are set in your production environment:

- `NODE_ENV=production`
- `MONGO_URL`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `PASSWORD_RESETLINK`

### Monitoring Setup

- Set up logging with a service like Loggly or Papertrail.
- Configure performance monitoring with New Relic or Datadog.
- Set up error tracking with Sentry or Rollbar.
