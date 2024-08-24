import { IsEmail, IsString, IsStrongPassword, MinLength } from "class-validator";
//aunque son iguales al createdto las reglas pueden cambiar
export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @MinLength(6)
  password: string;
}
