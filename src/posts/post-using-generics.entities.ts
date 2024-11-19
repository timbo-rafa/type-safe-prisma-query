import { Prisma } from '@prisma/client';
import { PrismaTypeSafeJoin } from 'src/data-layer/prisma-type-safe-join';

const userEntity = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: { id: true, email: true },
});
type User = Prisma.UserGetPayload<typeof userEntity>;

const userPostEntity = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { posts: { select: { id: true, title: true } } },
});
type UserPost = Prisma.UserGetPayload<typeof userPostEntity>;

export type UserEmailWithPostTile = User &
  PrismaTypeSafeJoin<UserPost, 'posts'>;

const userEmailWithPostTile: UserEmailWithPostTile = {
  id: 1,
  email: 'example@example.com',
  posts: [{ id: 1, title: 'My First Title' }],
};
// not allowing "name" ✅ (which was not selected)
userEmailWithPostTile.name;
// not allowing "published" ✅ (which was not selected)
userEmailWithPostTile.posts[0].published;

// only allows us to define typescript fields defined on schema.prisma ✅
const invalidField: User & PrismaTypeSafeJoin<UserPost, 'posts'> = {
  id: 1,
  email: 'example@example.com',
  invalid: [{ id: 1, title: 'My First Title' }],
};

// warns us of schema.prisma field migrations ✅
const schemaDrift: User & PrismaTypeSafeJoin<UserPost, 'migratedPosts'> = {
  id: 1,
  email: 'example@example.com',
  posts: [{ id: 1, title: 'My First Title' }],
};
