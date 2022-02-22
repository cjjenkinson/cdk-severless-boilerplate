// Global setup for Jest, will run once per test file
import prisma from "../../../trackstack/src/server/db/prisma";
// import { createDataFactory } from "./seed/data-factory";

afterAll(async () => {
  // Disconnect Prisma from the database after all tests are complete
  // to avoid open handles stopping Jest from exiting
  prisma.$disconnect();
});
