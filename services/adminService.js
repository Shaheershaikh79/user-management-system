const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ReportService {
  // Get all reports with optional filters
  async getAllReports({ name, startDate, endDate }) {
    // Filter users if name is provided
    const userFilter = name ? { name: { contains: name, mode: "insensitive" } } : {};

    const users = await prisma.user.findMany({
      where: userFilter,
      select: {
        id: true,
        name: true,
        role: true,
        _count: { select: { reports: true } },
      },
      orderBy: { id: "desc" },
    });

    // Filter reports by user name and date range
    const reportFilter= {};

    if (name) {
      reportFilter.user = { name: { contains: name, mode: "insensitive" } };
    }
    if (startDate || endDate) {
      reportFilter.date = {};
      if (startDate) reportFilter.date.gte = new Date(startDate);
      if (endDate) reportFilter.date.lte = new Date(endDate);
    }

    const allReports = await prisma.report.findMany({
      where: reportFilter,
      include: { user: { select: { id: true, name: true, role: true } } },
      orderBy: { id: "desc" },
    });

    return { users, allReports };
  }

  // Delete report by ID
  async deleteReportById(reportId) {
    const report = await prisma.report.findUnique({
      where: { id: Number(reportId) },
    });
    if (!report) return null;

    await prisma.report.delete({ where: { id: Number(reportId) } });
    return true;
  }
  async deleteUserById(userId) {
  // Convert userId to number since schema expects Int
  const id = (userId);
  console.log("inservice",id)
  if (!id) throw new Error("User ID is required");

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) return null;

  // Delete the user
  await prisma.user.delete({
    where: { id },
  });

  return true;
}

}

module.exports = new ReportService();
