import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MikroORM, RequestContext } from '@mikro-orm/core';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly orm: MikroORM) {}

  use(req: Request, res: Response, next: NextFunction): void {
    RequestContext.create(this.orm.em, () => {
      next();
    });
  }
}
