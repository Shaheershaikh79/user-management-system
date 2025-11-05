const reportService = require("../services/reportService");

class ReportController {
  async createReport(req, res) {
    try {
      const { date, tasks, timings, notes } = req.body;
      const userId = req.userId;

      if (!date || !tasks || !timings) {
        return res.status(400).json({
          error: "Date, tasks, and timings are required",
        });
      }

      const report = await reportService.createReport(userId, {
        date,
        tasks,
        timings,
        notes,
      });

      res.status(201).json({
        message: "Report created successfully",
        report,
      });
    } catch (error) {
      if (error.message === "Report already exists for this date") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getUserReports(req, res) {
    try {
      const userId = req.userId;
      const role = req.user?.role;

      const isAdmin = role === "admin";

      let result;
      if (isAdmin) {
        const filters = {
          userId: req.query.userId,
          dateFrom: req.query.dateFrom,
          dateTo: req.query.dateTo,
        };

        result = await reportService.getAllReportsAdmin(1, 100, filters);
      } else {
        result = await reportService.getReportsByUserId(userId, 1, 100);
      }

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  async getReport(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      const isAdmin = req.user?.role === "admin";

      let report;

      if (isAdmin) {
        // ✅ ADMIN: Can access any report
        report = await reportService.getReportById(id); // No user restriction
      } else {
        // ✅ USER: Can only access their own reports
        report = await reportService.getReportById(id, userId);
      }

      res.json({ report });
    } catch (error) {
      if (error.message === "Report not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async updateReport(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      const isAdmin = req.user?.role === "admin";
      const updateData = req.body;

      let report;

      if (isAdmin) {
        // ✅ ADMIN: Can update any report
        report = await reportService.updateReport(id, updateData); // No user restriction
      } else {
        // ✅ USER: Can only update their own reports
        report = await reportService.updateReport(id, userId, updateData);
      }

      res.json({
        message: "Report updated successfully",
        report,
      });
    } catch (error) {
      if (error.message === "Report not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }
  async getReportsByUserId(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const reports = await prisma.report.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: {
        user: {
          select: { id: true, name: true }, // email removed since you asked for id
        },
      },
    });

    return reports;
  }

  // Delete report (Admin can delete any report)
  async deleteReport(req, res) {
    try {
      const id = parseInt(req.params.id, 10); // Convert to number
      if (isNaN(id))
        return res.status(400).json({ error: "Invalid report ID" });

      const userId = req.user?.id; // comes from auth middleware
      const isAdmin = req.user?.role === "admin";

      let result;

      if (isAdmin) {
        // ✅ ADMIN: Can delete any report
        result = await reportService.deleteReport(id); // no user restriction
      } else {
        // ✅ USER: Can only delete their own reports
        result = await reportService.deleteReport(id, userId);
      }

      res.json({ message: "Report deleted successfully", data: result });
    } catch (error) {
      if (error.message === "Report not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  // Get all users (Admin only)
  async getAllUsers(req, res) {
    try {
      const isAdmin = req.user?.role === "admin";

      if (!isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const users = await reportService.getAllUsers();
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ReportController();
