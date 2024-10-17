import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/users.schema';
import { Model } from 'mongoose';
import { Tasks } from 'src/tasks/schemas/tasks.schema';
import { Teams } from 'src/teams/schemas/teams.schema';
import { isValidId } from 'src/utils';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserDecorator } from './decorators/users.decorator';
import { UpdateRolesDto } from './dto/update-roles.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(Users.name) private readonly usersModel: Model<Users>
    ){}

    
    public async getAll(): Promise<Users[]>{
        return await this.usersModel.find({}, {}, {populate: [
            {model: Tasks.name, path: 'tasks'},
            {model: Teams.name, path: 'teams'}
        ]});
    }

    public async getById(id: string): Promise<Users>{
        if(!isValidId(id)) throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);

        return await this.usersModel.findById(id, {}, {populate: [
            {model: Tasks.name, path: 'tasks'},
            {model: Teams.name, path: 'teams'}
        ]});
    }

    public async update(dto: UpdateUserDto, {id}: UserDecorator){
        if(!isValidId(id)) throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
        const user = await this.usersModel.findById(id);
        if(!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        user.name = dto?.name || user.name;
        user.email = dto?.email || user.email;
        
        if(dto.password){
            if(!dto.oldPassword) throw new HttpException('Old password is required', HttpStatus.BAD_REQUEST);
            const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
            if(!isMatch) throw new HttpException('Old password is incorrect', HttpStatus.BAD_REQUEST);
            user.password = await bcrypt.hash(dto.password, 10);
        }
        
        return await user.save();
    }

    public async updateRoles(dto: UpdateRolesDto){
        if(!isValidId(dto.id)) throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
        const user = await this.usersModel.findById(dto.id);
        if(!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        user.roles = dto.roles;

        return await user.save();
    }

    public async removeUser(id: string){
        if(!isValidId(id)) throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
        return await this.usersModel.findByIdAndDelete(id)
    }
}
