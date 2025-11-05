import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // Hardcode your Supabase PostgreSQL connection string here
    url: "postgresql://postgres:12345678@db.ldgfbkfzmpvsctexifbs.supabase.co:5432/postgres",
  },
});
