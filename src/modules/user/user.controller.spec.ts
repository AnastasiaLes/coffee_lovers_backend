import { User } from '@entities/User.entity';
import { WorkHistory } from '@entities/WorkHistory.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { Education } from '@/common/entities/Education.entity';
import {
  educationPayload,
  workhistoryPayload,
} from '@/common/constants/mockdata';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ReqUser } from './dto/get-user-dto.dto';
import AddUserInfoDto from './dto/add-user-info.dto';
import PasswordResetRequestDto from './dto/password-reset-request.dto';
import PasswordResetDto from './dto/password-reset.dto';
import AddUserEducationDto from './dto/add-user-education.dto';
import AddUserWorkhistoryDto from './dto/add-user-workhistory.dto';

describe('UserController', () => {
  let userController: UserController;
  let reqUser: ReqUser;

  const mockUserService = {
    getWorkInfo: jest
      .fn()
      .mockImplementation((user: User) => [{ id: 1 } as WorkHistory]),
    getEducationInfo: jest
      .fn()
      .mockImplementation((user: User) => [{ id: 1 } as Education]),
    getFreelancerInfoById: jest
      .fn()
      .mockImplementation((id: number) => ({ id } as User)),
    addUserInfo: jest
      .fn()
      .mockImplementation((dto: AddUserInfoDto, user: User) => {}),
    addEducationInfo: jest
      .fn()
      .mockImplementation((dto: AddUserEducationDto[], user: User) => {}),
    addWorkhistoryInfo: jest
      .fn()
      .mockImplementation((dto: AddUserWorkhistoryDto[], user: User) => {}),
    sendPasswordResetMail: jest
      .fn()
      .mockImplementation((dto: PasswordResetRequestDto) => {}),
    resetPassword: jest.fn().mockImplementation((dto: PasswordResetDto) => {}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    userController = module.get<UserController>(UserController);

    reqUser = {
      user: {
        id: 1,
      } as User,
    };
  });

  describe('getUserInformation', () => {
    it('should return information about current user', async (): Promise<void> => {
      expect(await userController.getUserInformation(reqUser)).toBe(
        reqUser.user,
      );
    });
  });

  describe('getUserWorkInformation', () => {
    it('should call getWorkInfo in user service', async (): Promise<void> => {
      expect(await userController.getUserWorkInformation(reqUser)).toEqual([
        { id: expect.any(Number) } as WorkHistory,
      ]);

      expect(mockUserService.getWorkInfo).toHaveBeenCalledWith(reqUser.user);
    });
  });

  describe('getUserEducationInformation', () => {
    it('should call geEduInfo in user service', async (): Promise<void> => {
      expect(await userController.getUserEducationInformation(reqUser)).toEqual(
        [{ id: expect.any(Number) } as Education],
      );

      expect(mockUserService.getEducationInfo).toHaveBeenCalledWith(
        reqUser.user,
      );
    });
  });

  describe('getFreelancerPageInfoById', () => {
    it('should call getFreelancerPageInfoById and return user object', async (): Promise<void> => {
      const params = { key: 1 };

      expect(await userController.getFreelancerPageInfoById(params)).toEqual({
        id: params.key,
      } as User);

      expect(mockUserService.getFreelancerInfoById).toHaveBeenCalledWith(
        params.key,
      );
    });
  });

  describe('addUserInfo', () => {
    it('should call addUserInfo in user service', async (): Promise<void> => {
      const payload: AddUserInfoDto = { first_name: 'John' };
      await userController.addUserInfo(reqUser, payload);

      expect(mockUserService.addUserInfo).toHaveBeenCalledWith(
        payload,
        reqUser.user,
      );
    });
  });

  describe('addEducationInfo', () => {
    it('should call addEducationInfo in user service', async (): Promise<void> => {
      await userController.addEducationInfo(reqUser, educationPayload);

      expect(mockUserService.addEducationInfo).toHaveBeenCalledWith(
        educationPayload,
        reqUser.user,
      );
    });
  });

  describe('addWorkhistoryInfo', () => {
    it('should call addWorkhistoryInfo in user service', async (): Promise<void> => {
      await userController.addWorkhistoryInfo(reqUser, workhistoryPayload);

      expect(mockUserService.addWorkhistoryInfo).toHaveBeenCalledWith(
        workhistoryPayload,
        reqUser.user,
      );
    });
  });

  describe('passwordResetRequest', () => {
    it('should call sendPasswordResetMail in user service', async (): Promise<void> => {
      const dto: PasswordResetRequestDto = { email: 'test@test.com' };
      await userController.passwordResetRequest(dto);

      expect(mockUserService.sendPasswordResetMail).toHaveBeenCalledWith(dto);
    });
  });

  describe('passwordReset', () => {
    it('should call resetPassword in user service', async (): Promise<void> => {
      const dto: PasswordResetDto = { key: 'test', password: 'Qwerty123' };
      await userController.passwordReset(dto);

      expect(mockUserService.resetPassword).toHaveBeenCalledWith(dto);
    });
  });
});
