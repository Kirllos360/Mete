import { Controller, Post, Body, HttpCode, HttpStatus, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RefreshTokenService } from './refresh-token.service';
import { Role } from './types';
import { Public } from './public.decorator';

class RefreshDto {
  @IsString()
  refreshToken!: string;
}

class DevLoginDto {
  @IsString()
  userId!: string;

  @IsEnum(Role)
  role!: Role;

  @IsOptional()
  @IsString()
  name?: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto): Promise<{ accessToken: string; refreshToken: string }> {
    return this.refreshTokenService.rotate(dto.refreshToken);
  }

  @Public()
  @Post('dev-login')
  @HttpCode(HttpStatus.OK)
  async devLogin(@Body() dto: DevLoginDto): Promise<{ accessToken: string; user: { id: string; name: string; role: string } }> {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      throw new ForbiddenException('Dev login is not available in production');
    }
    const payload = { sub: dto.userId, userId: dto.userId, role: dto.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user: { id: dto.userId, name: dto.name ?? dto.userId, role: dto.role } };
  }
}
