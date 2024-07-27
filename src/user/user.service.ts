import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/user.interface';
import { LoginUserDto } from './dto/LoginUserDto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  generatedToken(user: UserEntity): string {
    console.log({ user });
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_TOKEN,
    );
  }

  async findById(id: number | any): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async updateUser(
    currentUserId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      id: currentUserId,
    });
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generatedToken(user),
      },
    };
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }
    delete user.password;
    return user;
  }
}
