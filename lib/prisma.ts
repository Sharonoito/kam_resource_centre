// import { PrismaClient } from "@prisma/client";
// import { PrismaClient } from "@/app/generated/prisma";
// Add quotes around the path
import { Prisma, PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const logLevels: Prisma.LogLevel[] =
    process.env.NODE_ENV === "production"
      ? ["warn", "error"]
      : ["query", "info", "warn", "error"];

  return new PrismaClient({
    log: logLevels,
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

