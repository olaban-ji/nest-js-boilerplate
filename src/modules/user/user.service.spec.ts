import { TestBed, type Mocked } from '@suites/unit';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { EntityRepository } from '@mikro-orm/core';
import { AppRedisService } from '@services/redis/redis.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRoleEnum } from '@common/enums';

describe('User Service Unit Spec', () => {
  let userService: UserService;
  let userRepository: Mocked<EntityRepository<User>>;
  let appRedisService: Mocked<AppRedisService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();

    userService = unit;
    userRepository = unitRef.get(getRepositoryToken(User));
    appRedisService = unitRef.get(AppRedisService);
  });

  describe('create', () => {
    const userData = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'hashedPassword123',
      phoneNumber: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      countryCode: 'USA',
    };

    it('should throw ConflictException when user already exists', async () => {
      const existingUser = {
        id: '1',
        ...userData,
        role: UserRoleEnum.USER,
        changePassword: false,
        passwordResetRequested: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Partial<User> as User;

      userRepository.findOne.mockResolvedValue(existingUser);

      await expect(userService.create(userData)).rejects.toThrow(
        ConflictException,
      );
      await expect(userService.create(userData)).rejects.toThrow(
        'User already exists in the system.',
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        email: userData.email,
      });
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should create a new user when user does not exist', async () => {
      const newUser = {
        id: '1',
        ...userData,
        role: UserRoleEnum.USER,
        changePassword: false,
        passwordResetRequested: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Partial<User> as User;

      const mockEntityManager = {
        persistAndFlush: jest.fn().mockResolvedValue(undefined),
      };

      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(newUser);
      userRepository.getEntityManager.mockReturnValue(mockEntityManager as any);

      const result = await userService.create(userData);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        email: userData.email,
      });
      expect(userRepository.create).toHaveBeenCalledWith(userData);
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(newUser);

      expect(result).not.toHaveProperty('password');

      expect(result).toMatchObject({
        id: '1',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        postalCode: userData.postalCode,
        country: userData.country,
        countryCode: userData.countryCode,
        role: UserRoleEnum.USER,
        changePassword: false,
        passwordResetRequested: false,
      });
    });

    it('should create a user with minimal required fields', async () => {
      const minimalUserData = {
        email: 'minimal@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'hashedPassword456',
      };

      const newUser = {
        id: '2',
        ...minimalUserData,
        role: UserRoleEnum.USER,
        changePassword: false,
        passwordResetRequested: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Partial<User> as User;

      const mockEntityManager = {
        persistAndFlush: jest.fn().mockResolvedValue(undefined),
      };

      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(newUser);
      userRepository.getEntityManager.mockReturnValue(mockEntityManager as any);

      const result = await userService.create(minimalUserData);

      expect(result).not.toHaveProperty('password');
      expect(result).toMatchObject({
        id: '2',
        email: minimalUserData.email,
        firstName: minimalUserData.firstName,
        lastName: minimalUserData.lastName,
      });
    });
  });

  describe('findOne', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'hashedPassword123',
      role: UserRoleEnum.USER,
      changePassword: false,
      passwordResetRequested: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Partial<User> as User;

    const mockEntityManager = {
      merge: jest.fn((user) => user),
    };

    beforeEach(() => {
      userRepository.getEntityManager.mockReturnValue(mockEntityManager as any);
    });

    it('should return cached user when querying by id', async () => {
      const cachedData = JSON.stringify(mockUser);
      appRedisService.get.mockResolvedValue(cachedData);
      userRepository.create.mockReturnValue(mockUser);

      const result = await userService.findOne('1');

      expect(appRedisService.get).toHaveBeenCalledWith('users:id:1');
      expect(userRepository.create).toHaveBeenCalledWith(
        JSON.parse(cachedData),
      );
      expect(mockEntityManager.merge).toHaveBeenCalledWith(mockUser);
      expect(userRepository.findOneOrFail).not.toHaveBeenCalled();
      expect(result).toBe(mockUser);
    });

    it('should return cached user when querying by id object', async () => {
      const cachedData = JSON.stringify(mockUser);
      appRedisService.get.mockResolvedValue(cachedData);
      userRepository.create.mockReturnValue(mockUser);

      const result = await userService.findOne({ id: '1' });

      expect(appRedisService.get).toHaveBeenCalledWith('users:id:1');
      expect(result).toBe(mockUser);
    });

    it('should return cached user when querying by email', async () => {
      const cachedData = JSON.stringify(mockUser);
      appRedisService.get.mockResolvedValue(cachedData);
      userRepository.create.mockReturnValue(mockUser);

      const result = await userService.findOne({ email: 'test@example.com' });

      expect(appRedisService.get).toHaveBeenCalledWith(
        'users:email:test@example.com',
      );
      expect(result).toBe(mockUser);
    });

    it('should fetch from database and cache when not in cache', async () => {
      appRedisService.get.mockResolvedValue(null);
      userRepository.findOneOrFail.mockResolvedValue(mockUser);

      const result = await userService.findOne({ id: '1' });

      expect(appRedisService.get).toHaveBeenCalledWith('users:id:1');
      expect(userRepository.findOneOrFail).toHaveBeenCalledWith(
        { id: '1' },
        undefined,
      );
      expect(appRedisService.set).toHaveBeenCalledWith(
        'users:id:1',
        JSON.stringify(mockUser),
        300,
      );
      expect(appRedisService.set).toHaveBeenCalledWith(
        'users:email:test@example.com',
        JSON.stringify(mockUser),
        300,
      );
      expect(result).toBe(mockUser);
    });

    it('should not use cache for queries without id or email', async () => {
      userRepository.findOneOrFail.mockResolvedValue(mockUser);

      const result = await userService.findOne({ firstName: 'John' });

      expect(appRedisService.get).not.toHaveBeenCalled();
      expect(userRepository.findOneOrFail).toHaveBeenCalledWith(
        { firstName: 'John' },
        undefined,
      );
      expect(appRedisService.set).not.toHaveBeenCalled();
      expect(result).toBe(mockUser);
    });

    it('should pass options to findOneOrFail', async () => {
      const options = { populate: ['profile'] };
      appRedisService.get.mockResolvedValue(null);
      userRepository.findOneOrFail.mockResolvedValue(mockUser);

      await userService.findOne({ id: '1' }, options as any);

      expect(userRepository.findOneOrFail).toHaveBeenCalledWith(
        { id: '1' },
        options,
      );
    });
  });

  describe('update', () => {
    const existingUser = {
      id: '1',
      email: 'old@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'hashedPassword123',
      role: UserRoleEnum.USER,
      changePassword: false,
      passwordResetRequested: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Partial<User> as User;

    const mockEntityManager = {
      persistAndFlush: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(() => {
      jest.clearAllMocks();
      mockEntityManager.persistAndFlush.mockClear();
      userRepository.getEntityManager.mockReturnValue(mockEntityManager as any);
    });

    it('should update user and refresh cache', async () => {
      const updateData = {
        id: '1',
        email: 'new@example.com',
        firstName: 'Jane',
      };

      const updatedUser = {
        ...existingUser,
        ...updateData,
      } as Partial<User> as User;

      userRepository.findOneOrFail.mockResolvedValue(existingUser);
      userRepository.assign.mockImplementation((user: User, data) => {
        Object.assign(user, data);
        return user;
      });

      const result = await userService.update(updateData);

      expect(userRepository.findOneOrFail).toHaveBeenCalledWith(
        { id: '1' },
        { failHandler: expect.any(Function) },
      );
      expect(userRepository.assign).toHaveBeenCalledWith(
        existingUser,
        updateData,
      );
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(
        existingUser,
      );

      expect(appRedisService.set).toHaveBeenCalledWith(
        'users:id:1',
        JSON.stringify(existingUser),
        300,
      );
      expect(appRedisService.set).toHaveBeenCalledWith(
        'users:email:new@example.com',
        JSON.stringify(existingUser),
        300,
      );

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('new@example.com');
      expect(result.firstName).toBe('Jane');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const updateData = { id: '999', email: 'test@example.com' };

      userRepository.findOneOrFail.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(userService.update(updateData)).rejects.toThrow(
        NotFoundException,
      );
      await expect(userService.update(updateData)).rejects.toThrow(
        'User not found',
      );

      expect(userRepository.assign).not.toHaveBeenCalled();
      expect(mockEntityManager.persistAndFlush).not.toHaveBeenCalled();
      expect(appRedisService.set).not.toHaveBeenCalled();
    });

    it('should update partial user data', async () => {
      const updateData = {
        id: '1',
        phoneNumber: '+9876543210',
      };

      userRepository.findOneOrFail.mockResolvedValue(existingUser);
      userRepository.assign.mockImplementation((user: User, data) => {
        Object.assign(user, data);
        return user;
      });

      const result = await userService.update(updateData);

      expect(userRepository.assign).toHaveBeenCalledWith(
        existingUser,
        updateData,
      );
      expect(result).not.toHaveProperty('password');
      expect(result.phoneNumber).toBe('+9876543210');
    });

    it('should handle cache update errors gracefully', async () => {
      const updateData = { id: '1', firstName: 'Updated' };

      userRepository.findOneOrFail.mockResolvedValue(existingUser);
      userRepository.assign.mockImplementation((user: User, data) => {
        Object.assign(user, data);
        return user;
      });
      appRedisService.set.mockRejectedValue(new Error('Redis error'));

      await expect(userService.update(updateData)).rejects.toThrow(
        'Redis error',
      );

      expect(mockEntityManager.persistAndFlush).toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    const userId = '1';
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'oldPassword',
      role: UserRoleEnum.USER,
      changePassword: true,
      passwordResetRequested: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Partial<User> as User;

    const mockUpdatedUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRoleEnum.USER,
      changePassword: false,
      passwordResetRequested: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Partial<User> as Omit<User, 'password'>;

    let updateSpy: jest.SpyInstance;

    beforeEach(() => {
      updateSpy = jest.spyOn(userService, 'update');
    });

    afterEach(() => {
      updateSpy.mockRestore();
    });

    it('should change password when passwords match and changePassword is true', async () => {
      const changePasswordDto = {
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      };

      userRepository.findOneOrFail.mockResolvedValue(mockUser);
      updateSpy.mockResolvedValue(mockUpdatedUser);

      const result = await userService.changePassword(
        userId,
        changePasswordDto,
      );

      expect(userRepository.findOneOrFail).toHaveBeenCalledWith(
        { id: userId },
        { failHandler: expect.any(Function) },
      );
      expect(updateSpy).toHaveBeenCalledWith({
        id: userId,
        password: 'newPassword123',
        changePassword: false,
      });
      expect(result).toEqual(mockUpdatedUser);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw BadRequestException when passwords do not match', async () => {
      const changePasswordDto = {
        newPassword: 'newPassword123',
        confirmPassword: 'differentPassword',
      };

      await expect(
        userService.changePassword(userId, changePasswordDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        userService.changePassword(userId, changePasswordDto),
      ).rejects.toThrow('Passwords do not match');

      expect(userRepository.findOneOrFail).not.toHaveBeenCalled();
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const changePasswordDto = {
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      };

      userRepository.findOneOrFail.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        userService.changePassword(userId, changePasswordDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        userService.changePassword(userId, changePasswordDto),
      ).rejects.toThrow('User not found');

      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when changePassword flag is false', async () => {
      const changePasswordDto = {
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      };

      const userWithFlagFalse = {
        ...mockUser,
        changePassword: false,
      } as Partial<User> as User;

      userRepository.findOneOrFail.mockResolvedValue(userWithFlagFalse);

      await expect(
        userService.changePassword(userId, changePasswordDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        userService.changePassword(userId, changePasswordDto),
      ).rejects.toThrow('Password change is not allowed for this user');

      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should set changePassword flag to false after successful change', async () => {
      const changePasswordDto = {
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      };

      userRepository.findOneOrFail.mockResolvedValue(mockUser);
      updateSpy.mockResolvedValue(mockUpdatedUser);

      await userService.changePassword(userId, changePasswordDto);

      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          changePassword: false,
        }),
      );
    });
  });
});
