import { classToPlain } from 'class-transformer';
import { CommentResponse } from 'src/models/comment.models';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import { QuestEntity } from './quest.entity';
import { UserEntity } from './user.entity';

@Entity('comments')
export class CommentEntity extends AbstractEntity {
  @Column()
  content: string;

  @ManyToOne((type) => UserEntity, (user) => user.comments)
  author: UserEntity;

  @ManyToOne((type) => QuestEntity, (quest) => quest.comments)
  quest: QuestEntity;

  toJSON() {
    return <CommentResponse>classToPlain(this);
  }
}
