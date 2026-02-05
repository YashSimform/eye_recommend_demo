
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SWAGGER_TAGS } from 'src/common/constants';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, CreateUserResponseDto } from './dtos';
import { Public } from 'src/core/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

   @ApiTags(SWAGGER_TAGS.USER)
  @ApiOperation({
    summary: 'Create new user  API',
    description: 'This API is used to register a new user',
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: CreateUserResponseDto,
  })
  @Public()
  @Post('/create-user')
  createUser(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }
}
