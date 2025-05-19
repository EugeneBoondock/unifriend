import { PrismaClient } from '@prisma/client';

declare global {
  // This preserves the PrismaClient type in the global namespace
  // which allows us to use it in our application
  var prisma: PrismaClient | undefined;
}
