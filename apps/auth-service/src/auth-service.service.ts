import { Injectable } from "@nestjs/common";
import { LoginUserDto, RegisterUserDto } from "@app/shared";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@app/shared";
import { HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthUserLoginType, AuthUserType } from '@app/shared';
import { MailerService } from "@app/common";
import { v4 as uuid } from 'uuid';


@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) { }

  /**
   * REGISTER USER SERVICE
   * @param body
   * @returns
   */
  //  region Register Service
  public async register(body: RegisterUserDto): Promise<AuthUserType> {
    const { email, username, password, first_name, last_name, image_file } = body;

    // Check if user already exists
    const existingUser = await this.emailOrUsernameExists(username, email);

    if (existingUser) {
      throw new HttpException(
        "This Username or Email is already exists",
        HttpStatus.BAD_REQUEST
      );
    }

    // Hash the password and generate verification code
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationOtpCode = this.generateOtpVerificationCodes();

    // Create the new user
    const newUser = this.userRepository.create({
      id: `${uuid()}`,
      first_name,
      last_name,
      email,
      username,
      password: hashedPassword,
      image_url: image_file || "default.png",
      is_verified: false,
      verification_code: verificationOtpCode,
    });

    // Save the user to the database and Send verification mail
    const savedUser = await this.userRepository.save(newUser);
    await this.mailerService.sendVerificationMail(email, verificationOtpCode);

    return savedUser;
  }


  /**
   * LOGIN USER SERVICE
   * @param loginUserDto
   * @returns
   */
  // region Login Service
  public async login(loginUserDto: LoginUserDto): Promise<AuthUserLoginType> {
    const { usernameOrEmail, password } = loginUserDto;
    const user = await this.emailOrUsernameExists(usernameOrEmail);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }

    // Generate a real JWT token
    const accessToken = this.generateJwtToken(user);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      image_url: user.image_url || "default.png",
      created_at: user.created_at,
      updated_at: user.updated_at,
      accessToken,
    };
  }


  /**
   * EMAIL / USERNAME EXISTS SERVICE CHECK
   * This method can handle both two arguments (for registration)
   * or a single argument (for login).
   * @param usernameOrEmail
   * @param email (optional)
   * @returns User | undefined
   */
  // region Username/Email Availity
  public async emailOrUsernameExists(usernameOrEmail: string, email?: string): Promise<User | undefined> {
    if (!usernameOrEmail || usernameOrEmail.trim() === "") {
      throw new HttpException(
        "Username or Email must be provided",
        HttpStatus.BAD_REQUEST
      );
    }

    // If email is provided, validate it as well
    if (email && email.trim() === "") {
      throw new HttpException("Email must be valid", HttpStatus.BAD_REQUEST);
    }
    // If both usernameOrEmail and email are provided (for registration)
    if (usernameOrEmail && email) {
      return this.userRepository.findOne({
        where: [{ email }, { username: usernameOrEmail }],
      });
    }

    // If only usernameOrEmail is provided (for login)
    return this.userRepository.findOne({
      where: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });
  }

  /**
   * VERIFY USER SERVICE
   * @param user 
   * @param verifyCode 
   */
  // region Verify User Service
  public async verifyUser(user: User, verifyCode: string): Promise<void> {
    if (user && user?.is_verified) {
      if (user.verification_code !== verifyCode) {
        throw new HttpException('Invalid verification code', HttpStatus.BAD_REQUEST);
      }

      await this.userRepository.update(user.id, 
        { 
          is_verified: true, 
          verification_code: '' 
        }
      );
    }
  }

  /**
   * GENERATE OTP FOR EMAIL VERIFICATION
   * @returns 
   */
  // region Generate OTP
  private generateOtpVerificationCodes(): string {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp?.toString();
  }

  /**
   * GENERATE JWT TOKEN
   * @param user 
   * @returns 
   */
  // region Generate JWT-Token
  private generateJwtToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    return this.jwtService.sign(payload);
  }
}
