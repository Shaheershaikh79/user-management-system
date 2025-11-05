const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const { reportSchema } = require("../validations/schemas");
const validate = require("../validations/middleware");
const reportController = require("../controllers/reportController");

const router = express.Router();

router.use(auth);

router.post("/", validate(reportSchema), reportController.createReport);
router.get("/profile", auth, async (req, res) => {
  res.json({ user: req.user });
});
router.put("/:id", validate(reportSchema), reportController.updateReport);

router.get("/",auth, reportController.getUserReports);

router.get("/:id", reportController.getReport);
router.delete("/:id", reportController.deleteReport);

module.exports = router;
