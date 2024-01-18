import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

import { AvailableStrategy } from './strategies/strategies.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AvailableStrategy.Jwt) {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
