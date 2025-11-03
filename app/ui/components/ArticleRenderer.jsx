// components/ArticleRenderer.jsx
import Image from 'next/image';

export function Paragraph({ html }) {
  return <p dangerouslySetInnerHTML={{ __html: html || '' }} />;
}

export function ImageBlock({ src, alt, sizes }) {
  if (!src) return null;
  return (
    <div style={{ margin: '1rem 0' }}>
      <Image src={src} alt={alt || ''} width={1200} height={675} style={{ width: '100%', height: 'auto' }} />
    </div>
  );
}

export function Gallery({ images = [] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 8 }}>
      {images.map((img, i) => (
        <div key={i} style={{ overflow: 'hidden' }}>
          <Image src={img.src} alt={img.alt || ''} width={400} height={300} style={{ width: '100%', height: 'auto' }} />
        </div>
      ))}
    </div>
  );
}

export default function ArticleRenderer({ blocks = [] }) {
  return (
    <article>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'paragraph': return <Paragraph key={i} html={b.html} />;
          case 'image': return <ImageBlock key={i} src={b.src} alt={b.alt} sizes={b.sizes} />;
          case 'gallery': return <Gallery key={i} images={b.images || []} />;
          case 'quote': return <blockquote key={i} dangerouslySetInnerHTML={{ __html: b.html || b.text }} />;
          case 'raw': return <div key={i} dangerouslySetInnerHTML={{ __html: b.html }} />;
          default: return null;
        }
      })}
    </article>
  );
}
