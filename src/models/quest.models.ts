import { IsArray, IsOptional, IsString } from 'class-validator';
import { ProfileResponse } from './user.model';

export class CreateQuestDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  tagList: string[];
}

export class UpdateQuestDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagList: string[];
}

export interface FindFeedQuery {
  limit?: number;
  offset?: number;
}

export interface FindAllQuery extends FindFeedQuery {
  tag?: string;
  customer?: string;
  accepted?: string;
}

export interface QuestResponse {
  slug: string;
  title: string;
  description: string;
  content: string;
  tagList: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  accepted: boolean | null;
  // acceptsCount
  customer: ProfileResponse;
}
