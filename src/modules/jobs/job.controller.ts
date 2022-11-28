import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Post,
  Request,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import AddJobDescriptionDto from './dto/add-user-job.dto';
import { JobsService } from './job.service';
import { Job } from '@/common/entities/Job.entity';
import JobIdDto from './dto/user-id.dto';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiOperation({ summary: 'Get all jobs' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  @HttpCode(HttpStatus.OK)
  getAllJobs(): Promise<Job[]> {
    return this.jobsService.getAllJobs();
  }

  @ApiOperation({ summary: 'Add job' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Post('/')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  addnewJob(
    @Request() req,
    @Body() payload: AddJobDescriptionDto,
  ): Promise<void> {
    return this.jobsService.addJobInfo(payload, req.user);
  }

  @ApiOperation({ summary: 'get job by id' })
  @ApiResponse({ type: Job })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getOneJob(@Param() id: JobIdDto): Promise<AddJobDescriptionDto> {
    return this.jobsService.getOneJob(id);
  }
}
