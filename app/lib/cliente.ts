// app/lib/cliente.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const GRAPHQL_URI =
  process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT ||
  'https://radioempresaria.com.ar/graphql';

export function getClient() {
  return new ApolloClient({
    // En versiones modernas de @apollo/client se usa `link` con HttpLink
    link: new HttpLink({ uri: GRAPHQL_URI }),
    cache: new InMemoryCache(),
  });
}
