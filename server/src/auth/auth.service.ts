import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { MagicLink } from './entities/magic-link.entity';
import { UsersService } from '../users/users.service';
import { MagicLinkRequestDto } from './dto/magic-link-request.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(MagicLink)
    private magicLinkRepository: Repository<MagicLink>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // 이메일 전송을 위한 Nodemailer 설정
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('email.host'),
      port: this.configService.get('email.port'),
      auth: {
        user: this.configService.get('email.user'),
        pass: this.configService.get('email.password'),
      },
    });
  }

  // 매직 링크 요청 처리
async requestMagicLink(magicLinkRequestDto: MagicLinkRequestDto): Promise<{ success: boolean }> {
  const { email, rememberMe = false } = magicLinkRequestDto;
  
  // 토큰 생성
  const token = crypto.randomBytes(32).toString('hex');
  
  // 만료 시간 설정 (30분)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 30);
  
  // 기존 매직 링크 비활성화
  await this.magicLinkRepository.update(
    { email, used: false },
    { used: true }
  );
  
  // 새 매직 링크 저장
  const magicLink = this.magicLinkRepository.create({
    email,
    token,
    expiresAt,
    rememberMe,
  });
  await this.magicLinkRepository.save(magicLink);
  
  // 이메일 전송
  const frontendUrl = this.configService.get('frontendUrl');
  const magicLinkUrl = `${frontendUrl}/login?token=${token}`;
  
  // 개발 환경에서는 콘솔에 출력
  if (this.configService.get('NODE_ENV') === 'development') {
    console.log('\n========================================');
    console.log('🔐 Magic Link (Development Mode)');
    console.log('========================================');
    console.log(`📧 Email: ${email}`);
    console.log(`🔗 Login URL: ${magicLinkUrl}`);
    console.log(`⏰ Expires at: ${expiresAt.toLocaleString()}`);
    console.log('========================================\n');
  } else {
    // 프로덕션 환경에서만 실제 이메일 전송
    try {
      await this.transporter.sendMail({
        from: this.configService.get('email.from'),
        to: email,
        subject: '피트니스 트래커 로그인 링크',
        html: `
          <h1>피트니스 트래커 로그인</h1>
          <p>아래 링크를 클릭하여 로그인하세요:</p>
          <a href="${magicLinkUrl}" style="display: inline-block; padding: 10px 20px; background-color: #00D982; color: #000000; text-decoration: none; border-radius: 5px;">로그인</a>
          <p>이 링크는 30분 동안 유효합니다.</p>
        `,
      });
    } catch (error) {
      console.error('Email send failed:', error);
      throw new BadRequestException('이메일 전송에 실패했습니다.');
    }
  }
  
  return { success: true };
}

  // 매직 링크 토큰 검증
  async verifyMagicLink(token: string): Promise<{ token: string; expiresAt: string; user: any }> {
    // 토큰 조회
    const magicLink = await this.magicLinkRepository.findOne({
      where: { token, used: false },
    });
    
    // 토큰이 없거나 만료된 경우
    if (!magicLink || new Date() > magicLink.expiresAt) {
      throw new UnauthorizedException('유효하지 않거나 만료된 토큰입니다.');
    }
    
    // 토큰 사용 처리
    magicLink.used = true;
    await this.magicLinkRepository.save(magicLink);
    
    // 사용자 조회 또는 생성
    let user = await this.usersService.findByEmail(magicLink.email);
    if (!user) {
      const createUserDto: CreateUserDto = { email: magicLink.email };
      user = await this.usersService.create(createUserDto);
    }
    
    // JWT 토큰 생성
    const payload = { sub: user.id, email: user.email };
    
    // 토큰 만료 시간 설정
    const expiresIn = magicLink.rememberMe
      ? this.configService.get('jwt.refreshExpiresIn')
      : this.configService.get('jwt.accessExpiresIn');
    
    const jwtToken = this.jwtService.sign(payload, { expiresIn });
    
    // 만료 시간 계산
    const expiresAt = new Date();
    if (magicLink.rememberMe) {
      expiresAt.setDate(expiresAt.getDate() + 7); // 7일
    } else {
      expiresAt.setHours(expiresAt.getHours() + 2); // 2시간
    }
    
    return {
      token: jwtToken,
      expiresAt: expiresAt.toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // 토큰 갱신
  async refreshToken(userId: string): Promise<{ token: string; expiresAt: string; user: any }> {
    const user = await this.usersService.findOne(userId);
    
    // JWT 토큰 생성
    const payload = { sub: user.id, email: user.email };
    const jwtToken = this.jwtService.sign(payload);
    
    // 만료 시간 계산 (2시간)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);
    
    return {
      token: jwtToken,
      expiresAt: expiresAt.toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}