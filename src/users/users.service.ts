import {
  ConflictException,
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
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(data: CreateUserDto) {
    // Generate 5 random numbers
    const randomNumbers = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 1000000),
    )
      .join('')

      .slice(0, 6); // Ensure it's 6 digits long

    console.log('Random numbers:', randomNumbers);

    const plainPassword = data.password ? data.password : randomNumbers;
    //     randomBytes(8)
    //   .toString('base64')
    //   .replace(/[^0-9]/g, '')
    //   .slice(0, 6);

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const user = this.repo.create({
      ...data,
      passwordHash,
      plainPassword,
    });

    if (await this.repo.exists({ where: { email: user.email } })) {
      throw new ConflictException('User with this email already exists');
    }

    return this.repo.save(user);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number) {
    console.log('Finding user by ID:', id);
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async findAll() {
    const users = await this.repo.find();
    // Randomize the order of users
    const shuffled = users.sort(() => Math.random() - 0.5);
    return shuffled;
  }

  async uploadPicture(userId: number, filename: string) {
    const user = await this.findById(userId);

    if (user.pictures) {
      user.pictures.push(filename);
    } else {
      user.pictures = [filename];
    }
    return this.repo.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.findByEmail(email);

    console.log(user);

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return {
        user,
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

    // delete child entities if any

    return this.repo.remove(user);
  }

  async deletePicture(userId: number, filename: string) {
    const user = await this.findById(userId);

    user.pictures = user.pictures?.filter((pic) => pic !== filename);
    return this.repo.save(user);
  }

  async update(id: number, data: UpdateUserDto) {
    console.log(data);
    const user = await this.repo.preload({
      id,
      ...data,
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    //  const randomNumbers = Array.from({ length: 5 }, () =>
    //    Math.floor(Math.random() * 1000000),
    //  )
    //    .join('')

    //    .slice(0, 6); // Ensure it's 6 digits long

    if (data.password) {
      const plainPassword = data.password;

      const passwordHash = await bcrypt.hash(plainPassword, 10);
      user.plainPassword = plainPassword;
      user.passwordHash = passwordHash;
    }

    return this.repo.save(user);
  }

  async addDescription(userId: number, description: string) {
    const user = await this.findById(userId);
    user.description = description ?? user.description;

    return this.repo.save(user);
  }
}
