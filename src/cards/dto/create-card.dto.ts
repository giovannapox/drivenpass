import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsBoolean } from "class-validator"

export class CreateCardDto {
    @ApiProperty({
        example: 1234,
        description: "card number"
    })
    @IsNotEmpty()
    @IsNumber()
    number : number ;

    @ApiProperty({
        example: "Giovanna Patriarcha",
        description: "card owner name"
    })
    @IsNotEmpty()
    @IsString()
    name : string;

    @ApiProperty({
        example: 123,
        description: "card cvv"
    })
    @IsNotEmpty()
    @IsNumber()
    cvv :  number;
    
    @ApiProperty({
        example: "10/23",
        description: "expiration card date"
    })
    @IsNotEmpty()
    @IsString()
    date : string;
    
    @ApiProperty({
        example: "Giovanna7*",
        description: "card password"
    })
    @IsNotEmpty()
    @IsString()
    password : string;

    @ApiProperty({
        example: true,
        description: "true or false virtual card"
    })
    @IsNotEmpty()
    @IsBoolean()
    virtual: boolean;

    @ApiProperty({
        example: "débito",
        description: "card type"
    })
    @IsNotEmpty()
    @IsString()
    type:string;

    @ApiProperty({
        example: "mastercard débito",
        description: "card title"
    })
    @IsNotEmpty()
    @IsString()
    title: string;
};
