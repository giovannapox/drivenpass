import { IsString, IsNotEmpty, IsNumber, IsBoolean } from "class-validator"

export class CreateCardDto {
    @IsNotEmpty()
    @IsNumber()
    number : number ;

    @IsNotEmpty()
    @IsString()
    name : string;

    @IsNotEmpty()
    @IsNumber()
    cvv :  number;
    
    @IsNotEmpty()
    @IsString()
    date : string;
    
    @IsNotEmpty()
    @IsString()
    password : string;

    @IsNotEmpty()
    @IsBoolean()
    virtual: boolean;

    @IsNotEmpty()
    @IsString()
    type:string;

    @IsNotEmpty()
    @IsString()
    title: string;
};
