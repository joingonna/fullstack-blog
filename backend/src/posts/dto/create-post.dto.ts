import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(1, { message: '标题不能为空' })
  title: string;

  @IsString()
  @MinLength(1, { message: '内容不能为空' })
  content: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  cover?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsNumber()
  authorId?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
