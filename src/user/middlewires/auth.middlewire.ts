import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';
import { ExpressRequest } from 'src/types/expressReq.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode: any = verify(token, process.env.JWT_TOKEN);
      const user = await this.userService.findById({
        where: {
          id: decode?.id,
        },
      });
      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
