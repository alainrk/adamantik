import { PrismaClient } from "@prisma/client";
import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

// Before each test, reset the mock
beforeEach(() => {
  mockReset(prisma);
});

// Deeply mock PrismaClient
const prisma = mockDeep<PrismaClient>();
export default prisma;
