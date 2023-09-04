import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        example: "giovanna@gi.com",
        description: "user email"
    })
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({
        example: "Giovanna7*",
        description: "user password"
    })
    @IsNotEmpty()
    @IsStrongPassword()
    @IsString()
    password: string;
};
