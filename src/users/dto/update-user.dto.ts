import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";


export class UpdateUserDto{
    @ApiProperty({name: 'name', type: String, example: 'John Doe', description: 'user name'})
    @IsOptional()
    readonly name?: string;
    @ApiProperty({name: 'email', type: String, example: 'john@example.com', description: 'user email'})
    @IsOptional()
    readonly email?: string;
    @ApiProperty({name: 'password', type: String, example: 'password1234', description: 'new password'})
    @IsOptional()
    readonly password?: string;
    @ApiProperty({name: 'oldPassword', type: String, example: 'password123', description: 'old password'})
    @IsOptional()
    readonly oldPassword?: string;
}