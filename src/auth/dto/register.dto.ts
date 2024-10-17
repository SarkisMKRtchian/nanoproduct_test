import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { RolesEnum } from "src/users/schemas/users.schema";


export class RegisterDto{
    @ApiProperty({name: 'name', type: String, example: 'John Doe', description: 'user name', required: true})
    @IsNotEmpty()
    readonly name: string;
    @ApiProperty({name: 'email', type: String, example: 'john@example.com', description: 'user email', required: true})
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    @ApiProperty({name: 'password', type: String, example: 'password123', description: 'user password', required: true})
    @IsNotEmpty()
    readonly password: string;
    @ApiProperty({name: 'roles', type: Array, enum: RolesEnum, example: ['admin'], description: 'user roles', required: false})
    @IsOptional()
    @IsEnum(RolesEnum, {each: true})
    readonly roles?: RolesEnum[];
}