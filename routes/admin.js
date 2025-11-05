const express = require("express");
const adminController = require("../controllers/adminController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(auth);

router.get("/dashboard", adminController.getUsersStatistics);
router.delete("/reports/:id", adminController.deleteReport);
router.delete("/users/:id", adminController.deleteUser);


module.exports = router;
