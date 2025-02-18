import { UsersService } from './user/user.service';
import { User } from './user/entities/user.entity';
import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() user: Partial<User>): Promise<User> {
    return this.usersService.create(user);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
