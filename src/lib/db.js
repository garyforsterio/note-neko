
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var prisma_1 = require("#generated/prisma");
var createPrismaClient = () => new prisma_1.PrismaClient({
        accelerateUrl: process.env.DATABASE_URL,
        log: process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
    });
var globalForPrisma = global;
exports.db = globalForPrisma.prisma || createPrismaClient();
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.db;
