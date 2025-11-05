const adminService = require("../services/adminService");

class AdminController {
  async getUsersStatistics(req, res) {
    try {
      if (req?.user?.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { name, startDate, endDate } = req.query;

      const users = await adminService.getAllReports({ name, startDate, endDate });

      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteReport(req, res) {
    try {
      if (req?.user?.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const reportId = req.params.id;
      if (!reportId) return res.status(400).json({ error: "Report ID is required" });

      const deleted = await adminService.deleteReportById(reportId);
      if (!deleted) return res.status(404).json({ error: "Report not found" });

      res.json({ message: "Report deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async deleteUser(req, res) {
  try {
    // Only admins can delete users
    if (req?.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const userId = req.params.id;
    console.log(userId,"userId=>")
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Call service to delete user by UUID
    const deleted = await adminService.deleteUserById(userId);
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

}

module.exports = new AdminController();
