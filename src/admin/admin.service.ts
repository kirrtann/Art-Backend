
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';


@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(admin)
    private readonly userRepository: Repository<admin>,
  ) { }
  createUser(createUserDto: CreateAdminDto): Promise<admin> {
    const user: admin = new admin();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.mobile_number = createUserDto.mobile_number;

    return this.userRepository.save(user);
  }
  findAll(): Promise<admin[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<admin> {
    return this.userRepository.findOne({ where: { id } });
  }

  create(user: Partial<admin>): Promise<admin> {
    return this.userRepository.save(user);
  }
 async update(id: string, user: Partial<admin>) {
    return this.userRepository.update(id, user);
  }
  
  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
