import { IsEmail, IsNotEmpty, IsString } from "class-validator";

// region Register User DTO
export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsString()
  readonly first_name: string;

  @IsString()
  readonly last_name: string;

  @IsString()
  readonly image_file: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

// region Login User DTO
export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  readonly usernameOrEmail: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
