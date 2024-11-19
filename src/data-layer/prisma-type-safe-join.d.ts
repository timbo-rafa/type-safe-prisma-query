export type PrismaTypeSafeJoin<
  Table,
  JoinedField extends keyof Table,
> = Table[JoinedField] extends unknown
  ? {
      [Key in JoinedField]: Table[JoinedField];
    }
  : {};
