import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService){};

    createUser(body: CreateUserDto){
        const { email, password } = body;
        return this.prisma.users.create({
            data: {
                email,
                password: bcrypt.hashSync(password, 10)
            }
        })
    };

    findUser(body: CreateUserDto){
        const { email } = body;
        return this.prisma.users.findFirst({
            where: {
                email
            }
        })
    };

    findUserById(id: number){
        return this.prisma.users.findFirst({
            where: {
                id
            }
        })
    };
};