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
import { CreateCommentDTO, CommentResponse } from 'src/models/comment.models';
import {
  CreateQuestDTO,
  FindAllQuery,
  FindFeedQuery,
  QuestResponse,
  UpdateQuestDTO,
} from 'src/models/quest.models';
import { ResponseObject } from 'src/models/response.model';
import { CommentsService } from './comments.service';
import { QuestService } from './quest.service';

@Controller('quests')
export class QuestController {
  constructor(
    private questService: QuestService,
    private commentService: CommentsService,
  ) {}

  @Get()
  @UseGuards(new OptionalAuthGuard())
  async findAll(
    @User() user: UserEntity,
    @Query() query: FindAllQuery,
  ): Promise<
    ResponseObject<'quests', QuestResponse[]> &
      ResponseObject<'questsCount', number>
  > {
    const quests = await this.questService.findAll(user, query);
    return { quests, questsCount: quests.length };
  }

  @Get('/feed')
  @UseGuards(AuthGuard())
  async findFeed(
    @User() user: UserEntity,
    @Query() query: FindFeedQuery,
  ): Promise<
    ResponseObject<'quests', QuestResponse[]> &
      ResponseObject<'questsCount', number>
  > {
    const quests = await this.questService.findFeed(user, query);
    return { quests, questsCount: quests.length };
  }

  @Get('/:slug')
  @UseGuards(new OptionalAuthGuard())
  async findBySlug(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'quest', QuestResponse>> {
    const quest = await this.questService.findBySlug(slug);
    return { quest: quest.toQuest(user) };
  }

  @Post()
  @UseGuards(AuthGuard())
  async createQuest(
    @User() user: UserEntity,
    @Body('quest', ValidationPipe) data: CreateQuestDTO,
  ): Promise<ResponseObject<'quest', QuestResponse>> {
    const quest = await this.questService.createQuest(user, data);
    return { quest };
  }

  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateQuest(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body('quest', ValidationPipe) data: UpdateQuestDTO,
  ): Promise<ResponseObject<'quest', QuestResponse>> {
    const quest = await this.questService.updateQuest(slug, user, data);
    return { quest };
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deleteQuest(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'quest', QuestResponse>> {
    const quest = await this.questService.deleteQuest(slug, user);
    return { quest };
  }

  @Get('/:slug/comments')
  async findComments(
    @Param('slug') slug: string,
  ): Promise<ResponseObject<'comments', CommentResponse[]>> {
    const comments = await this.commentService.findByQuestSlug(slug);
    return { comments };
  }

  @Post('/:slug/comments')
  @UseGuards(AuthGuard())
  async createComment(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body('comment', ValidationPipe) data: CreateCommentDTO,
  ): Promise<ResponseObject<'comment', CommentResponse>> {
    const comment = await this.commentService.createComment(user, data, slug);
    return { comment };
  }

  @Delete('/:slug/comments/:id')
  async deleteComment(
    @Param('id') id: number,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'comment', CommentResponse>> {
    const comment = await this.commentService.deleteComment(user, id);
    return { comment };
  }

  @Post('/:slug/accept')
  @UseGuards(AuthGuard())
  async acceptQuest(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'quest', QuestResponse>> {
    const quest = await this.questService.acceptQuest(slug, user);
    return { quest };
  }

  @Delete('/:slug/accept')
  @UseGuards(AuthGuard())
  async unacceptQuest(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'quest', QuestResponse>> {
    const quest = await this.questService.unacceptQuest(slug, user);
    return { quest };
  }
}
