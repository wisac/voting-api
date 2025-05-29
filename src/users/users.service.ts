import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { randomBytes } from 'crypto';
import { NotFoundError } from 'rxjs';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(data: CreateUserDto) {
    const plainPassword = '1234';
    //      randomBytes(8)
    //   .toString('base64')
    //   .replace(/[^a-z]/g, '')
    //   .slice(0, 6);

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const user = this.repo.create({
      ...data,
      passwordHash,
      plainPassword,
    });
    return this.repo.save(user);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  findAll() {
    return this.repo.find();
  }

  async uploadPicture(userId: number, filename: string) {
    const user = await this.findById(userId);

     if (user.pictures) {
        user.pictures.push(filename);
     }
      else {
         user.pictures = [filename];
      }
    return this.repo.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.findByEmail(email);

    console.log(user);

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return {
        accessToken: this.jwtService.sign({ sub: user.id, role: user.role }),
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async delete(id: number) {
      const user = await this.findById(id);
      if (!user) {
         throw new NotFoundException('User not found');
      }
      return this.repo.remove(user);
  }
}
