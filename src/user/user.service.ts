import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { admin } from 'src/admin/entities/admin.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.mobile_number = createUserDto.mobile_number;

    return this.userRepository.save(user);
  }
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<admin> {
    return this.userRepository.findOne({ where: { id } });
  }

  create(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
  }
  async update(id: string, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }
  

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
