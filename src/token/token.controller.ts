
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UsersService } from './../user/user.service';
import { AuthService } from './token.service';
import { Controller, Post, Body, BadRequestException, Res} from '@nestjs/common';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { Response } from 'express';



@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) { }


  @Post('signup')
  async singup(@Body() CreateUserDto: CreateUserDto,) {
    return this.userService.createUser(CreateUserDto)
  }
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto , @Res() res: Response ) {
    if (!loginUserDto || !loginUserDto.email || !loginUserDto.password) {
      throw new BadRequestException('Email and password are required');
    }
    return this.userService.login(loginUserDto,res);
  }

}

