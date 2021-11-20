import { IsString } from 'class-validator';
import { UserEntity } from 'src/entities/user.entity';
import { ProfileResponse } from './user.model';

export class CreateCommentDTO {
  @IsString()
  content: string;
}

export class CommentResponse {
  id: number;

  createdAt: Date | string;
  updatedAt: Date | string;
  content: string;
  author: ProfileResponse | UserEntity;
}
