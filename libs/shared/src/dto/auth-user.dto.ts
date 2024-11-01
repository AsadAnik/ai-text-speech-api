import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


// region Register DTO
export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Email of the user',
    example: 'john@example.com'
  })
  readonly email: string;

  @IsString()
  @ApiProperty({
    description: 'First name of the user',
    example: 'John'
  })
  readonly first_name: string;

  @IsString()
  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe'
  })
  readonly last_name: string;

  @IsString()
  @ApiProperty({
    description: 'Image file of the user',
    example: 'image.png'
  })
  readonly image_file: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe'
  })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password of the user',
    example: 'password'
  })
  readonly password: string;
}


// region Login DTO
export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Username or email of the user',
    example: 'john_doe or john@example.com'
  })
  readonly usernameOrEmail: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password of the user',
    example: 'password'
  })
  readonly password: string;
}


// region Verify Body DTO
export class VerifyUserBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Username or email of the user to verify',
    example: 'john_doe or john@example.com'
  })
  readonly usernameOrEmail: string;
}


// region Verify Query DTO
export class VerifyUserQueryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Verification code sent to the user',
    example: '123456'
  })
  readonly verifyCode: string;
}