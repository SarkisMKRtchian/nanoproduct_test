import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


export interface VeryfyJwtToken{
    _id: string;
    email: string;
    roles: string[];
}

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(
        private readonly jwtService: JwtService
    ){}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        try{
            const token = request.headers.authorization.split(' ')[1];
            if(!token) throw new HttpException('No access', HttpStatus.UNAUTHORIZED);


            const user = this.jwtService.verify<VeryfyJwtToken>(token);

            request.user = user;

            return true;
        }catch{
            throw new HttpException('No access', HttpStatus.UNAUTHORIZED)
        }
    }
    
}