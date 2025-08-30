import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

// JWT Secret - In production, this should be a complex environment variable
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Hash password using bcrypt with salt rounds 12 (high security)
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify password against hashed password
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Generate JWT token for authenticated user
 */
export function generateToken(user: {
  id: number;
  username: string;
  email: string;
}): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as string }
  );
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Authentication middleware - protect routes requiring login
 */
export async function authenticateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Get token from Authorization header or cookies
    let token = req.headers.authorization?.replace("Bearer ", "");

    if (!token && req.cookies.authToken) {
      token = req.cookies.authToken;
    }

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
        code: "NO_TOKEN",
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token.",
        code: "INVALID_TOKEN",
      });
    }

    // Get current user from database
    if (!db) {
      return res
        .status(500)
        .json({ message: "Database connection not available" });
    }

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, decoded.id));

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
        code: "USER_NOT_FOUND",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        message: "Account is deactivated.",
        code: "ACCOUNT_INACTIVE",
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      message: "Authentication failed.",
      code: "AUTH_ERROR",
    });
  }
}

/**
 * Optional authentication middleware - adds user if token exists but doesn't require it
 */
export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    let token = req.headers.authorization?.replace("Bearer ", "");

    if (!token && req.cookies.authToken) {
      token = req.cookies.authToken;
    }

    if (!token) {
      return next(); // No token, continue without user
    }

    const decoded = verifyToken(token);
    if (!decoded || !db) {
      return next(); // Invalid token or no DB, continue without user
    }

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, decoded.id));

    if (user && user.isActive) {
      req.user = user;
    }

    next();
  } catch (error) {
    console.error("Optional auth error:", error);
    next(); // Continue without user on error
  }
}

/**
 * Validate registration data
 */
export function validateRegistrationData(data: RegisterData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Username validation
  if (!data.username || data.username.length < 3) {
    errors.push("Username must be at least 3 characters long");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("Valid email address is required");
  }

  // Password validation
  if (!data.password || data.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Login user with email and password
 */
export async function loginUser(credentials: LoginCredentials) {
  if (!db) {
    throw new Error("Database connection not available");
  }

  // Find user by email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, credentials.email));

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Account is deactivated");
  }

  // Verify password
  const isValidPassword = await verifyPassword(
    credentials.password,
    user.password
  );
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    username: user.username,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };
}

/**
 * Register new user
 */
export async function registerUser(data: RegisterData) {
  if (!db) {
    throw new Error("Database connection not available");
  }

  // Validate input data
  const validation = validateRegistrationData(data);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }

  // Check if user already exists
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Check if username is taken
  const [existingUsername] = await db
    .select()
    .from(users)
    .where(eq(users.username, data.username));

  if (existingUsername) {
    throw new Error("Username is already taken");
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      isActive: true,
    })
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
    });

  // Generate token
  const token = generateToken({
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
  });

  return {
    token,
    user: newUser,
  };
}
