jest.setTimeout(3600000); // 60 minutes timeout
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.disconnect(); // Ensure any previous connection is closed
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("API Integration Tests", () => {
  // Test Authentication
  describe("Auth Endpoints", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("../auth/signup").send({
        name: "Test User",
        email: "test@test.com",
        password: "password123",
        role: "student",
      });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
    });

    it("should login an existing user", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "test@test.com",
        password: "password123",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });
  });

  // Test Courses
  describe("Course Endpoints", () => {
    let token;
    let courseId;

    beforeAll(async () => {
      // Login to get token
      const loginRes = await request(app).post("/auth/login").send({
        email: "test@test.com",
        password: "password123",
      });
      token = loginRes.body.token;
    });

    it("should create a new course", async () => {
      const res = await request(app)
        .post("/course")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Course",
          description: "Test Description",
          price: 99.99,
          instructor: "Test Instructor",
        });
      expect(res.statusCode).toBe(201);
      courseId = res.body._id;
    });

    it("should get all courses", async () => {
      const res = await request(app).get("/course");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it("should get a specific course", async () => {
      const res = await request(app).get(`/courses/${courseId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(courseId);
    });
  });

  // Test Enrollments
  describe("Enrollment Endpoints", () => {
    let token;
    let courseId;

    beforeAll(async () => {
      // Login to get token
      const loginRes = await request(app).post("/auth/login").send({
        email: "test@test.com",
        password: "password123",
      });
      token = loginRes.body.token;

      // Create a course for enrollment tests
      const courseRes = await request(app)
        .post("/courses")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Enrollment Test Course",
          description: "Test Description",
          price: 99.99,
          instructor: "Test Instructor",
        });
      courseId = courseRes.body._id;
    });

    it("should enroll in a course", async () => {
      const res = await request(app)
        .post("/enrollments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          courseId: courseId,
        });
      expect(res.statusCode).toBe(201);
    });

    it("should get user enrollments", async () => {
      const res = await request(app)
        .get("/enrollments")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });
});
