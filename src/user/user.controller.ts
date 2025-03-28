import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(
      createUserDto.email,
      createUserDto.password,
      createUserDto.name,
    );
  }

  @Serialize(UserDto)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(parseInt(id));
  }

  @Get()
  async findAll(@Query() query: Partial<User>) {
    return await this.userService.findAll(query);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(parseInt(id));
  }
  @Patch('/:id')
  async patch(@Param('id') id: string, @Body() attrs: UpdateUserDto) {
    return await this.userService.update(parseInt(id), attrs);
  }
}
