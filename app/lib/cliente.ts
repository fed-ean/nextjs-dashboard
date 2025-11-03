// lib/cliente.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const GRAPHQL_URI = process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT || 'https://radioempresaria.com.ar/graphql';

// Singleton (solo en cliente)
let apolloClient: ApolloClient<any> | null = null;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({ uri: GRAPHQL_URI, fetch }),
    cache: new InMemoryCache(),
  });
}

/**
 * Devuelve un ApolloClient:
 * - En server: crea uno nuevo por llamada (ok para SSR/static).
 * - En cliente: reutiliza un singleton.
 */
export function getClient() {
  if (typeof window === 'undefined') {
    // Server — crear nuevo cliente por request evita contaminación entre requests
    return createApolloClient();
  }

  // Cliente (navegador) — reutilizar
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
}

// export default por compatibilidad con import default anterior (opcional)
export default getClient;
