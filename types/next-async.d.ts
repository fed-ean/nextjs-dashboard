// types/next-async.d.ts

export type AsyncParams<T extends Record<string, any>> = Promise<T>;

export type AsyncSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;
