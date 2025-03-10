import {
  Controller,
  UseGuards,
  Param,
  Get,
  Req,
  Query,
  Post,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import GetFreelancerDto from 'src/modules/user/dto/get-freelancer-params.dto';
import { ReqUser } from 'src/modules/user/dto/get-user-dto.dto';
import { getAuthorizationApiHeader } from '@/common/utils/swagger';
import { Contract } from '@/common/entities/Contract.entity';
import { ContractsService } from './contracts.service';
import ContractsResponseDto from './dto/contracts-response.dto';
import GetHiresDto from './dto/get-hires.dto';

enum EndpointsRoutes {
  active = 'active',
  closed = 'closed',
  closeContract = '/close/:contractId',
  all = 'all',
}

@ApiTags('contracts')
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @ApiOperation({
    summary: 'Get active contracts',
  })
  @ApiResponse({ type: ContractsResponseDto })
  @ApiHeader(getAuthorizationApiHeader())
  @UseGuards(JwtAuthGuard)
  @Get(`${EndpointsRoutes.active}`)
  getActiveContractsFreelancer(@Req() req): Promise<Contract[]> {
    return this.contractsService.getActiveContracts(req.user);
  }

  @ApiOperation({
    summary: 'Get closed contracts',
  })
  @ApiResponse({ type: ContractsResponseDto })
  @ApiHeader(getAuthorizationApiHeader())
  @UseGuards(JwtAuthGuard)
  @Get(`${EndpointsRoutes.closed}`)
  getClosedContractsFreelancer(@Req() req): Promise<Contract[]> {
    return this.contractsService.getClosedContracts(req.user);
  }

  @ApiOperation({
    summary: 'Close contract',
  })
  @ApiHeader(getAuthorizationApiHeader())
  @UseGuards(JwtAuthGuard)
  @Post(EndpointsRoutes.closeContract)
  closeContract(
    @Req() req: ReqUser,
    @Param('contractId') contractId: number,
  ): Promise<void> {
    return this.contractsService.closeContract(req.user, contractId);
  }

  @ApiOperation({
    summary: 'Get all hired freelancers',
  })
  @ApiResponse({ type: GetHiresDto })
  @ApiHeader(getAuthorizationApiHeader())
  @UseGuards(JwtAuthGuard)
  @Get(`${EndpointsRoutes.all}`)
  getAllHiredFreelancers(
    @Req() req: ReqUser,
    @Query() params: GetFreelancerDto,
  ): Promise<GetHiresDto> {
    return this.contractsService.getAllHiredFreelancers(req.user, params);
  }
}
