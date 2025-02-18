# Course Creation Guide

## Overview
Instructors can now create courses and upload course content through the API. The system supports uploading both images and video content to Cloudinary.

## Features
- Course creation with basic details (title, description, price, category)
- Image upload support (JPEG, PNG)
- Video upload support (MP4)
- Automatic file storage on Cloudinary
- File size limit: 10MB per file
- Instructor association with courses

## API Endpoint
```
POST /api/courses
```

### Required Headers
- Authorization: Bearer {token}

### Request Body (multipart/form-data)
- title (required): Course title
- description (required): Course description
- price (required): Course price
- category (optional): Course category
- courseImage (optional): Course thumbnail/image
- courseVideo (optional): Course video content

### Response
Success (201 Created):
```json
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    "id": "course_id",
    "title": "course_title",
    "instructor": "instructor_id",
    "courseImage": "cloudinary_image_url",
    "courseVideo": "cloudinary_video_url",
    "price": 99.99,
    "description": "course_description",
    "category": "course_category"
  }
}
```

## File Upload Restrictions
- Supported image formats: JPEG, PNG
- Supported video format: MP4
- Maximum file size: 1GB
- Files are automatically stored on Cloudinary in separate folders for images and videos

## Detailed Upload Instructions Using Postman

1. Open Postman and create a new request
2. Set the request method to POST
3. Enter the URL: `http://your-api-domain/api/courses`
4. Add Headers:
   - Authorization: Bearer your-jwt-token
   - (Do not set Content-Type, it will be set automatically)

5. In the Body tab:
   - Select "form-data"
   - Add the following key-value pairs:
     - title: Your course title
     - description: Your course description
     - price: Course price (number)
     - category: Course category
     - courseImage: Select File and choose your course image (PNG/JPEG)
     - courseVideo: Select File and choose your course video (MP4)

6. Important Notes:
   - Maximum file size is 1GB
   - For large files, the upload may take several minutes
   - Ensure your network connection is stable during upload
   - The server will return a response once the upload is complete and the course is created
   - Files are processed and stored on Cloudinary automatically

7. Example Success Response:
```json
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    "id": "course_id",
    "title": "Your Course Title",
    "instructor": "your_instructor_id",
    "courseImage": "https://res.cloudinary.com/your-cloud/image/upload/courses/images/your-image.jpg",
    "courseVideo": "https://res.cloudinary.com/your-cloud/video/upload/courses/videos/your-video.mp4",
    "price": 99.99,
    "description": "Your course description",
    "category": "Your category"
  }
}
```