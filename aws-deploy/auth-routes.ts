import { Router } from "express";
import {
  loginUser,
  registerUser,
  AuthenticatedRequest,
  LoginCredentials,
  RegisterData,
} from "./auth-middleware";

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post("/register", async (req, res) => {
  try {
    const registrationData: RegisterData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };

    const result = await registerUser(registrationData);

    // Set secure HTTP-only cookie
    res.cookie("authToken", result.token, {
      httpOnly: true,
      secure: false, // AWS ELB handles HTTPS termination, backend is HTTP
      sameSite: "lax", // Lax for better compatibility with AWS load balancer
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "Registration successful",
      user: result.user,
      token: result.token, // Also return token for client-side storage if needed
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      message: error instanceof Error ? error.message : "Registration failed",
    });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post("/login", async (req, res) => {
  try {
    const credentials: LoginCredentials = {
      email: req.body.email,
      password: req.body.password,
    };

    if (!credentials.email || !credentials.password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginUser(credentials);

    // Set secure HTTP-only cookie
    res.cookie("authToken", result.token, {
      httpOnly: true,
      secure: false, // AWS ELB handles HTTPS termination, backend is HTTP
      sameSite: "lax", // Lax for better compatibility with AWS load balancer
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (clear auth cookie)
 */
router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logout successful" });
});

/**
 * GET /api/auth/me
 * Get current authenticated user info
 */
router.get("/me", (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    user: req.user,
  });
});

/**
 * GET /api/auth/check
 * Check if user is authenticated (for frontend auth state)
 */
router.get("/check", (req: AuthenticatedRequest, res) => {
  res.json({
    isAuthenticated: !!req.user,
    user: req.user || null,
  });
});

export { router as authRoutes };
