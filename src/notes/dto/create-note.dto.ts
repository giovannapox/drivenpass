import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator"

export class CreateNoteDto {
    @ApiProperty({
        example: "Twitter",
        description: "title for a note"
    })
    @IsString()
    @IsNotEmpty()
    title: string; 

    @ApiProperty({
        example: "This is a text for a note",
        description: "text for a note"
    })
    @IsString()
    @IsNotEmpty()
    text : string;
};
