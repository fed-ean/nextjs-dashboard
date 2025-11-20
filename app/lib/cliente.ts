import { ApolloClient, InMemoryCache } from "@apollo/client";

const GRAPHQL_URI =
  process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT ||
  'https://radioempresaria.com.ar/graphql';

export function getClient() {
  return new ApolloClient({
    uri: GRAPHQL_URI,
    cache: new InMemoryCache(),
  });
}
