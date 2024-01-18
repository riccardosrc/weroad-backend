import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { AuthResType } from './types/auth-res.type';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResType)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResType> {
    const accessToken = await this.authService.authenticate(loginInput);
    return { accessToken };
  }
}
