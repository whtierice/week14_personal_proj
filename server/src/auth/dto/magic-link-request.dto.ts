import { IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class MagicLinkRequestDto {
  @IsEmail()
  email: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}