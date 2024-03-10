import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRepository } from '@database/repositories/user.repository';
import { INCORRECT_CREDENTIAL } from '@shared/constants/strings.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new BadRequestException(INCORRECT_CREDENTIAL);
    }

    const passwordMatched = await bcrypt.compare(data.password, user.password);
    if (!passwordMatched) {
      throw new BadRequestException(INCORRECT_CREDENTIAL);
    }

    return this.jwtService.sign({
      _id: user._id,
    });
  }

  async register(data: RegisterDto) {
    const user = await this.userRepository.create(data);

    return this.jwtService.sign({
      _id: user._id,
    });
  }
}
