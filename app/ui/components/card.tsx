// components/NewsCard.jsx
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { extractFirstImageSrc, htmlToPlainText } from './extractImageFromHtml';

export default function NewsCard({ post }) {
  const titleHtml = post?.title || '';
  const contentHtml = post?.content || '';
  const slug = post?.slug || post?.id;

  const imgSrc = extractFirstImageSrc(contentHtml);
  const excerpt = (() => {
    const plain = htmlToPlainText(contentHtml || '');
    return plain.length > 140 ? plain.slice(0, 137) + '...' : plain;
  })();

  return (
    <article className="news-card" style={{
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      <Link href={`/posts/${encodeURIComponent(slug)}`}>
        <a aria-label={`Ir a noticia ${htmlToPlainText(titleHtml)}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {imgSrc ? (
            <div style={{ position: 'relative', width: '100%', height: 180 }}>
              <Image
                src={imgSrc}
                alt={htmlToPlainText(titleHtml) || 'Imagen noticia'}
                fill
                style={{ objectFit: 'cover' }}
                // Si no configuraste next.config.js para dominios externa, descomenta la línea unoptimized
                unoptimized={true}
              />
            </div>
          ) : (
            <div style={{ width: '100%', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
              <span style={{ color: '#94a3b8' }}>No image</span>
            </div>
          )}

          <div style={{ padding: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.2', marginBottom: 8 }}
                dangerouslySetInnerHTML={{ __html: titleHtml }} />

            <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>{excerpt || 'Sin resumen'}</p>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Leer noticia →</span>
            </div>
          </div>
        </a>
      </Link>
    </article>
  );
}