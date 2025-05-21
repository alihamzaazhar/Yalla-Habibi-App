export const queryKeysFactory = <
  T,
  TListQueryType = any,
  TDetailQueryType = string
>(
  globalKey: T
) => {
  const queryKeyFactory = {
    all: [globalKey] as const,
    lists: () => [...queryKeyFactory.all, "list"] as const,
    list: (query?: TListQueryType) => [...queryKeyFactory.lists(), { query }] as const,
    details: () => [...queryKeyFactory.all, "detail"] as const,
    detail: (id: TDetailQueryType) => [...queryKeyFactory.details(), id] as const,
  };
  return queryKeyFactory;
};
