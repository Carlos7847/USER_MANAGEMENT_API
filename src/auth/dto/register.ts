import { Transform } from 'class-transformer';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  usuario: string;

  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  contraseña: string;
}
