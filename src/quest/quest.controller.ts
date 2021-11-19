import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import {
  CreateQuestDTO,
  FindAllQuery,
  FindFeedQuery,
  UpdateQuestDTO,
} from 'src/models/quest.model';
import { QuestService } from './quest.service';

@Controller('quests')
export class QuestController {
  constructor(private questService: QuestService) {}

  @Get()
  @UseGuards(new OptionalAuthGuard())
  async findAll(@User() user: UserEntity, @Query() query: FindAllQuery) {
    const quests = await this.questService.findAll(user, query);
    return { quests, questsCount: quests.length };
  }

  @Get('/feed')
  @UseGuards(AuthGuard())
  async findFeed(@User() user: UserEntity, @Query() query: FindFeedQuery) {
    const quests = await this.questService.findFeed(user, query);
    return { quests, questsCount: quests.length };
  }

  @Get('/:slug')
  @UseGuards(new OptionalAuthGuard())
  async findBySlug(@Param('slug') slug: string, @User() user: UserEntity) {
    const quest = await this.questService.findBySlug(slug);
    return { quest: quest.toQuest(user) };
  }

  @Post()
  @UseGuards(AuthGuard())
  async createQuest(
    @User() user: UserEntity,
    @Body(ValidationPipe) data: { quest: CreateQuestDTO },
  ) {
    const quest = await this.questService.createQuest(user, data.quest);
    return { quest };
  }

  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateQuest(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body(ValidationPipe) data: { quest: UpdateQuestDTO },
  ) {
    const quest = await this.questService.updateQuest(slug, user, data.quest);
    return { quest };
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deleteQuest(@Param('slug') slug: string, @User() user: UserEntity) {
    const quest = await this.questService.deleteQuest(slug, user);
    return { quest };
  }

  @Post('/:slug/accept')
  @UseGuards(AuthGuard())
  async acceptQuest(@Param('slug') slug: string, @User() user: UserEntity) {
    const quest = await this.questService.acceptQuest(slug, user);
    return { quest }
  }

  @Delete('/:slug/accept')
  @UseGuards(AuthGuard())
  async unacceptQuest(@Param('slug') slug: string, @User() user: UserEntity) {
    const quest = await this.questService.unacceptQuest(slug, user);
    return { quest };
  }
}
