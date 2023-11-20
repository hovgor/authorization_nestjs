import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto, RegisterDto } from '../dto/signUp_signIn.dto';
import { HttpStatus } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a JWT token on successful login', async () => {
      jest.spyOn(authService, 'login').mockReturnValue('mockedJwtToken');

      const loginDto: LoginDto = {
        username: 'testUser',
        password: 'testPassword',
      };

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.login({} as any, loginDto, response as any);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.ACCEPTED);
      expect(response.json).toHaveBeenCalledWith('mockedJwtToken');
    });
  });

  describe('signUp', () => {
    it('should return the result of signUp method from authService on successful registration', async () => {
      const signUpResult: any = { userId: 1, username: 'testUser' };
      jest
        .spyOn(authService, 'signUp')
        .mockReturnValue(Promise.resolve(signUpResult));

      const registerDto: RegisterDto = {
        username: 'testUser',
        password: 'testPassword',
      };

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.signUp(response as any, registerDto);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(response.json).toHaveBeenCalledWith(signUpResult);
    });

    it('should handle errors during registration', async () => {
      jest
        .spyOn(authService, 'signUp')
        .mockRejectedValue(new Error('Registration failed'));

      const registerDto: RegisterDto = {
        username: 'testUser',
        password: 'testPassword',
      };

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(
        authController.signUp(response as any, registerDto),
      ).rejects.toThrowError('Registration failed');
    });
  });

  describe('logout', () => {
    it('should call authService.logout on successful logout', async () => {
      jest.spyOn(authService, 'logout').mockResolvedValue();

      const request = {
        user: { userId: 1, username: 'testUser' },
      };

      await authController.logout(request as any);

      expect(authService.logout).toHaveBeenCalledWith(request.user);
    });
  });
});
