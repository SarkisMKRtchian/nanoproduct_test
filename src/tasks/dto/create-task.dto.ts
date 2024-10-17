import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, ValidateIf } from "class-validator";


export class CreateTaskDto{
    @ApiProperty({example: 'Task title', description: 'Task title', required: true})
    @IsNotEmpty()
    declare title: string;
    @ApiProperty({example: 'Task description', description: 'Task description', required: true})
    @IsNotEmpty()
    declare description: string;
    @ApiProperty({example: ['executor_id'], description: 'Task executors', required: true})
    @ValidateIf((o) => !o.team)
    @IsString({each: true})
    declare executors?: string[];
    @ApiProperty({example: 'team_id', description: 'Task team', required: true})
    @ValidateIf((o) => !o.executors)
    declare team?: string;
    @ApiProperty({example: 1234567890, description: 'Task due date (format: UNIX)', required: true})
    @IsNotEmpty()
    declare dueDate: number;
}