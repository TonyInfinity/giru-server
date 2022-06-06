import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import * as slugify from 'slug';
import { UserEntity } from './user.entity';
import { classToPlain } from 'class-transformer';
import { CommentEntity } from './comment.entity';

@Entity('quests')
export class QuestEntity extends AbstractEntity {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @ManyToMany((type) => UserEntity, (user) => user.accepts)
  @JoinTable()
  acceptedBy: UserEntity[];

  //   @RelationCount((quest: QuestEntity) => quest.acceptedBy)
  //   acceptsCount: number;

  @ManyToOne((type) => UserEntity, (user) => user.quests)
  customer: UserEntity;

  @OneToMany((type) => CommentEntity, comment => comment.quest)
  comments: CommentEntity[]

  @Column('simple-array')
  tagList: string[];

  @BeforeInsert()
  generateSlug() {
    this.slug =
      slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  toJSON() {
    return classToPlain(this);
  }

  toQuest(user: UserEntity) {
    let accepted = null;
    if (user) {
      accepted = this.acceptedBy.map((user) => user.id).includes(user.id);
    }
    const quest: any = this.toJSON();
    delete quest.acceptedBy;
    return {
      ...quest,
      accepted,
    };
  }
}
