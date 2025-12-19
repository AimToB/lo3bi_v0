import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // Basic Validation
  if (!fullName || !email || !password) {
    throw new AppError("All fields are required", 400);
  }
  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }

  // Check for existing users
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("Email is already in use", 409);
  }

  //   Encrypt password
  const hashedPassword = await bcrypt.hash(password, 12);
  //   Create user
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
    },
  });

  res.status(200).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
});

import jwt from "jsonwebtoken";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //   Simple Validations
  if (!email || !password) {
    throw new AppError("Email and password are required!", 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("Invalid email or password!", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password!", 401);
  }

  //   create token
  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 401);
  }

  res.status(200).json({
    success: true,
    user,
  });
});
