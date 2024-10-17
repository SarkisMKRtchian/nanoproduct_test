import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsOptional } from "class-validator";


class FilterTaskDto{
    @ApiProperty({example: 'title', description: 'Filter by', required: false})
    @IsNotEmpty()
    readonly filterProp: string;
    @ApiProperty({example: 'title', description: 'Filter value', required: false})
    @IsNotEmpty()
    readonly value: string;
}

class SortTasksDto{
    @ApiProperty({example: 'title', description: 'Sort by', required: false})
    @IsNotEmpty()
    readonly sortProp: string;
    @ApiProperty({example: 1, description: 'Sort order', required: false})
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    readonly order: 1 | -1;
}


export class GetTasksDto{
    @ApiProperty({type: FilterTaskDto})
    @IsOptional()
    @Type(() => FilterTaskDto)
    @IsArray()
    readonly filter?: FilterTaskDto[];
    @ApiProperty({type: SortTasksDto})
    @IsOptional()
    readonly sort?: SortTasksDto;
}