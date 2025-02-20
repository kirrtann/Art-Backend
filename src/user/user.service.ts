import { AuthService } from './../token/token.service';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';;
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private authService: AuthService,
  ) { }
  async createUser(createUserDto: CreateUserDto,): Promise<User> {
    const already = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (already) {
      throw new BadRequestException('Email already exists');
    }
    try {
      const user = new User();
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.mobile_number = createUserDto.mobile_number;
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(createUserDto.password, salt);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email or Mobile Number already exists.');
      }
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto) {

    try {
      const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }
      const token = await this.authService.generateToken(user);
      return { token }
    } catch (error) {
      console.error('Login error:', error);
      throw new InternalServerErrorException(error.message || 'Something went wrong, please try again.')
    }
  }


  async update(id: string, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
