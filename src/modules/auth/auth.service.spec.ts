import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login.input';
import { User } from '../users/entities/user.entity';
import { Collection } from '@mikro-orm/core';
import { Role } from '../users/entities/role.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: createMock<UsersService>(),
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authenticate', () => {
    const loginInput: LoginInput = {
      email: 'test@test.com',
      password: 'test',
    };

    it('should return jwt token', async () => {
      const mockedUser: User = {
        id: '123',
        email: 'test@test.com',
        password: 'hashed_password',
        comparePassword: jest.fn().mockResolvedValue(true),
        roles: new Collection(Role),
        hashPassword: jest.fn(),
        isAdmin: true,
      };
      usersService.findByEmail = jest.fn().mockReturnValueOnce(mockedUser);
      jwtService.signAsync = jest
        .fn()
        .mockResolvedValueOnce('jwt_signed_token');

      const res = await service.authenticate(loginInput);

      expect(res).toEqual('jwt_signed_token');
      expect(usersService.findByEmail).toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(mockedUser.comparePassword).toHaveBeenCalled();
    });

    it('should throw unauthorized exception', async () => {
      usersService.findByEmail = jest.fn().mockReturnValueOnce(undefined);
      try {
        await service.authenticate(loginInput);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
