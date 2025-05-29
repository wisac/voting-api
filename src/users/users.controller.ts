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

@Controller('users')
@ApiExtraModels(CreateUserDto)
export class UsersController {
   constructor(private readonly usersService: UsersService) { }

   // login
   @Post('login')
   async login(@Body() body: CreateAuthDto) {
      console.log(body);
      return this.usersService.login(body.email, body.password);
   }

   
   // create user
   @Post()
   // @UseGuards(JwtAuthGuard, RolesGuard)
   // @Roles('admin')
   async create(@Body() dto: CreateUserDto) {
      return this.usersService.create(dto);
   }


   // upload picture
   @Post('upload/:userId')
   @UseGuards(JwtAuthGuard)
   @UseInterceptors(
      FileInterceptor('file', {
         storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
               const uniqueSuffix =
                  Date.now() + '-' + Math.round(Math.random() * 1e9);
               cb(null, uniqueSuffix + extname(file.originalname));
            },
         }),
         fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
               return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
         },
      }),
   )
   async uploadPicture(
      @UploadedFile() file: Express.Multer.File,
      @Param('userId') userId: number,
   ) {
      return this.usersService.uploadPicture(userId, file.filename);
      // return { filename: file.filename, path: file.path };
   }

   
   // get all users
   @Get()
   @ApiBearerAuth()
   @UseGuards(JwtAuthGuard)
   async findAll() {
      return this.usersService.findAll();
   }
   

   // get user by id
   @Get(':id')
   async findById(@Param('id') id: number) {
      return this.usersService.findById(id);
   }


   // delete user by id
   @Delete(':id')
   async delete(
      @Param('id') id: number, // Corrected the parameter name to 'id' for clarity
   ) {
      return this.usersService.delete(id);
   }
}
