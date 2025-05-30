import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Param,
  Delete,
  BadRequestException,
  Req,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

import { Roles } from './decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { ApiBearerAuth, ApiConsumes, ApiExtraModels } from '@nestjs/swagger';
import { CreateAuthDto } from 'src/users/dto/create-auth.dto';
import { UserDto } from './dto/user-dto';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiExtraModels(CreateUserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // login
  @Post('login')
  async login(@Body() body: CreateAuthDto, @Req() req: Request) {
    console.log(body);
    const data = await this.usersService.login(body.email, body.password);
    return {
      accessToken: data.accessToken,
      user: new UserDto(data.user, `${req.protocol}://${req.get('host')}`),
    };
  }

  // create user
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() dto: CreateUserDto, @Req() req: Request) {
    return new UserDto(
      await this.usersService.create(dto),
      `${req.protocol}://${req.get('host')}`,
    );
  }

  // upload picture
  @Post('upload/:userId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './storage',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadPicture(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: number,
    @Req() req: Request,
  ) {
    const uploadsUrl = `${req.protocol}://${req.get('host')}`;

    return new UserDto(
      await this.usersService.uploadPicture(userId, file.filename),
      uploadsUrl,
    );
    // return { filename: file.filename, path: file.path };
  }

  // get all users
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: Request) {
    const uploadsUrl = `${req.protocol}://${req.get('host')}`;
    return (await this.usersService.findAll()).map(
      (user) => new UserDto(user, uploadsUrl),
    );
  }

  // get user by id
   @Get(':id')
   @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: number, @Req() req: Request) {
    const uploadsUrl = `${req.protocol}://${req.get('host')}`;

    return new UserDto(await this.usersService.findById(id), uploadsUrl);
  }

  // delete user by id
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Req() req: Request,
    @Param('id') id: number, // Corrected the parameter name to 'id' for clarity
  ) {
    const uploadsUrl = `${req.protocol}://${req.get('host')}`;

    return new UserDto(await this.usersService.delete(id), uploadsUrl);
  }

  // delete user picture
  @Delete('picture/:userId/:filename')
  @UseGuards(JwtAuthGuard)
  async deletePicture(
    @Req() req: Request,
    @Param('userId') userId: number,
    @Param('filename') filename: string,
  ) {
    return this.usersService.deletePicture(userId, filename);
  }
   
   

   @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const uploadsUrl = `${req.protocol}://${req.get('host')}`;
    const user = await this.usersService.update(id, dto);
    return new UserDto(user, uploadsUrl);
  }
}
