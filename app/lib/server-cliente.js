// app/lib/server-cliente.js
// Este archivo es para uso exclusivo en el servidor.
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const GRAPHQL_URI = process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT || 'https://radioempresaria.com.ar/graphql';

/**
 * Crea y devuelve una nueva instancia de ApolloClient para el renderizado del lado del servidor.
 * Se crea un nuevo cliente para cada solicitud del servidor para evitar la fuga de datos
 * entre usuarios.
 */
export function getServerSideClient() {
  return new ApolloClient({
    ssrMode: true, // Explícitamente establecido en true para el lado del servidor
    link: new HttpLink({ uri: GRAPHQL_URI }),
    cache: new InMemoryCache(),
  });
}
