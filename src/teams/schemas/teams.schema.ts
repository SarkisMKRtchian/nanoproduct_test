import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { HydratedDocument } from "mongoose";
import { Users } from "src/users/schemas/users.schema";


export type TeamsDocument = HydratedDocument<Teams>;

@Schema({_id: true})
export class Teams{
    @ApiProperty({type: String, example: '6710ebe755079045b562c5fb', description: 'team id'})
    declare _id: string;

    @ApiProperty({type: String, example: 'Team #1', description: 'team name'})
    @Prop({required: true})
    declare name: string;

    @ApiProperty({type: Users, isArray: true, description: 'team members'})
    @Prop({required: false, type: [mongoose.Schema.Types.ObjectId], ref: 'Users'})
    declare members: Users[];

    @ApiProperty({type: () => Users, description: 'team responsible'})
    @Prop({required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Users'})
    declare responsible: Users;
}


export const TeamsSchema = SchemaFactory.createForClass(Teams);