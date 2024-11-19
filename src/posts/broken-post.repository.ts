import { Injectable } from '@nestjs/common';
import { PrismaService } from '../data-layer/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  getUserWithPostsBroken() {
    // selecting only email from users and joining only for posts' title
    // errors out
    const result = this.prismaService.user.findFirst({
      select: {
        email: true,
      },
      include: {
        posts: {
          select: {
            title: true,
          },
        },
      },
    });
  }
}
