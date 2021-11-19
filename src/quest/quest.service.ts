import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestEntity } from 'src/entities/quest.entity';
import { UserEntity } from 'src/entities/user.entity';
import {
  CreateQuestDTO,
  FindAllQuery,
  FindFeedQuery,
  UpdateQuestDTO,
} from 'src/models/quest.model';
import { Like, Repository } from 'typeorm';

@Injectable()
export class QuestService {
  constructor(
    @InjectRepository(QuestEntity) private questRepo: Repository<QuestEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  findBySlug(slug: string) {
    return this.questRepo.findOne({ where: { slug } });
  }

  private ensureOwnership(user: UserEntity, quest: QuestEntity): boolean {
    return quest.customer.id === user.id;
  }

  async findAll(user: UserEntity, query: FindAllQuery) {
    let findOptions: any = {
      where: {},
    };

    if (query.customer) {
      findOptions.where['customer.username'] = query.customer;
    }

    if (query.accepted) {
      findOptions.where['acceptedBy.username'] = query.accepted;
    }

    if (query.tag) {
      findOptions.where.tagList = Like(`%${query.tag}%`);
    }

    if (query.limit) {
      findOptions.limit = query.limit;
    }

    if (query.offset) {
      findOptions.offset = query.offset;
    }

    return (await this.questRepo.find(findOptions)).map((quest) =>
      quest.toQuest(user),
    );
  }

  async findFeed(user: UserEntity, query: FindFeedQuery) {
    const { followee } = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['followee'],
    });
    const findOptions = {
      ...query,
      where: followee.map((follow) => ({ customer: follow.id })),
    };
    return (await this.questRepo.find(findOptions)).map((quest) =>
      quest.toQuest(user),
    );
  }

  async createQuest(user: UserEntity, data: CreateQuestDTO) {
    const quest = this.questRepo.create(data);
    quest.customer = user;
    const { slug } = await quest.save();
    return (await this.questRepo.findOne({ slug })).toQuest(user);
  }

  async updateQuest(slug: string, user: UserEntity, data: UpdateQuestDTO) {
    const quest = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, quest)) {
      throw new UnauthorizedException();
    }
    await this.questRepo.update({ slug }, data);
    return quest.toQuest(user);
  }

  async deleteQuest(slug: string, user: UserEntity) {
    const quest = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, quest)) {
      throw new UnauthorizedException();
    }
    await this.questRepo.remove(quest);
  }

  async acceptQuest(slug: string, user: UserEntity) {
    const quest = await this.findBySlug(slug);
    quest.acceptedBy.push(user);
    await quest.save();
    return (await this.findBySlug(slug)).toQuest(user);
  }

  async unacceptQuest(slug: string, user: UserEntity) {
    const quest = await this.findBySlug(slug);
    quest.acceptedBy = quest.acceptedBy.filter(
      (accepted) => accepted.id !== user.id,
    );
    await quest.save();
    return quest.toQuest(user).toQuest(user);
  }
}
