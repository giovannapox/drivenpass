import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateEraseDto {
    @ApiProperty({
        example: "Giovanna7*",
        description: "user password"
    })
    @IsNotEmpty()
    @IsString()
    password:string;
}
