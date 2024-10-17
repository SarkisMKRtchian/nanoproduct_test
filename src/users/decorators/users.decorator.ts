import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface UserDecorator{
    id: string;
    email: string;
    roles: string[];
    iat: number;
    exp: number;
}

export const User = createParamDecorator((service: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    return request.user;
})