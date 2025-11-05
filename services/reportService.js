const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ReportService {
  async createReport(userId, data) {
    if (!userId) throw new Error("User ID is required to create a report");

    const { date, tasks, timings, notes } = data;
    if (!date || !tasks || !timings) {
      throw new Error("Date, tasks, and timings are required");
    }

    try {
      const report = await prisma.report.create({
        data: {
          date: new Date(date),
          tasks,
          timings,
          notes: notes || "",
          userId,
        },
      });
      return report;
    } catch (error) {
      if (error.code === "P2002") {
        throw new Error("A report for this date already exists for this user");
      }
      throw error;
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

  async getReportById(reportId, userId = null) {
    if (!reportId) {
      throw new Error("Report ID is required");
    }

    const where = { id: reportId };

    // Optional restriction: fetch only if this report belongs to the given userId
    if (userId) {
      where.userId = userId;
    }

    const report = await prisma.report.findFirst({
      where,
      include: {
        user: {
          select: { id: true, name: true }, // only include userId + name
        },
      },
    });

    if (!report) {
      throw new Error("Report not found");
    }

    return report;
  }
  async updateReport(reportId, userId = null, updateData) {
    const id = Number(reportId);
    if (isNaN(id)) {
      throw new Error("Invalid report id");
    }

    const where = { id };
    if (userId) {
      where.userId = userId;
    }

    // Check if report exists
    const existingReport = await prisma.report.findFirst({ where });
    if (!existingReport) {
      throw new Error("Report not found");
    }

    const report = await prisma.report.update({
      where: { id },
      data: updateData,
    });

    return report;
  }

  async deleteReport(reportId, userId = null) {
    const where = { id: reportId };

    if (userId) {
      where.userId = userId;
    }

    const existingReport = await prisma.report.findFirst({ where });

    if (!existingReport) {
      throw new Error("Report not found");
    }

    await prisma.report.delete({
      where: { id: reportId },
    });

    return { message: "Report deleted successfully" };
  }

  async getAllReportsAdmin() {
    // Fetch all users with their report count
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        _count: { select: { reports: true } }, // number of reports per user
      },
      orderBy: { id: "desc" }, // order by valid field
    });

    // Fetch all reports including user info
    const allReports = await prisma.report.findMany({
      include: {
        user: { select: { id: true, name: true, role: true } },
      },
      orderBy: { id: "desc" }, // order by valid field in Report model
    });

    return { users, allReports };
  }

  // Get all users (Admin only)

}

module.exports = new ReportService();
