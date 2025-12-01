// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

// Tipos existentes...

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

// app/lib/definitions.ts
export type Category = {
  databaseId: number;
  name: string;
  slug: string;
  count: number;
};

export type FeaturedImage = {
  node: {
    sourceUrl: string | null;
  };
};

export type Post = {
  databaseId: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  featuredImage: FeaturedImage;
  categories: {
    nodes: Category[];
  };
};

// --- NUEVO TIPO AÑADIDO ---
// Este tipo representa la forma de los datos de un post después de ser mapeado
// por la función `mapPostData`.
export interface MappedPost {
  databaseId: number;
  title: string;
  excerpt: string | null;   // ← AGREGAR ESTO
  slug: string;
  date: string;
  featuredImage: string | null;
  categories: {
    databaseId: number;
    name: string;
    slug: string;
    count: number;
  }[];
  category: string | null;
  categorySlug: string | null;
}


export type PagedPosts = {
  posts: MappedPost[]; // Modificado para usar MappedPost
  totalPages: number;
  total: number;
  category: Category | null;
};
