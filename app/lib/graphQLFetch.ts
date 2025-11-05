// lib/graphQLFetch.ts
import { getClient } from './cliente';
import { DocumentNode } from '@apollo/client';

type GraphQLFetchOptions = {
  query: DocumentNode;
  variables?: { [key: string]: any };
  revalidate?: number; // Revalidation time in seconds for Next.js fetch
};

export async function graphQLFetch<T>({
  query,
  variables,
  revalidate,
}: GraphQLFetchOptions): Promise<T> {
  try {
    const client = getClient();
    const { data } = await client.query<T>({
      query,
      variables,
      context: {
        fetchOptions: {
          next: { revalidate },
        },
      },
    });
    return data;
  } catch (error) {
    console.error('GraphQL Fetch Error:', error);
    // In a real-world app, you might want to handle this more gracefully
    throw new Error('Failed to fetch data from GraphQL endpoint.');
  }
}
