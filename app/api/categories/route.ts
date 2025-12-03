import { NextResponse } from 'next/server';

const GQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT_URL || "/graphql";

const GET_ALL_CATEGORIES_QUERY = `
  query GetAllCategories {
    categories(first: 100) {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

export async function GET() {
  console.log('API Route /api/categories called');
  try {
    const response = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: GET_ALL_CATEGORIES_QUERY,
      }),
      // Incrementamos el timeout y usamos revalidate para un mejor control de caché
      next: { revalidate: 60 },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`External API request failed with status ${response.status}:`, errorBody);
        return NextResponse.json(
            { message: `Error from external GraphQL server`, details: errorBody }, 
            { status: response.status }
        );
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL query returned errors:', result.errors);
      return NextResponse.json(
          { message: 'GraphQL query failed', details: result.errors }, 
          { status: 400 } // Bad Request, ya que la consulta es inválida
      );
    }

    const categories = result?.data?.categories?.nodes;

    if (!categories) {
        console.error('Invalid data structure from GraphQL:', result);
        return NextResponse.json(
            { message: 'Invalid data structure returned from GraphQL' }, 
            { status: 500 }
        );
    }
    console.log('Successfully fetched categories.');
    return NextResponse.json(categories);

  } catch (err: any) {
    console.error('Internal Server Error in API route:', err);
    return NextResponse.json(
        { message: 'Internal Server Error', details: err.message, stack: err.stack }, 
        { status: 500 }
    );
  }
}
