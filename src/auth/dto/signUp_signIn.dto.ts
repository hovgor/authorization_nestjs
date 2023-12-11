import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
//es filei anuny poxi Astcu siro auth.dto.ts
export class SignUpDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}

export class LoginDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}
