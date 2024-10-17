import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail } from "class-validator";


export class LoginDto{
    @ApiProperty({name: 'email', type: String, example: 'john@example.com', description: 'user email', required: true})
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    @ApiProperty({name: 'password', type: String, example: 'password123', description: 'user password', required: true})
    @IsNotEmpty()
    readonly password: string;
}