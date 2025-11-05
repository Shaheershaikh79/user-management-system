const authService = require("../services/authService");

class AuthController {
  // Register user
  async register(req, res) {
    try {
      const { email, password, name, role } = req.body;

      // Validation
      if (!email || !password || !name || !role) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const result = await authService.registerUser(
        email,
        password,
        name,
        role
      );

      res.status(201).json({
        message: "User registered successfully",
        ...result,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const result = await authService.loginUser(email, password);

      res.json({
        message: "Login successful",
        ...result,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await authService.getUserById(req.userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
