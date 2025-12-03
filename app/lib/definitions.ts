// app/lib/definitions.ts
export type RawPost = {
  databaseId?: number | string;
  title?: string;
  slug?: string;
  excerpt?: string;
  date?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      mediaItemUrl?: string | null;
    } | null;
  } | null;
};

export type MappedPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  featuredImage: string | null;
};

export interface Category {
  name: string;
  slug: string;
  count?: number; // <-- agregar esta línea
}


export type PagedPosts = {
  posts: MappedPost[];
  total: number;
  totalPages: number;
  category: {
    name: string;
    slug: string;
  };
};


/* -------------------------------------------------------
   PAGEINFO PARA CURSOR PAGINATION
------------------------------------------------------- */
export interface CursorPageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
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
