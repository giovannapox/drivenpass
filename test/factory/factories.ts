import { PrismaService } from 'src/prisma/prisma.service';

let prisma: PrismaService;

export function initializeFactoryPrisma(prismaService: PrismaService) {
  prisma = prismaService;
}

export function createUser() {
    return prisma.users.create({
        data: {
            email: "giovanna@gi.com",
            password: "Giovanna7*"
        }
    })
};