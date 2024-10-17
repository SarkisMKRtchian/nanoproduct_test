import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNotEmpty, IsEnum } from "class-validator";
import { TaskStatus } from "../schemas/tasks.schema";


export class UpdateTaskDto{
    @ApiProperty({example: 'task id', description: 'task id', required: false})
    @IsNotEmpty()
    declare id: string;
    @ApiProperty({example: 'Task title', description: 'Task title', required: false})
    @IsOptional()
    declare title?: string;
    @ApiProperty({example: 'Task description', description: 'Task description', required: false})
    @IsOptional()
    declare task?: string;
    @ApiProperty({example: ['executor_id'], description: 'Task executors', required: false})
    @IsOptional()
    @IsString({each: true})
    declare executors?: string[];
    @ApiProperty({example: 'team_id', description: 'Task team', required: false})
    @IsOptional()
    declare team?: string;
    @ApiProperty({example: 1234567890, description: 'Task due date (format: UNIX)', required: false})
    @IsOptional()
    declare dueDate?: number;
    @ApiProperty({example: TaskStatus.DONE, description: 'Task status', required: false})
    @IsOptional()
    @IsEnum(TaskStatus)
    declare status?: TaskStatus;
}