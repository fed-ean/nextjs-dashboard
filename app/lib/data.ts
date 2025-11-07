// app/lib/data.ts
import { getClient } from './cliente';
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

// Helper function to get the Apollo client
const client = getClient();

// There's no direct equivalent for Revenue in the GraphQL schema.
// Returning an empty array to avoid breaking components that use this.
export async function fetchRevenue(): Promise<Revenue[]> {
  console.log('Fetching revenue data (mocked)...');
  return [];
}

// Fetches the latest 5 posts and adapts them to the LatestInvoiceRaw shape.
export async function fetchLatestInvoices(): Promise<any[]> { // Using any for now as the shape is different
  try {
    const { data } = await client.query({
      query: GET_ALL_POSTS,
      variables: { first: 5, after: null },
    });

    const latestPosts = data.posts.nodes.map((post: any) => ({
      id: post.databaseId,
      name: post.categories.nodes.length > 0 ? post.categories.nodes[0].name : 'Uncategorized', // Placeholder for customer name
      image_url: post.featuredImage?.node?.sourceUrl || '/user.svg', // Placeholder for customer image
      email: post.slug, // Placeholder for customer email
      amount: formatCurrency(10000), // Placeholder amount, GraphQL schema doesn't have it
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
    const { data } = await client.query({
      query: GET_ALL_POST_DATA_COMBINED,
      variables: { first: 1, after: null }, // We only need the count, so fetch 1
    });

    const numberOfInvoices = data.allPosts.nodes.length;
    const numberOfCustomers = 0; // No customer concept in GraphQL schema
    const totalPaidInvoices = formatCurrency(0); // No invoice status in GraphQL schema
    const totalPendingInvoices = formatCurrency(0); // No invoice status in GraphQL schema

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
      // Search functionality - Note: WPGraphQL search doesn't support pagination out of the box.
      const { data } = await client.query({
        query: SEARCH_POSTS,
        variables: { search: query },
      });
      posts = data.posts.nodes;
    } else {
      // Pagination functionality for all posts
       const { data } = await client.query({
        query: GET_ALL_POSTS,
        // The WPGraphQL OffsetPagination is not standard. After/first is used for cursor-based pagination.
        // We will fetch all and slice, which is inefficient but works without offset pagination.
        // A better approach would be to implement proper cursor-based pagination in the UI.
        variables: { first: 1000, after: null }, // Fetch a large number and manually paginate
      });
      posts = data.posts.nodes.slice(offset, offset + ITEMS_PER_PAGE);
    }

    // Adapt the post data to the InvoicesTable shape
    return posts.map((post: any) => ({
      id: post.databaseId.toString(),
      amount: 10000, // Placeholder
      date: post.date,
      status: 'paid', // Placeholder
      name: post.title,
      email: post.slug,
      image_url: post.featuredImage?.node?.sourceUrl || '/user.svg',
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
       const { data } = await client.query({
         query: SEARCH_POSTS,
         variables: { search: query },
       });
       totalPosts = data.posts.nodes.length;
     } else {
       const { data } = await client.query({
         query: GET_ALL_POST_DATA_COMBINED,
         variables: { first: 1, after: null }, // Only need the count
       });
       totalPosts = data.allPosts.nodes.length;
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
    const { data } = await client.query({
      query: GET_POST_BY_ID,
      variables: { id },
    });

    if (!data.post) {
      return undefined;
    }

    // Adapt post data to InvoiceForm shape
    return {
      id: data.post.databaseId,
      customer_id: '1', // Placeholder
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