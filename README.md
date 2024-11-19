# Problem Statement

ORMs often struggle to enforce type-safety to queries with partial data and joins.
This repository contains a small code sample on how to achieve that with Prisma ORM.

On our [repository example](/src/posts/broken-post.repository.ts),
we try to select only the email field from the user table, along only with their posts' title. Prisma currently does not allow us to do that and errors out:

<img src="/screenshots/prisma-query-error.png">

Similarly, if we try Prisma validators as suggested on the post [Operating against partial structures](https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types), prisma seems to join with the User table twice, one correctly hiding the "name" field, but the second joins the complete table incorrectly:

<img src="/screenshots/prisma-wrong-join.png">

# Solution

In order to solve these problematic joins, we can generate one type per table and merge them in Typescript, as shown in [post.entities.ts](/src/posts/post.entities.ts).

Since we will do that multiple times across different features, we can extract this type logic into a generic for reusability as is in [posts-using-generics.entities.ts](/src/posts/post-using-generics.entities.ts)

It's correctness can be seen by type errors as below:

<img src="/screenshots/prisma-partial-types.png">

We can then use this type on query results returned by prisma.
However, since the typed query does not allow `select` and `include`, we may need to resort to [prisma.$queryRaw](https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries#queryraw),
in which case the raw sql will **not** be type-safe. You may want to consider tools like [SafeQL](https://safeql.dev/compatibility/prisma.html),
or migrating to Prisma 5.19.0+, so you can use Prisma's [TypedSQL](https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/typedsql)
(in preview at time of writing)

# Try it yourself

After cloning repository:

```bash
npm install
prisma generate
```

Then go to [posts-using-generics.entities.ts](/src/posts/post-using-generics.entities.ts) to see the type errors in your editor
