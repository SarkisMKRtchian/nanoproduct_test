import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Users } from "src/users/schemas/users.schema";
import { Tasks } from "./tasks.schema";
import { ApiProperty } from "@nestjs/swagger";

interface IProp{
    [key: string]: any;
}

@Schema({_id: true})
export class TaskChangeHistory{
    @ApiProperty({example: '6710ebe755079045b562c5fb', description: 'history id'})
    declare _id: string;

    @ApiProperty({type: () => Users, description: 'user'})
    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Users'})
    declare user: Users;

    @ApiProperty({type: () => Tasks, description: 'task'})
    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Tasks'})
    declare task: Tasks;

    @ApiProperty({example: {status: 'process'}, description: 'old propertys'})
    @Prop({type: [mongoose.Schema.Types.Mixed], required: true})
    declare oldProps: IProp[];

    @ApiProperty({example: {status: 'done'}, description: 'new propertys'})
    @Prop({type: [mongoose.Schema.Types.Mixed], required: true})
    declare props: IProp[];

    @ApiProperty({example: 1673208000, description: 'created date'})
    @Prop({required: true, type: Number})
    declare created: number;
}

export const TaskChangeHistorySchema = SchemaFactory.createForClass(TaskChangeHistory);