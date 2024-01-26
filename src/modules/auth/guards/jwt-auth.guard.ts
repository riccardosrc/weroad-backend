import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { OPTIONAL_AUTH_KEY } from 'src/shared/decorators/optional-auth.decorator';
import { AvailableStrategy } from '../strategies/strategies.enum';

@Injectable()
export class JwtAuthGuard
  extends AuthGuard(AvailableStrategy.Jwt)
  implements CanActivate
{
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // check if the resolver allow an optional authentication
    const isAuthOptional = this.reflector.getAllAndOverride<boolean>(
      OPTIONAL_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );
    const ctx = GqlExecutionContext.create(context);
    const authorizationHeader = ctx.getContext().req.headers?.authorization;
    if (!authorizationHeader && isAuthOptional) {
      return true;
    }
    return super.canActivate(context);
  }
}
