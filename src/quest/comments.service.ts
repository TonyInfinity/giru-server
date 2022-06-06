import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { QuestEntity } from 'src/entities/quest.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateCommentDTO, CommentResponse } from 'src/models/comment.models';
import { Repository } from 'typeorm';
import { QuestService } from './quest.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
    private questService: QuestService,
  ) {}

  async findByQuestSlug(slug: string): Promise<CommentResponse[]> {
    const quest = await this.questService.findBySlug(slug);

    // const comments = await this.commentRepo.find({
    //   where: { 'quest.id': quest.id },
    //   relations: ['quest'],
    // });
    const comments = await this.commentRepo.find({
      select: ["id", "content"],
      relations: ['quest'],

    });
    return comments;
  }

  findById(id: number): Promise<CommentResponse> {
    return this.commentRepo.findOne({ where: { id } });
  }

  async createComment(
    user: UserEntity,
    data: CreateCommentDTO,
    slug: string,
  ): Promise<CommentResponse> {
    const quest = await this.questService.findBySlug(slug);
    const comment = this.commentRepo.create(data);
    comment.author = user;
    comment.quest = quest;
    await comment.save();
    return this.commentRepo.findOne({ where: { content: data.content } });
  }

  async deleteComment(user: UserEntity, id: number): Promise<CommentResponse> {
    const comment = await this.commentRepo.findOne({
      where: { id, 'author.id': user.id },
    });
    await comment.remove();
    return comment;
  }
}
