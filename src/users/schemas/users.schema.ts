import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Tasks } from "src/tasks/schemas/tasks.schema";
import { ApiProperty } from "@nestjs/swagger";
import { Teams } from "src/teams/schemas/teams.schema";

export enum RolesEnum{
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export type UsersDocuemnt = HydratedDocument<Users>;

@Schema({_id: true})
export class Users{
    @ApiProperty({name: '_id', type: String, example: '6710ebe755079045b562c5fb', description: 'user id'})
    declare _id: string;

    @ApiProperty({name: 'name', type: String, example: 'John Doe', description: 'user name'})
    @Prop({required: true, type: String})
    declare name: string;

    @ApiProperty({name: 'email', type: String, example: 'john@example.com', description: 'user email'})
    @Prop({required: true, unique: true, type: String})
    declare email: string;

    @ApiProperty({name: 'password', type: String, example: 'password123', description: 'user password'})
    @Prop({required: true, type: String})
    declare password: string;

    @ApiProperty({name: 'roles', example: [RolesEnum.USER], enum: RolesEnum, isArray: true, type: [String], description: 'user roles'})
    @Prop({required: true, type: [String], enum: RolesEnum})
    declare roles: string[];
    
    @ApiProperty({name: 'tasks', type: [Tasks], description: 'user tasks'})
    @Prop({required: false, type: [mongoose.Schema.Types.ObjectId], ref: 'Tasks'})
    declare tasks: Tasks[];

    @ApiProperty({name: 'teams', type: [Teams], description: 'user teams'})
    @Prop({required: false, type: [mongoose.Schema.Types.ObjectId], ref: 'Teams'})
    declare teams: Teams[];

    @ApiProperty({name: 'created', type: Number, example: 1686892800, description: 'user created timestamp'})
    @Prop({required: true, type: Number})
    declare created: number;
}

export const UsersSchema = SchemaFactory.createForClass(Users);