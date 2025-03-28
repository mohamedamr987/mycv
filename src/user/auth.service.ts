import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signUp(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.userService.findAll({ email: createUserDto.email });
    if (user.length > 0) {
      throw new BadRequestException('Email already exists');
    }
    // hash the password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    // create a new user
    return await this.userService.create(
      createUserDto.email,
      result,
      createUserDto.name,
    );
  }

  async signIn(email: string, password: string): Promise<UserDto> {
    const [user] = await this.userService.findAll({ email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}
