// components/NewsCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { htmlToPlainText } from './extractImageFromHtml';

// ✅ Tipo del post corregido
type Post = {
  slug?: string;
  title?: string;
  excerpt?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
};

// ✅ Props tipadas correctamente
type Props = {
  post: Post;
};

export default function NewsCard({ post }: Props) {
  if (!post) {
    return null;
  }

  const { slug, title, featuredImage } = post;

  const imgSrc = featuredImage?.node?.sourceUrl;
  const titleHtml = title || '';
  const postUrl = `/Categorias/Noticias/${slug}`;

  return (
    <article
      className="news-card"
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        height: '100%',
      }}
    >
      <Link
        href={postUrl}
        aria-label={`Ir a noticia ${htmlToPlainText(titleHtml)}`}
        style={{
          color: 'inherit',
          textDecoration: 'none',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {/* Imagen */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%',
          }}
        >
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={htmlToPlainText(titleHtml) || 'Imagen de la noticia'}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized={true}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
              }}
            >
              <span style={{ color: '#94a3b8' }}>No image</span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div
          style={{
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <h3
            style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.2' }}
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
        </div>
      </Link>
    </article>
  );
}
