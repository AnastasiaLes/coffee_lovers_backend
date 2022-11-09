import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  BadRequestException,
  Req,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';
import CreateUserDto from '@/modules/user/dto/create-user.dto';
import SignInDto from '@/modules/auth/dto/signIn.dto';
import TokenDto from '@/modules/auth/dto/token.dto';
import AuthResponseDto from '@/modules/auth/dto/auth-response.dto';

import { RequestUserDto } from '@/modules/auth/googleauth/dto/requestUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  googleLogin(@Req() req: RequestUserDto) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async signUp(dto: CreateUserDto): Promise<AuthResponseDto> {
    try {
      const user = await this.userService.findByEmail(dto.email);
      if (user) {
        throw new BadRequestException('User is already exist');
      }
      await this.userService.create(dto);

      return this.createTokens(dto.email);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(dto: SignInDto): Promise<AuthResponseDto> {
    try {
      const user = await this.userService.findByEmail(dto.email);
      if (!user) {
        throw new BadRequestException('invalid email');
      }
      if (!user.is_google) {
        const isPassEquals = await bcrypt.compare(dto.password, user.password);
        if (!isPassEquals) {
          throw new BadRequestException('invalid password');
        }
      }

      return this.createTokens(dto.email);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private createTokens(email: string): AuthResponseDto {
    const payload: TokenDto = { email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
