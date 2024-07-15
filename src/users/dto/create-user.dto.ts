import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  usuario: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  contraseña: string;
}
