import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserWrapperDto } from './dto/CreateUserDto';
import { UserResponseInterface } from './types/user.interface';
import { LoginUserDto } from './dto/LoginUserDto';
import { UserEntity } from './user.entity';
import { User } from './decorator/user.decorator';
import { AuthGuard } from './guards/auth.guards';
import { UpdateUserDto } from './dto/UpdateUserDto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateUserWrapperDto })
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const newUser = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(newUser);
  }

  @Post('/login')
  @ApiBody({ type: LoginUserDto })
  async userLogin(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Put('/')
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );
    return this.userService.buildUserResponse(user);
  }
}
