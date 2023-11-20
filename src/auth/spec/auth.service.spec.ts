import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from '../dto/signUp_signIn.dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { client } from '../../config/redis/redis.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user information if username and password match', async () => {
      const mockUser: any = {
        id: 1,
        username: 'testUser',
        password: 'testPassword',
      };
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

      const result = await authService.validateUser('testUser', 'testPassword');

      expect(result).toEqual({ id: 1, username: 'testUser' });
    });

    it('should return null if username and password do not match', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      const result = await authService.validateUser(
        'nonexistentUser',
        'password',
      );

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const mockUser: any = { id: 1, username: 'testUser' };
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockedAccessToken');
      jest.spyOn(client, 'set').mockImplementation();
      jest.spyOn(client, 'expire').mockImplementation();

      const loginDto: LoginDto = {
        username: 'testUser',
        password: 'testPassword',
      };
      const result = await authService.login(loginDto);

      expect(result).toEqual({ access_token: 'mockedAccessToken' });
      expect(client.set).toHaveBeenCalledWith('user:1', 'mockedAccessToken');
      expect(client.expire).toHaveBeenCalledWith(
        'mockedAccessToken',
        24 * 60 * 60,
      );
    });

    it('should throw BadRequestException if user does not exist', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      const loginDto: LoginDto = {
        username: 'nonexistentUser',
        password: 'password',
      };

      await expect(authService.login(loginDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('signUp', () => {
    it('should return an access token on successful registration', async () => {
      const mockUser: any = { id: 1, username: 'testUser' };
      jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockedAccessToken');
      jest.spyOn(client, 'set').mockImplementation();
      jest.spyOn(client, 'expire').mockImplementation();

      const registerDto: RegisterDto = {
        username: 'testUser',
        password: 'testPassword',
      };
      const result = await authService.signUp(registerDto);

      expect(result).toEqual({ access_token: 'mockedAccessToken' });
      expect(client.set).toHaveBeenCalledWith('user:1', 'mockedAccessToken');
      expect(client.expire).toHaveBeenCalledWith(
        'mockedAccessToken',
        24 * 60 * 60,
      );
    });

    it('should throw an error and log it if signUp fails', async () => {
      jest
        .spyOn(userService, 'createUser')
        .mockRejectedValue(new Error('Registration failed'));
      jest.spyOn(Logger, 'error').mockImplementation();

      const registerDto: RegisterDto = {
        username: 'testUser',
        password: 'testPassword',
      };

      await expect(authService.signUp(registerDto)).rejects.toThrowError(
        'Registration failed',
      );
      expect(Logger.error).toHaveBeenCalledWith(
        'sign up function ',
        expect.any(Error),
      );
    });
  });

  describe('logout', () => {
    it('should delete the user token from Redis on successful logout', async () => {
      jest.spyOn(client, 'del').mockImplementation();

      const user = { id: 1, username: 'testUser' };
      await authService.logout(user);

      expect(client.del).toHaveBeenCalledWith('user:1');
    });
  });
});
