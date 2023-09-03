import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

  constructor(private readonly repository: UsersRepository, private readonly jwtService: JwtService){};

  async create(createUserDto: CreateUserDto) {
    const user = await this.repository.findUser(createUserDto);
    if(user) throw new ConflictException();
    return await this.repository.createUser(createUserDto);
  };

  async login(loginDto: LoginDto){
    const { password } = loginDto;
    const user = await this.repository.findUser(loginDto);
    if(!user) throw new UnauthorizedException();

    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) throw new UnauthorizedException();

    return this.createToken(user)
  };

  createToken(user){
    const { id, email } = user;
    const token = this.jwtService.sign({email},
      {
        expiresIn:"7 days",
        subject:String(id),
        issuer:"Driven",
        audience:"User"
      })
    return {token};
  };

  checkToken(token: string){
    const data = this.jwtService.verify(token,{
      audience:"User",
      issuer:"Driven"
    })
    return data;
  };

  findUserById(id: number){
    const user = this.repository.findUserById(id);
    if(!user) throw new NotFoundException()
    return user
  };
};
