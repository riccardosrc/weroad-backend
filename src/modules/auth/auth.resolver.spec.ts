import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { createMock } from '@golevelup/ts-jest';
import { LoginInput } from './dto/login.input';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: createMock<AuthService>() },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('login', () => {
    it('should return accessToken', async () => {
      const loginInput: LoginInput = {
        email: 'test@test.com',
        password: 'test',
      };
      service.authenticate = jest
        .fn()
        .mockResolvedValueOnce('signed_jwt_access_token');

      const res = await resolver.login(loginInput);

      expect(res.accessToken).toBeDefined();
    });
  });
});
