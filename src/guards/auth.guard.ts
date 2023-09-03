import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly userService : UsersService){}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { authorization } = request.headers;

        try{
            const data = this.userService.checkToken((authorization ?? "").split(" ")[1]);
            const user = await this.userService.findUserById(parseInt(data.sub));
            request.user = user;
            return true;
        } catch (err){
            throw new UnauthorizedException();
        };
    };
};