import { Prisma } from '@prisma/client';

const userEntity = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: { id: true, email: true },
});
type User = Prisma.UserGetPayload<typeof userEntity>;

const postEntity = Prisma.validator<Prisma.PostDefaultArgs>()({
  select: { id: true, title: true },
});
type Post = Prisma.PostGetPayload<typeof postEntity>;

// "posts" field name is not type-safe here (with prisma schema),
// meaning that if we migrate that field to say "userPosts", this type will not warn us of the change.
type UnsafeUserEmailWithPostTile = User & {
  posts: Post[];
};

const userPostEntity = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { posts: { select: { id: true, title: true } } },
});
type UserPost = Prisma.UserGetPayload<typeof userPostEntity>;

// we therefore check if UserPost['posts'] exists before merging
type UserEmailWithPostTile = User &
  (UserPost['posts'] extends unknown
    ? {
        posts: Post[];
      }
    : {});

const userEmailWithPostTile: UserEmailWithPostTile = {
  id: 1,
  email: 'example@example.com',
  posts: [{ id: 1, title: 'My First Title' }],
};
// not allowing "name" ✅
userEmailWithPostTile.name;
// not allowing "published" ✅
userEmailWithPostTile.posts[0].published;
