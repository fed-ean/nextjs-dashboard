// components/PostContent.jsx
import React from 'react';
import Image from 'next/image';
import parse, { domToReact } from 'html-react-parser';
import sanitizeHtml from 'sanitize-html';

export default function PostContent({ html = '', imageUnoptimized = false }) {
  if (!html) return null;

  // Sanitizar: quitar estilos inline, clases, data-*, etc. conservar tags semánticos y attrs mínimos
  const clean = sanitizeHtml(html, {
    allowedTags: [
      'h1','h2','h3','h4','h5','h6',
      'p','ul','ol','li','strong','em','blockquote',
      'pre','code','br','hr','a','img','figure','figcaption','div','span'
    ],
    allowedAttributes: {
      a: ['href','title','target','rel'],
      img: ['src','alt','title','width','height']
    },
    transformTags: {
      '*': (tagName, attribs) => {
        const keep = {};
        Object.keys(attribs || {}).forEach(k => {
          if (['href','src','alt','title','width','height','target','rel'].includes(k)) keep[k] = attribs[k];
        });
        return { tagName, attribs: keep };
      }
    }
  });

  const options = {
    replace: domNode => {
      if (!domNode || !domNode.name) return;

      // Reemplazar <img> por next/image
      if (domNode.name === 'img') {
        const attribs = domNode.attribs || {};
        const src = attribs.src || '';
        const alt = attribs.alt || '';
        const width = attribs.width ? parseInt(attribs.width, 10) : 800;
        const height = attribs.height ? parseInt(attribs.height, 10) : 450;

        if (!src) return null;

        return (
          <figure className="post-image">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              style={{ width: '100%', height: 'auto' }}
              unoptimized={imageUnoptimized}
            />
            {/* Si WP puso <figcaption> lo mostrará automáticamente */}
          </figure>
        );
      }

      // Forzar rel en links target="_blank"
      if (domNode.name === 'a') {
        const attribs = domNode.attribs || {};
        const href = attribs.href || '#';
        const target = attribs.target || undefined;
        const rel = attribs.rel || (target === '_blank' ? 'noopener noreferrer' : undefined);
        return (
          <a href={href} target={target} rel={rel}>
            {domToReact(domNode.children, options)}
          </a>
        );
      }

      return undefined;
    }
  };

  return (
    <article className="post-content">
      {parse(clean, options)}
      <style jsx>{`
        .post-content :global(p) { margin: 1rem 0; }
        .post-image { margin: 1rem 0; }
      `}</style>
    </article>
  );
}