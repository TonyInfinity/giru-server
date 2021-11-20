import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateCommentDTO, CommentResponse } from 'src/models/comment.models';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
  ) {}

  findByQuestSlug(slug: string): Promise<CommentResponse[]> {
    return this.commentRepo.find({
      where: { 'quest.slug': slug },
      relations: ['quest'],
    });
  }

  findById(id: number): Promise<CommentResponse> {
    return this.commentRepo.findOne({ where: { id } });
  }

  async createComment(user: UserEntity, data: CreateCommentDTO): Promise<CommentResponse> {
    const comment = this.commentRepo.create(data);
    comment.author = user;
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
