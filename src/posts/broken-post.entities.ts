import { Prisma } from '@prisma/client';

const userWithPostsEntity = Prisma.validator<Prisma.UserFindManyArgs>()({
  include: { posts: { select: { id: true, title: true } } },
  select: { id: true, email: true },
});
type UserWithPostTitle = Prisma.UserGetPayload<typeof userWithPostsEntity>;

const userEmailWithPostTile: UserWithPostTitle = {
  id: 1,
  email: 'example@example.com',
  name: 'Rafael',
  posts: [{ id: 1, title: 'My First Title' }],
};
// allowing user.name ❌ (which was not selected above)
userEmailWithPostTile.name;
