import { classToPlain, Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import * as bcrypt from 'bcrypt';
import { QuestEntity } from './quest.entity';
import { type } from 'os';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column()
  @IsEmail()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  @Column()
  @Exclude()
  password: string;

  @ManyToMany((type) => UserEntity, (user) => user.followee)
  @JoinTable()
  followers: UserEntity[];

  @ManyToMany((type) => UserEntity, (user) => user.followers)
  followee: UserEntity[];

  @OneToMany((type) => QuestEntity, (quest) => quest.customer)
  quests: QuestEntity[];

  @ManyToMany((type) => QuestEntity, quest => quest.acceptedBy)
  @JoinColumn()
  accepts: QuestEntity[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attemp: string) {
    return await bcrypt.compare(attemp, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }

  toProfile(user?: UserEntity) {
    let following = null;
    if (user) {
      following = this.followers.includes(user);
    }
    const profile: any = this.toJSON();
    delete profile.followers;
    return {
      ...profile,
      following,
    };
  }
}
