import { Module } from '@nestjs/common';
import { QuestService } from './quest.service';
import { QuestController } from './quest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestEntity } from 'src/entities/quest.entity';
import { UserEntity } from 'src/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsService } from './comments.service';
import { CommentEntity } from 'src/entities/comment.entity';
import { TagEntity } from 'src/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestEntity,
      UserEntity,
      CommentEntity,
      TagEntity,
    ]),
    AuthModule,
  ],
  providers: [QuestService, CommentsService],
  controllers: [QuestController],
})
export class QuestModule {}
