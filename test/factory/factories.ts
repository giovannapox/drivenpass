import { PrismaService } from 'src/prisma/prisma.service';
import { faker } from '@faker-js/faker/locale/en';
import * as bcrypt from "bcrypt";

let prisma: PrismaService;

export function initializeFactoryPrisma(prismaService: PrismaService) {
  prisma = prismaService;
}

export function createUser() {
    return prisma.users.create({
    data: {
      email: faker.internet.email(),
      password: bcrypt.hashSync('Giovanna7*', 10),
    },
  });
};

export function createCredential(userId: number){
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.JWT_SECRET);
    return prisma.credentials.create({
        data:{
            Url: faker.internet.url(),
            Username: faker.person.middleName(),
            Password: cryptr.encrypt(faker.internet.password()),
            Title: faker.lorem.sentence(),
            UserId: userId
        }
    });
};

export function createNote(userId: number){
    return prisma.notes.create({
        data:{
            Title: faker.lorem.sentence(),
            Text: faker.lorem.paragraph(),
            UserId: userId
        }
    });
};

export function createCard(userId: number){
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.JWT_SECRET);
    return prisma.cards.create({
        data:{
            Number: Number(faker.number.bigInt({ max: 10n})),
            Name: faker.person.firstName(),
            Cvv: cryptr.encrypt(faker.number.bigInt({ max: 3n})),
            Date: faker.date.anytime().toISOString(),
            Password: cryptr.encrypt(faker.internet.password()),
            Virtual: true,
            Type: "débito",
            Title: faker.lorem.sentence(),
            UserId: userId
        }
    });
};