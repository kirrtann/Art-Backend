import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Token } from 'src/token/entities/token.entity';
import response from 'utils/constant/reponse';

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Token)
    private readonly userTokenRepository: Repository<Token>,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return response.unAuthorizedRequest(res);
      }

      const token = authHeader.split(' ')[1];
      const validate = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

      if (!validate || typeof validate === 'string' || !validate.id) {
        return response.unAuthorizedRequest(res);
      }

      const isExist = await this.userTokenRepository.findOne({
        where: {
          user: { id: validate.id },
          token: token,
          deleted_at: IsNull(),
        },
      });

      if (!isExist) {
        return response.unAuthorizedRequest(res);
      }
      req.body.user = validate;
      next();
    } catch (error) {
      return response.unAuthorizedRequest(res);
    }
  }
}
