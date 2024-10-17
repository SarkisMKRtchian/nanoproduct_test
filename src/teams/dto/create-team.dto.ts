import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateTeamDto{
    @ApiProperty({type: String, example: 'Team #1', description: 'team name'})
    @IsNotEmpty()
    declare name: string;

    @ApiProperty({type: String, isArray: true, example: ['6710ebe755079045b562c5fb'], description: 'team members id'})
    @IsOptional()
    @IsString({each: true})
    declare members?: string[];

    @ApiProperty({type: String, example: '6710ebe755079045b562c5fb', description: 'team responsible id'})
    @IsOptional()
    declare responsible?: string;
}