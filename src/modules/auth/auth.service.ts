import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Authenticate the user with a new jwt token
   * if the provided credentials are correct
   * @param email user email
   * @param password user password
   * @returns signed jwt token
   */
  async authenticate({ email, password }: LoginInput) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      throw new UnauthorizedException();
    }
    const authJwt = await this.signJwtToken(user);
    return authJwt;
  }

  /**
   * Sign new jwt token for the user
   * @param user authenticated user
   * @returns signed jwt token
   */
  private async signJwtToken(user: User) {
    return this.jwtService.signAsync({ sub: user.id });
  }
}
