import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  // 生成 slug 的辅助函数
  private generateSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50) +
      '-' +
      Date.now().toString(36)
    );
  }

  async create(createPostDto: CreatePostDto) {
    // 确保有作者 - 如果没有提供，查找或创建默认作者
    let authorId = createPostDto.authorId;
    if (!authorId) {
      const defaultUser = await this.prisma.user.findFirst();
      if (!defaultUser) {
        // 创建一个默认用户
        const newUser = await this.prisma.user.create({
          data: {
            email: 'admin@example.com',
            username: 'admin',
            password: 'admin123', // 注意：实际应用中应该加密
            nickname: 'Admin',
            role: 'admin',
          },
        });
        authorId = newUser.id;
      } else {
        authorId = defaultUser.id;
      }
    }

    // 生成 slug
    const slug = createPostDto.slug || this.generateSlug(createPostDto.title);

    return this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        slug,
        summary: createPostDto.summary,
        cover: createPostDto.cover,
        published: createPostDto.published ?? false,
        authorId,
        categoryId: createPostDto.categoryId,
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: {
        author: true,
        category: true,
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    // 增加阅读量
    await this.prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    // 确保文章存在
    await this.findOne(id);

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });
  }

  async remove(id: number) {
    // 确保文章存在
    await this.findOne(id);

    return this.prisma.post.delete({
      where: { id },
    });
  }
}
