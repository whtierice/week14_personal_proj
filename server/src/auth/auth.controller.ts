import { Controller, Post, Body, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MagicLinkRequestDto } from './dto/magic-link-request.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('magic-link')
  async requestMagicLink(@Body() magicLinkRequestDto: MagicLinkRequestDto) {
    return this.authService.requestMagicLink(magicLinkRequestDto);
  }

  @Get('verify')
  async verifyMagicLink(@Query('token') token: string) {
    const result = await this.authService.verifyMagicLink(token);
    
    // 클라이언트가 기대하는 형식으로 감싸기
    return {
      data: result,
      success: true
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    // 클라이언트에서 토큰을 삭제하므로 서버에서는 특별한 처리가 필요 없음
    return { success: true };
  }
}