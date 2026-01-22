import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasscodeHashing } from '../helpers/passcode-hashing';
import { User } from './schemas/user-schema';
import { UserDocument } from './schemas/user-schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CodeGenerator } from '../helpers/code-generator';
import { AccessJwtService } from '../common/jwt/access-jwt.service';
import { EmailService } from 'src/common/mailer/mailer.service';
import { Time } from '../helpers/time';
import { VerifyUserDto } from './dto/verify-user.dto';

/**
 * @class UsersService
 * @description Manages all user-related operations.
 * This includes creating users, verifying them, and finding users by their ID or verification code.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly accessJwtService: AccessJwtService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * @method create
   * @description Creates a new user and sends a verification email.
   * @param {CreateUserDto} createUserDto - The data transfer object containing user details.
   */
  async create(createUserDto: CreateUserDto) {
    // check if user with the same email or phone number already exists
    const userWithEmailExist = await this.checkIfUserExist({
      email: createUserDto.email,
    });

    if (userWithEmailExist) {
      if (!userWithEmailExist?.isVerified) {
        // Check if the verification code has expired and update accordingly
        if (
          Time.checkIfTimeIsExpired(
            userWithEmailExist.verificationCodeExpiresIn,
          )
        ) {
          const otp = CodeGenerator.generateOtp();
          const verificationCodeExpiresIn = Time.getTimeInOneHour();

          const updatedUser = await this.userModel.findOneAndUpdate(
            { email: userWithEmailExist.email },
            {
              verificationCode: otp.split('').slice(0, -1).join(''),
              isVerified: false,
              verificationCodeExpiresIn,
              password: await PasscodeHashing.hashPassword(
                createUserDto.password,
              ),
            },
            { new: true },
          );

          await this.emailService.sendVerificationMail(
            updatedUser!.email,
            'Learnc Code Account Verification',
            otp,
            updatedUser!.firstName,
          );

          return updatedUser;
        } else {
          await this.emailService.sendVerificationMail(
            userWithEmailExist.email,
            'Bravixo Account Verification',
            userWithEmailExist.verificationCode,
            userWithEmailExist.firstName,
          );

          return userWithEmailExist;
        }
      }

      throw new BadRequestException('', {
        cause: 'User with this email exist',
        description: 'invalid credentials',
      });
    }

    const otp = CodeGenerator.generateOtp();
    const verificationCodeExpiresIn = Time.getTimeInOneHour();

    const createdUser = new this.userModel({
      ...createUserDto,
      verificationCode: otp.split('').slice(0, -1).join(''),
      verificationCodeExpiresIn: verificationCodeExpiresIn,
      password: await PasscodeHashing.hashPassword(createUserDto.password),
    });
    const user = await createdUser.save();

    await this.emailService.sendVerificationMail(
      user.email,
      'Learnc Code Account Verification',
      otp,
      user.firstName,
    );
    return user;
  }

  /**
   * @method verifyUser
   * @description Verifies a user using the provided verification code.
   * @param {string} verificationCode - The verification code sent to the user.
   * @returns {Promise<UserDocument | null>} - The verified user object or null if verification fails.
   * @throws {Error} - Throws an error if the verification process fails.
   */
  async verifyUser(verifyUserDto: VerifyUserDto): Promise<UserDocument | null> {
    if (verifyUserDto.action === 'ACCOUNT_VERIFICATION') {
      const user = await this.checkIfUserExist({
        verificationCode: verifyUserDto.verificationCode,
      });

      if (!user) {
        // User not found or verification code is invalid
        throw new BadRequestException('', {
          cause: 'invalid verification code',
          description: 'Invalid verification code',
        });
      }

      // Check if the verification code has expired
      if (Time.checkIfTimeIsExpired(user.verificationCodeExpiresIn)) {
        throw new BadRequestException('', {
          cause: 'Code has expired',
          description: 'Please request a new verification code',
        });
      }

      // Update user verification status and clear verification code
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: user?._id },
        {
          isVerified: true,
          isActive: true,
          verificationCode: null,
          verificationCodeExpiresIn: null,
        },
        { new: true },
      );

      await this.emailService.sendAccountSetupSuccessMail(
        updatedUser!.email,
        'Account Setup Successful',
        updatedUser!.firstName,
      );

      return updatedUser;
    } else {
      const user = await this.checkIfUserExist({
        passwordResetCode: verifyUserDto.verificationCode,
      });

      if (!user) {
        // User not found or verification code is invalid
        throw new BadRequestException('', {
          cause: 'invalid password reset code',
          description: 'Invalid password reset code',
        });
      }

      // Check if the verification code has expired
      if (Time.checkIfTimeIsExpired(user.passwordResetCodeExpiresIn)) {
        throw new BadRequestException('', {
          cause: 'Code has expired',
          description: 'Please request a new verification code',
        });
      }

      // Update user verification status and clear verification code
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: user?._id },
        {
          isVerified: true,
          isActive: true,
          passwordResetCodeExpiresIn: null,
        },
        { new: true },
      );

      return updatedUser;
    }
  }

  /**
   * @method newVerificationCode
   * @description Generates a new verification code for the user.
   * @param {string} email - The email of the user to generate a new verification code for.
   * @returns {Promise<UserDocument | null>} - The user object with the new verification code or null if not found.
   * @throws {Error} - Throws an error if the code generation process fails.
   */
  async newVerificationCode(email: string): Promise<UserDocument | null> {
    const userExist = await this.checkIfUserExist({ email });

    if (!userExist) {
      throw new BadRequestException('', {
        cause: 'User not found',
        description: 'User does not exist',
      });
    }

    const otp = CodeGenerator.generateOtp();
    const verificationCodeExpiresIn = Time.getTimeInOneHour();

    const updatedUser = await this.userModel.findOneAndUpdate(
      { email },
      {
        verificationCode: otp.split('').slice(0, -1).join(''),
        verificationCodeExpiresIn,
      },
      { new: true },
    );

    await this.emailService.sendVerificationMail(
      updatedUser!.email,
      'Learn Code Account Verification',
      otp,
      updatedUser!.firstName,
    );

    return updatedUser;
  }

  /**
   * @method checkIfUserExist
   * @description Checks if a user exists in the database based on the provided query.
   * @param {object} query - The query object to search for the user.
   */
  async checkIfUserExist(query: object): Promise<UserDocument | null> {
    return this.userModel.findOne(query).select('-__v');
  }

  /**
   * @method checkUserExistById
   * @description Checks if a user exists in the database by their ID.
   * @param {string} userId - The ID of the user to check.
   * @returns {Promise<UserDocument | null>} - The user object or null if not
   */
  async checkUserExistById(userId: string): Promise<UserDocument | null> {
    return this.userModel
      .findById(userId)
      .select(
        '-passcode -verificationCode -verificationCodeExpiresIn -__v -passwordResetToken -passwordResetTokenExpiresIn',
      );
  }

  /**
   * @method findUserByVerificationCode
   * @description Finds a user by their verification code.
   * @param {string} verificationCode - The verification code to search for.
   * @returns {Promise<UserDocument | null>} - The user object or null if not found.
   * @throws {Error} - Throws an error if the search process fails.
   * @private
   */
  private async findUserByVerificationCode(
    verificationCode: string,
  ): Promise<UserDocument | null> {
    return await this.userModel.findOne({ verificationCode });
  }

  /**
   * @method updateUserPasscode
   * @description Updates the user's passcode.
   * @param {UpdatePasscodeDto} updatePasscodeDto - The data transfer object containing the new passcode and email.
   * @returns {Promise<UserDocument | null>} - The updated user object or null if not found.
   * @throws {Error} - Throws an error if the update process fails.
   */
  async updateUserPassword(
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserDocument | null> {
    const { password, passwordResetCode } = updatePasswordDto;

    const user = await this.checkIfUserExist({ passwordResetCode });

    if (!user) {
      throw new BadRequestException('', {
        cause: 'Invalid password reset code',
        description: 'Invalid password reset code',
      });
    }

    // if (
    //   user.passwordResetCodeExpiresIn &&
    //   Time.checkIfTimeIsExpired(user.passwordResetCodeExpiresIn)
    // ) {
    //   throw new BadRequestException('', {
    //     cause: 'Password reset code has expired',
    //     description: 'Please request a new password reset code',
    //   });
    // }

    // hash the password and save it to the database
    const hashedPassword = await PasscodeHashing.hashPassword(password);

    const updatedUser = await this.userModel.findOneAndUpdate(
      { passwordResetCode },
      {
        password: hashedPassword,
        passwordResetCode: null,
        passwordResetCodeExpiresIn: null,
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new BadRequestException('', {
        cause: 'Failed to update password',
        description: 'Failed to update password',
      });
    }

    await this.emailService.sendPasswordChangeSuccessMail(
      updatedUser.email,
      'Password Reset Successful',
      updatedUser.firstName,
    );

    return updatedUser;
  }

  /**
   * @method findAllUsers
   * @description Retrieves all users from the database.
   */
  async findAllUsers() {
    return this.userModel
      .find()
      .select(
        '-passcode -verificationCode -verificationCodeExpiresIn -__v, -passwordResetToken, -passwordResetTokenExpiresIn',
      )
      .exec();
  }

  /**
   * @method updateUserOnlineStatus
   * @description Updates the online status of a user.
   * @param {string} userId - The ID of the user to update.
   * @returns {Promise<UserDocument>} - The updated user object or null if not found.
   */
  async updateUserOnlineStatus(
    userId: string,
    action: string,
  ): Promise<UserDocument | null> {
    if (action === 'offline') {
      return this.userModel.findByIdAndUpdate(
        userId,
        { isOnline: false, lastSeen: new Date() },
        { new: true },
      );
    } else {
      return this.userModel.findByIdAndUpdate(
        userId,
        { isOnline: true },
        { new: true },
      );
    }
  }

  /**
   * @method getResetPasswordCode
   * @description Generates a passcode reset link for the user.
   * @param {string} email - The email address of the user.
   */
  async getResetPasswordCode(email: string) {
    const user = await this.checkIfUserExist({ email });

    /**
     * check if user exists, throw an error if user does not exist
     */
    if (!user) {
      throw new BadRequestException('', {
        cause: 'Email does not exist',
        description: 'User does not exist',
      });
    }

    const otp = CodeGenerator.generateOtp();

    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: user?.email },
      {
        passwordResetCode: otp.split('').slice(0, -1).join(''),
        passwordResetCodeExpiresIn: Time.getTimeInOneHour(),
        isVerified: false,
      },
      { new: true },
    );

    await this.emailService.sendPasswordResetMail(
      updatedUser!.email,
      'Password Reset Request',
      otp,
      updatedUser!.firstName,
    );

    return updatedUser;
  }

  /**
   * @method increaseUserUnreadMessageCount
   * @description Increases the unread message count of a user.
   * @param {string} userId - The ID of the user to update.
   * @returns {Promise<UserDocument>} - The updated user object or null if not found.
   */
  async increaseUserUnreadMessageCount(
    userId: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { unreadMessagesCount: 1 } },
      { new: true },
    );
  }

  /**
   * @method clearUserUnreadMessageCount
   * @description Updates the offline status of a user.
   * @param {string} userId - The ID of the user to update.
   * @returns {Promise<UserDocument>} - The updated user object or null if not found.
   */
  async clearUserUnreadMessageCount(
    userId: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $set: { unreadMessagesCount: 0 } },
      { new: true },
    );
  }
}
