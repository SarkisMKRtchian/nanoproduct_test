import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Users } from "src/users/schemas/users.schema";
import { TaskChangeHistory } from "./task-change-history.schema";
import { Teams } from "src/teams/schemas/teams.schema";
import { ApiProperty } from "@nestjs/swagger";


export type TasksDocument = HydratedDocument<Tasks>;

export enum TaskStatus {
    PROCESS = 'process',
    DONE = 'done',
    CANCELED = 'canceled',
    OVERDUE = 'overdue'
}

@Schema({_id: true})
export class Tasks{
    @ApiProperty({example: '6710ebe755079045b562c5fb', description: 'task id'})
    declare _id: string;

    @ApiProperty({example: 'Task title', description: 'task title'})
    @Prop({required: true, type: String})
    declare title: string;

    @ApiProperty({example: 'Task description', description: 'task description'})
    @Prop({required: true, type: String})
    declare description: string;

    @ApiProperty({type: () => Users, description: 'task initiator'})
    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Users'})
    declare initiator: Users;

    @ApiProperty({type: () => Users, isArray: true, description: 'task executors'})
    @Prop({required: false, type: [mongoose.Schema.Types.ObjectId], ref: 'Users'})
    declare executors: Users[];
    
    @ApiProperty({type: Teams, description: 'task team'})
    @Prop({required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Teams'})
    declare team: Teams;

    @ApiProperty({example: 'process', description: 'task status'})
    @Prop({required: true, type: String, enum: TaskStatus, default: TaskStatus.PROCESS})
    declare status: TaskStatus;

    @ApiProperty({example: '6710ebe755079045b562c5fb', description: 'task change history'})
    @Prop({required: false, type: [mongoose.Schema.Types.ObjectId], ref: 'TaskChangeHistory'})
    declare changeHistory: TaskChangeHistory[];

    @ApiProperty({example: '1710ebe755079045b562c5fb', description: 'task due date'})
    @Prop({required: true, type: Number})
    declare dueDate: number;
    
    @ApiProperty({example: '1710ebe755079045b562c5fb', description: 'task created date'})
    @Prop({required: true, type: Number})
    declare created: number;

}

export const TasksSchema = SchemaFactory.createForClass(Tasks);