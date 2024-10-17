import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { VeryfyJwtToken } from "./auth.guard";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate{

    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ){}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        try{
            const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ])

            if(!requiredRoles) return true;
            const request = context.switchToHttp().getRequest();

            const token = request.headers.authorization.split(' ')[1];
            if(!token) throw new HttpException('No access', HttpStatus.UNAUTHORIZED);


            const user = this.jwtService.verify<VeryfyJwtToken>(token);

            request.user = user;

            return user.roles.some(value => requiredRoles.includes(value));
        }catch{
            throw new HttpException('No access', HttpStatus.UNAUTHORIZED)
        }
    }
    
}