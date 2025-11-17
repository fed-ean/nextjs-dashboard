interface Post {
    databaseId: number;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage: { node: { sourceUrl: string; }; };
    categories: { nodes: { name: string; }[]; };
  }
  
  interface NoticiasVariasProps {
    posts: Post[];
    page: number;
    categoriaSlug: string;
    categoriaNombre: string;
  }
  
  export default function NoticiasVarias({ posts, page, categoriaSlug, categoriaNombre }: NoticiasVariasProps) {
    return (
      <div>
        {posts.map((post) => (
          <div key={post.databaseId} className="relative overflow-hidden rounded-lg shadow-lg mx-4 card">
            <img src={post.featuredImage?.node.sourceUrl || '/placeholder.png'} className="w-full h-auto" alt={post.title} />
            <div className="absolute inset-0 flex flex-col justify-end">
              <h5 className="text-white text-xl px-4 py-1 titillium-web-regular card-title">
                {post.title}
              </h5>
            </div>
          </div>
        ))}
      </div>
    );
  }