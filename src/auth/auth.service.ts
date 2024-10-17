import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RolesEnum, Users } from 'src/users/schemas/users.schema';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {


    constructor(
        @InjectModel(Users.name) private readonly usersModel: Model<Users>,
        private readonly jwtService: JwtService
    ) { }


    public async register(dto: RegisterDto){
        const candidate = await this.usersModel.findOne({email: dto.email});
        if(candidate) throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const roles = dto.roles || [RolesEnum.USER]
        const user = await this.usersModel.create({...dto, roles, password: passwordHash, created: Date.now()});

        return {
            access_token: this.genJwtToken(user),
            user
        }
    }

    public async login(dto: LoginDto){
        const user = await this.usersModel.findOne({email: dto.email});
        if(!user) throw new HttpException('incorrect email or password', HttpStatus.BAD_REQUEST);
        const isPasswordCorrect = await bcrypt.compare(dto.password, user.password);
        if(!isPasswordCorrect) throw new HttpException('incorrect email or password', HttpStatus.BAD_REQUEST);
        
        return {
            access_token: this.genJwtToken(user),
            user
        }
    }


    private genJwtToken(user: Users){
        return this.jwtService.sign({
            id: user._id,
            email: user.email,
            roles: user.roles,
        })
    }
}
