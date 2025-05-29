import {
  Controller,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  Param,
  UseInterceptors,
  Req,
  Get,
} from '@nestjs/common';
import { CreateAuthDto } from './users/dto/create-auth.dto';
import { JwtAuthGuard } from './users/guards/jwt.guard';
import { RolesGuard } from './users/guards/roles.guard';
import { Roles } from './users/decorators/roles.decorator';
import { CreateUserDto } from './users/dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Import the missing services
import { UsersService } from './users/users.service';
import { VotesService } from './votes/votes.service';

@Controller('app')
@ApiTags('api')
export class AuthController {
  constructor(
    private readonly usersService: UsersService, // Added
    private readonly votesService: VotesService, // Added
  ) {}

//   // login
//   @Post('login')
//   async login(@Body() body: CreateAuthDto) {
//     console.log(body);
//     const user = await this.authService.validateUser(body.email, body.password);
//     return this.authService.login(user);
//   }

//   // create user
//   @Post()
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin')
//   async create(@Body() dto: CreateUserDto) {
//     return this.usersService.create(dto);
//   }

//   // Upload image
//   @Post('upload-picture/:userId')
//   @UseGuards(JwtAuthGuard)
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: './uploads',
//         filename: (req, file, cb) => {
//           const uniqueSuffix =
//             Date.now() + '-' + Math.round(Math.random() * 1e9);
//           cb(null, uniqueSuffix + extname(file.originalname));
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
//           return cb(new Error('Only image files are allowed!'), false);
//         }
//         cb(null, true);
//       },
//     }),
//   )
//   async uploadPicture(
//     @UploadedFile() file: Express.Multer.File,
//     @Param('userId') userId: number,
//   ) {
//     return this.usersService.uploadPicture(userId, file.filename);
//   }

//   // Get all users
//   @Get()
//   @ApiBearerAuth()
//   @UseGuards(JwtAuthGuard)
//   async findAllUsers() {
//     return this.usersService.findAll();
//   }

//   // vote
//   @Post('vote')
//   async vote(
//     @Req() req,
//     @Body() body: { recipientId: number; points: number },
//   ) {
//     return this.votesService.castVote(
//       req.user.userId,
//       body.recipientId,
//       body.points,
//     );
//   }

//   // get all votes
//   @Get('votes')
//   async findAllVotes() {
//     return this.votesService.findAll();
//   }
}
