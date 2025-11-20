// app/lib/data.ts
// Reescrito con tipos explícitos para evitar 'data is unknown'
import { getServerSideClient } from './server-cliente';
import {
  GET_ALL_POSTS,
  SEARCH_POSTS,
  GET_ALL_POST_DATA_COMBINED,
} from './queries';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { gql } from '@apollo/client';

const client = getServerSideClient();

// Tipos auxiliares mínimos para los resultados GraphQL
type Node = any;
type PostsResult = { posts: { nodes: Node[]; pageInfo?: { endCursor?: string | null; hasNextPage?: boolean } } };
type AllPostsCombinedResult = { posts: { nodes: Node[] } };
type SearchPostsResult = { posts: { nodes: Node[] } };

// There's no direct equivalent for Revenue in the GraphQL schema.
// Returning an empty array to avoid breaking components that use this.
export async function fetchRevenue(): Promise<Revenue[]> {
  console.log('Fetching revenue data (mocked)...');
  return [];
}

// Fetches the latest 5 posts and adapts them to the shape needed by the UI components.
export async function fetchLatestInvoices(): Promise<any[]> {
  try {
    const { data } = await client.query<PostsResult>({
      query: GET_ALL_POSTS,
      variables: { first: 5, after: null },
    });

    const nodes = data?.posts?.nodes ?? [];

    const latestPosts = nodes.map((post: any) => ({
      id: post.databaseId,
      title: post.title,
      imagenUrl: post.featuredImage?.node?.sourceUrl || '/img/placeholder.png',
      fecha: post.date,
      slug: post.slug,
    }));

    return latestPosts;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw new Error('Failed to fetch the latest posts.');
  }
}

// Fetches card data using post counts as a stand-in for invoice/customer counts.
export async function fetchCardData() {
  try {
    const { data } = await client.query<AllPostsCombinedResult>({
      query: GET_ALL_POST_DATA_COMBINED,
      variables: { first: 1, after: null },
    });

    // GET_ALL_POST_DATA_COMBINED returns posts -> nodes (no allPosts property)
    const numberOfInvoices = data?.posts?.nodes?.length ?? 0;
    const numberOfCustomers = 0; // No customer concept in GraphQL schema
    const totalPaidInvoices = formatCurrency(0); // Placeholder
    const totalPendingInvoices = formatCurrency(0); // Placeholder

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;

// Fetches posts based on a search query or gets a paginated list of all posts.
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
): Promise<InvoicesTable[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    let posts: any[] = [];
    if (query) {
      const { data } = await client.query<SearchPostsResult>({
        query: SEARCH_POSTS,
        variables: { search: query },
      });
      posts = data?.posts?.nodes ?? [];
    } else {
      const { data } = await client.query<PostsResult>({
        query: GET_ALL_POSTS,
        variables: { first: 1000, after: null },
      });
      posts = (data?.posts?.nodes ?? []).slice(offset, offset + ITEMS_PER_PAGE);
    }

    // Adapt the post data to the InvoicesTable shape (agregamos customer_id requerido)
    return posts.map((post: any): InvoicesTable => ({
      id: post.databaseId?.toString() ?? '',
      customer_id: '1', // placeholder: ajustá si podés obtener un customer real del post
      amount: 10000, // Placeholder
      date: post.date,
      status: 'paid', // Placeholder
      name: post.title,
      email: post.slug,
      image_url: post.featuredImage?.node?.sourceUrl || '/img/placeholder.png',
    }));
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw new Error('Failed to fetch invoices/posts.');
  }
}

// Calculates the total number of pages for posts.
export async function fetchInvoicesPages(query: string): Promise<number> {
  try {
     let totalPosts = 0;
     if (query) {
       const { data } = await client.query<SearchPostsResult>({
         query: SEARCH_POSTS,
         variables: { search: query },
       });
       totalPosts = data?.posts?.nodes?.length ?? 0;
     } else {
       const { data } = await client.query<AllPostsCombinedResult>({
         query: GET_ALL_POST_DATA_COMBINED,
         variables: { first: 1, after: null },
       });
       totalPosts = data?.posts?.nodes?.length ?? 0;
     }

    return Math.ceil(totalPosts / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw new Error('Failed to fetch total number of pages for posts.');
  }
}

// Fetches a single post by its database ID.
export async function fetchInvoiceById(id: string): Promise<InvoiceForm | undefined> {
  const GET_POST_BY_ID = gql`
    query GetPostById($id: ID!) {
      post(id: $id, idType: DATABASE_ID) {
        databaseId
        title
        excerpt
      }
    }
  `;

  try {
    const { data } = await client.query<{ post?: { databaseId?: number } }>({
      query: GET_POST_BY_ID,
      variables: { id },
    });

    if (!data?.post) {
      return undefined;
    }

    const dbId = data.post.databaseId;

    return {
      // Convertimos a string de forma segura
      id: dbId !== undefined && dbId !== null ? String(dbId) : '',
      customer_id: '1', // Placeholder (ajustá si tenés un valor real)
      amount: 100, // Placeholder
      status: 'pending', // Placeholder
    };
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw new Error('Failed to fetch invoice/post.');
  }
}

// No customer concept in the GraphQL schema.
export async function fetchCustomers(): Promise<CustomerField[]> {
  console.log('Fetching customers (mocked)...');
  return [];
}

// No customer concept in the GraphQL schema.
export async function fetchFilteredCustomers(query: string): Promise<CustomersTableType[]> {
    console.log('Fetching filtered customers (mocked)...');
    return [];
}
