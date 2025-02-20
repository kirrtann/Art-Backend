import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) { }

  async generateToken(user: User): Promise<string> {

    try {
      const payload = { id: user.id, email: user.email };
      const token = this.jwtService.sign(payload);

      const tokenEntry = this.tokenRepository.create({
        user,
        token,
      });

      await this.tokenRepository.save(tokenEntry);
      return token;

    }
    catch (error) {
      throw new InternalServerErrorException('Something went wrong,');
    }
  }
}
