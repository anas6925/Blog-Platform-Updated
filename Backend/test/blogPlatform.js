import dotenv from "dotenv";
dotenv.config();

import * as chai from "chai";
import request from "supertest";
import app from "../index.js";
import UserSignupModel from "../models/userCredentials.js";
import BlogPostModel from "../models/postBlogModel.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"; //

const { expect } = chai;

describe("User Signup", () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    await UserSignupModel.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should successfully create a new user", async () => {
    const user = {
      username: `${Date.now()}`,
      email: `test@example.com`,
      password: "password123",
    };

    const res = await request(app).post("/blogPost/signupUser").send(user);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message", "User created successfully");
    expect(res.body.data).to.have.property("token");

    const createdUser = await UserSignupModel.findOne({ email: user.email });
    expect(createdUser).to.not.be.null;
    expect(createdUser.username).to.equal(user.username);
    expect(await bcrypt.compare(user.password, createdUser.password)).to.be
      .true;
  });
});

describe("User Login", () => {
  let userEmail;

  before(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    await UserSignupModel.deleteMany({});

    // Create a user for testing login
    userEmail = `test@example.com`;
    const user = new UserSignupModel({
      username: `testuser_${Date.now()}`,
      email: userEmail,
      password: await bcrypt.hash("password123", 10),
    });
    await user.save();
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should successfully log in with valid credentials", async () => {
    const res = await request(app)
      .post("/blogPost/loginUser")
      .send({ email: userEmail, password: "password123" });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Login successfully");
    expect(res.body.data).to.have.property("token");
  });

  it("should return an error for invalid email", async () => {
    const res = await request(app)
      .post("/blogPost/loginUser")
      .send({ email: "invalid@example.com", password: "password123" });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Invalid email");
  });

  it("should return an error for incorrect password", async () => {
    const res = await request(app)
      .post("/blogPost/loginUser")
      .send({ email: userEmail, password: "wrongpassword" });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Invalid password");
  });

  it("should return an error for missing credentials", async () => {
    const res = await request(app).post("/blogPost/loginUser").send({});

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Validation failed");
  });
});

describe("Create Blog", () => {
  let token;
  let userEmail;

  before(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // if want to delete all data we can uncomment this
    // await UserSignupModel.deleteMany({});
    // await BlogPostModel.deleteMany({});

    // Create a user and get a token for authentication
    userEmail = `test@example1.com_${Date.now()}`;
    const user = new UserSignupModel({
      username: `testuser_${Date.now()}`,
      email: userEmail,
      password: await bcrypt.hash("password123", 10),
    });
    await user.save();

    // Generate a token for the created user
    token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  it("should successfully create a new blog post", async () => {
    const blogPost = {
      title: "My First Blog",
      content: "This is the content of my first blog anas.",
    };

    const res = await request(app)
      .post("/blogPost/createBlog")
      .set("Authorization", `Bearer ${token}`)
      .send(blogPost);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message", "Blog Created Successfully");
  });

  it("should return an error for invalid blog data", async () => {
    const res = await request(app)
      .post("/blogPost/createBlog")
      .set("Authorization", `Bearer ${token}`)
      .send({}); // Missing title and content

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message").that.includes("required");
  });

  it("should return an error if user is not authenticated", async () => {
    const blogPost = {
      title: "My Second Blog",
      content: "This is the content of my second blog.",
    };

    const res = await request(app).post("/blogPost/createBlog").send(blogPost); // No token provided

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("message", "Unauthorized");
  });
});
