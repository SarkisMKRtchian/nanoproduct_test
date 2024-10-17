import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Teams } from './schemas/teams.schema';
import { Model } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { UserDecorator } from 'src/users/decorators/users.decorator';
import { RolesEnum, Users } from 'src/users/schemas/users.schema';
import { isValidId } from 'src/utils';

@Injectable()
export class TeamsService {

    constructor(
        @InjectModel(Teams.name) private readonly teamsModel: Model<Teams>,
        @InjectModel(Users.name) private readonly usersModel: Model<Users>
    ){}

    public async create(dto: CreateTeamDto, user: UserDecorator){
        const validMember = dto.members?.every(member => isValidId(member));
        const validResponsible = isValidId(dto.responsible)
        if(!validMember || !validResponsible) throw new HttpException(`Invalid members/responsible id`, HttpStatus.BAD_REQUEST);
        
        const team = new this.teamsModel({
            ...dto,
            responsible: dto.responsible || user.id
        });
        const responsible = await this.usersModel.findById(dto.responsible);
        if(!responsible) throw new HttpException(`User: ${dto.responsible} not found`, HttpStatus.NOT_FOUND);

        for(let i = 0; i < dto.members.length; i++){
            const user = await this.usersModel.findById(dto.members[i]);
            if(!user) throw new HttpException(`User: ${dto.members[i]} not found`, HttpStatus.NOT_FOUND);
            await this.usersModel.findByIdAndUpdate(dto.members[i], {
                $addToSet: {teams: team._id}
            })
        }

        return await team.save();

    }

    public async getAll(){
        return await this.teamsModel.find({}, {}, {populate: [
            {path: 'members', model: Users.name},
            {path: 'responsible', model: Users.name}
        ]});
    }

    public async getCurrentUserTeams(user: UserDecorator){
        return await this.teamsModel.find({
            $or: [
                {responsible: user.id},
                {members: user.id}
            ]
        }, {}, {populate: [
            {path: 'members', model: Users.name},
            {path: 'responsible', model: Users.name}
        ]})
    }

    public async getById(id: string, user: UserDecorator){
        if(!isValidId(id)) throw new HttpException(`Invalid team id`, HttpStatus.BAD_REQUEST);

        const team = await this.teamsModel.findById(id, {}, {populate: [
            {path: 'members', model: Users.name},
            {path: 'responsible', model: Users.name}
        ]});
        if(!team) throw new HttpException(`Team: ${id} not found`, HttpStatus.NOT_FOUND);

        const allMembers = [...team?.members.map(v => v._id.toString()), team?.responsible._id.toString()];

        if(!allMembers.some(v => v === user.id) && user.roles.some(role => role !== RolesEnum.ADMIN)) throw new HttpException('Access denied', HttpStatus.FORBIDDEN);

        return team;
    }

    public async addMember(id: string, userId: string){
        if(!isValidId(id)) throw new HttpException(`Invalid team id`, HttpStatus.BAD_REQUEST);
        if(!isValidId(userId)) throw new HttpException(`Invalid user id`, HttpStatus.BAD_REQUEST);
        const team = await this.teamsModel.findById(id);
        const user = await this.usersModel.findById(userId);

        if(!team) throw new HttpException(`Team: ${id} not found`, HttpStatus.NOT_FOUND);
        if(!user) throw new HttpException(`User: ${userId} not found`, HttpStatus.NOT_FOUND);

        user.teams.push(team);
        team.members.push(user);
        
        await user.save();
        return (await team.save()).populate([
            {path: 'members', model: Users.name},
            {path: 'responsible', model: Users.name}
        ]);
    }

    public async removeMember(id: string, userId: string){
        if(!isValidId(id)) throw new HttpException(`Invalid team id`, HttpStatus.BAD_REQUEST);
        if(!isValidId(userId)) throw new HttpException(`Invalid user id`, HttpStatus.BAD_REQUEST);

        const team = await this.teamsModel.findById(id);
        const user = await this.usersModel.findById(userId);

        if(!team) throw new HttpException(`Team: ${id} not found`, HttpStatus.NOT_FOUND);
        if(!user) throw new HttpException(`User: ${userId} not found`, HttpStatus.NOT_FOUND);

        user.teams = user.teams.filter(value => value._id !== team.id);
        team.members = team.members.filter(value => value._id !== user.id);

        await user.save();

        return (await team.save()).populate([
            {path: 'members', model: Users.name},
            {path: 'responsible', model: Users.name}
        ]);
    }

    public async setResponsible(id: string, userId: string){
        if(!isValidId(id)) throw new HttpException(`Invalid team id`, HttpStatus.BAD_REQUEST);
        if(!isValidId(userId)) throw new HttpException(`Invalid user id`, HttpStatus.BAD_REQUEST);

        return await this.teamsModel.findByIdAndUpdate(id, {responsible: userId}, {new: true, populate: [
            {path: 'members', model: Users.name},
            {path: 'responsible', model: Users.name}
        ]});
    }

    public async delete(id: string){
        if(!isValidId(id)) throw new HttpException(`Invalid team id`, HttpStatus.BAD_REQUEST);

        return await this.teamsModel.findByIdAndDelete(id);
    }

    public async rename(id: string, name: string){
        if(!isValidId(id)) throw new HttpException(`Invalid team id`, HttpStatus.BAD_REQUEST);

        return await this.teamsModel.findByIdAndUpdate(id, {name}, {new: true, populate: [
            {path: 'members', model: Users.name},
            {path: 'responsible', model: Users.name}
        ]});
    }

}
