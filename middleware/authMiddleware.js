const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded contains { userId, role }
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Attach user info including role to req.user
    req.userId = decoded.userId;
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: decoded.role || user.role,
    };

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Unauthorized" });
  }
};



module.exports = { auth };

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = { auth, adminAuth };
