import { ApiProperty } from "@nestjs/swagger";
import { RolesEnum } from "../schemas/users.schema";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UpdateRolesDto{
    @ApiProperty({example: '6710ebe755079045b562c5fb', description: 'user id'})
    @IsNotEmpty()
    readonly id: string;
    @ApiProperty({example: ['admin', 'user'], enum: RolesEnum, isArray: true, description: 'user roles'})
    @IsNotEmpty()
    @IsEnum(RolesEnum, {each: true})
    readonly roles: RolesEnum[];
}