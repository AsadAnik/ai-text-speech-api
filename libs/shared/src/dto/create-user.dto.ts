// create-user.dto.ts
export class CreateUserDto {
    email: string;
    first_name: string;
    last_name: string;
    image_url: string;
    username: string;
    password: string;
  }
  
  // login-user.dto.ts
  export class LoginUserDto {
    email: string;
    password: string;
  }
  