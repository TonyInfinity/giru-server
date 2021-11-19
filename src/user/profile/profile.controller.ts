import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { UserService } from '../user.service';

@Controller('profiles')
export class ProfileController {
  constructor(private userService: UserService) {}

  @Get('/:username')
  @UseGuards(new OptionalAuthGuard())
  async findProfile(
    @Param('username') username: string,
    @User() user: UserEntity,
  ) {
    const profile = await this.userService.findByUsername(username, user);
    if (!profile) throw new NotFoundException();
    return { profile };
  }

  @Post('/:username/follow')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  async followUser(
    @User() currentUser: UserEntity,
    @Param('username') username: string,
  ) {
    return this.userService.followUser(currentUser, username);
  }

  @Delete('/:username/follow')
  @UseGuards(AuthGuard())
  async unfollowUser(
    @User() currentUser: UserEntity,
    @Param('username') username: string,
  ) {
    return this.userService.unfollowUser(currentUser, username);
  }
}
