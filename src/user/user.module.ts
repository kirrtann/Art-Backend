import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/token/token.module';


@Module({
  imports: [TypeOrmModule.forFeature([User]),forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService,TypeOrmModule]
})
export class UserModule {}
