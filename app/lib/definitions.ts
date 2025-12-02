// app/lib/definitions.ts

/* -------------------------------------------------------
   POST CRUDOS QUE VIENEN DE WPGRAPHQL (RAW)
------------------------------------------------------- */
export interface RawPost {
  databaseId: number;
  title: string | null;
  slug: string | null;
  date: string | null;
  excerpt: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
    } | null;
  } | null;
  categories?: {
    nodes: Array<{
      databaseId: number;
      name: string | null;
      slug: string | null;
    }>;
  } | null;
}

/* -------------------------------------------------------
   POST MAPEADO (FORMATO QUE USA TU APP)
------------------------------------------------------- */
export interface MappedPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  image: string;
}

/* -------------------------------------------------------
   CATEGORÍAS
------------------------------------------------------- */
export interface Category {
  databaseId: number;
  name: string;
  slug: string;
  count?: number | null;
}

/* -------------------------------------------------------
   PAGEINFO PARA CURSOR PAGINATION
------------------------------------------------------- */
export interface CursorPageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

/* -------------------------------------------------------
   RESULTADO DE PÁGINA DE POSTS (PARA getCachedPostsPage)
------------------------------------------------------- */
export interface PagedPosts {
  posts: MappedPost[];
  pageInfo: CursorPageInfo;
    totalPages: number;       // <-- ESTA PROPIEDAD FALTABA
    totalPosts: number;       // <-- Probablemente también la necesites
  

  // Este objeto se usa para mostrar el nombre correcto de la categoría
  category?: {
    databaseId?: number;
    name?: string | null;
    slug?: string | null;
  } | null;
}

/* -------------------------------------------------------
   RESULTADO DE WPGRAPHQL PARA CATEGORY QUERY COMPLETA
------------------------------------------------------- */
export interface RawCategoryQuery {
  posts: {
    nodes: RawPost[];
    pageInfo: CursorPageInfo;
  };
  category?: {
    databaseId: number;
    name: string | null;
    slug: string | null;
  } | null;
}
export interface PageInfo {
  offsetPagination: {
    hasMore: boolean;
    hasPrevious: boolean;
    total: number; // total de posts
  };
}
