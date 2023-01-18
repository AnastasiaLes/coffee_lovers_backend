import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Job } from '@entities/Job.entity';
import { Request } from '@entities/Request.entity';
import { getRepositoryProvider, mockRepository } from '@/common/utils/tests';
import UserDto from '@/modules/user/dto/user.dto';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { NotificationEvent } from '@/modules/notifications/types';
import { JobsService } from './job.service';

describe('JobsService', () => {
  let jobsService: JobsService;

  const mockNotificationService = {
    emit: (id: number, data: NotificationEvent) => ({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        getRepositoryProvider(Job),
        getRepositoryProvider(Request),
        {
          provide: NotificationsService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    jobsService = module.get<JobsService>(JobsService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('getJobById', () => {
    it('should return job by id', async (): Promise<void> => {
      const jobId = 1;
      const job = { id: jobId } as Job;
      const leftJoins = ['category'];

      jest.spyOn(jobsService, 'findOne').mockResolvedValue(job);

      const value = await jobsService.getJobById(jobId);

      expect(jobsService.findOne).toBeCalledWith({ id: jobId }, leftJoins);
      expect(value).toEqual({
        job,
      });
    });

    it('job not found: should return null in job property', async (): Promise<void> => {
      const jobId = 10;

      jest.spyOn(jobsService, 'findOne').mockResolvedValue(null);

      expect(await jobsService.getJobById(jobId)).toEqual({
        job: null,
      });
    });
  });

  describe('getJobProposals', () => {
    it('should return job proposals', async (): Promise<void> => {
      const jobId = 1;
      const user = { id: 1 } as UserDto;
      const job = { id: jobId, owner: { id: 1 } } as Job;

      jest.spyOn(jobsService, 'findOne').mockResolvedValue(job);

      expect(await jobsService.getJobProposals(jobId, user)).toEqual({
        job,
        proposals: [],
      });
    });

    it('user is not job owner: should throw forbidden exception', async (): Promise<void> => {
      const jobId = 1;
      const user = { id: 1 } as UserDto;
      const job = { id: jobId, owner: { id: 2 } } as Job;

      jest.spyOn(jobsService, 'findOne').mockResolvedValue(job);

      expect(jobsService.getJobProposals(jobId, user)).rejects.toEqual(
        new ForbiddenException(),
      );
    });
  });

  describe('Find jobs', () => {
    it('should return object with jobs and total count', async () => {
      const params = { offset: 0, limit: 10 };
      expect(await jobsService.findJobs(params)).toEqual({
        jobs: [],
        meta: {
          totalCount: 0,
        },
      });
    });

    it('query should be called one time', async () => {
      const params = { offset: 0, limit: 10 };

      jest.spyOn(mockRepository.createQueryBuilder(), 'getManyAndCount');
      jest.spyOn(mockRepository.createQueryBuilder(), 'getMany');
      jest.spyOn(mockRepository.createQueryBuilder(), 'getCount');

      await jobsService.findJobs(params);

      expect(
        mockRepository.createQueryBuilder().getMany,
      ).not.toHaveBeenCalled();

      expect(
        mockRepository.createQueryBuilder().getCount,
      ).not.toHaveBeenCalled();

      expect(
        mockRepository.createQueryBuilder().getManyAndCount,
      ).toHaveBeenCalledTimes(1);
    });

    it('limit & offset should be set even without params', async () => {
      jest.spyOn(mockRepository.createQueryBuilder(), 'limit');
      jest.spyOn(mockRepository.createQueryBuilder(), 'offset');

      await jobsService.findJobs({});

      expect(mockRepository.createQueryBuilder().limit).toHaveBeenCalled();
      expect(mockRepository.createQueryBuilder().offset).toHaveBeenCalled();
    });

    it('jobs should be in descending order', async () => {
      jest.spyOn(mockRepository.createQueryBuilder(), 'orderBy');

      await jobsService.findJobs({});

      expect(mockRepository.createQueryBuilder().orderBy).toHaveBeenCalledWith(
        'job.created_at',
        'DESC',
      );
    });
  });
});
