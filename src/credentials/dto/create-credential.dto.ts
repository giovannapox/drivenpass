import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCredentialDto {
    @ApiProperty({
        example: "twitter.com",
        description: "url of a credential"
    })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    url: string;

    @ApiProperty({
        example: "gioptc",
        description: "username for a user"
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        example: "Giovanan7*",
        description: "user password"
    })
    @IsNotEmpty()
    @IsString()
    password: string;
    
    @ApiProperty({
        example: "twitter",
        description: "a title for your credential"
    })
    @IsNotEmpty()
    @IsString()
    title: string;
}
