import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { constants } from 'http2';
import bcryptjs from 'bcryptjs'
import { User } from 'src/users/users.model';

@Injectable()
export class AuthService {
    constructor(private userSevice:UsersService, private jwtService:JwtService){}

    async login(userDto:CreateUserDto){
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }


    async registration(userDto:CreateUserDto){
        const candidate = await this.userSevice.getUserByEmail(userDto.email);
        if (candidate){
            throw new HttpException('Пользовательс таким email существует', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcryptjs.hash(userDto.password, 5);
        const user = await this.userSevice.createUser({...userDto,password:hashPassword})
        return this.generateToken(user)
        
    }

    private async generateToken(user:User){
        const payload = {email: user.email, id: user.id, roles: user.roles}
        return {
            token: this.jwtService.sign(payload)
        }
    }
    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userSevice.getUserByEmail(userDto.email);
        const passwordEquals = await bcryptjs.compare(userDto.password, user.password);
        if (user&&passwordEquals){
            return user;
        }
        throw new UnauthorizedException({message:'Некоректный email или пароль'})
    }
    
}
