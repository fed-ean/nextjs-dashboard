// components/NewsCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { htmlToPlainText } from './extractImageFromHtml'; // Keep for alt text

// This component now expects a 'post' object that has a structure consistent with your GraphQL queries,
// including 'title', 'slug', 'excerpt', and 'featuredImage'.

export default function NewsCard({ post }) {
  // Return null or a placeholder if post data is not available
  if (!post) {
    return null; 
  }

  const { slug, title, featuredImage } = post;

  // Use the featured image URL directly from the post data
  const imgSrc = featuredImage?.node?.sourceUrl;

  // The title is already HTML, so we can use it directly with dangerouslySetInnerHTML
  const titleHtml = title || '';

  // Correct URL structure based on the project file structure
  const postUrl = `/Categorias/Noticias/${slug}`;

  return (
    <article className="news-card" style={{
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      height: '100%' // Ensures uniform card height in a grid layout
    }}>
      {/* Modern Next.js Link component implementation */}
      <Link 
        href={postUrl}
        aria-label={`Ir a noticia ${htmlToPlainText(titleHtml)}`}
        style={{ 
          color: 'inherit', 
          textDecoration: 'none', 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1 
        }}
      >
        {/* Image Section */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={htmlToPlainText(titleHtml) || 'Imagen de la noticia'}
              fill
              style={{ objectFit: 'cover' }}
              // If you haven't configured next.config.js for external domains, this is needed
              unoptimized={true} 
            />
          ) : (
            // Placeholder for when there is no image
            <div style={{ 
              width: '100%', 
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: '#f8fafc' 
            }}>
              <span style={{ color: '#94a3b8' }}>No image</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <h3 
            style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.2'}}
            dangerouslySetInnerHTML={{ __html: titleHtml }} 
          />
        </div>
      </Link>
    </article>
  );
}
