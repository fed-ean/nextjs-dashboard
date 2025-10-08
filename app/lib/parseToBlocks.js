import sanitizeHtml from 'sanitize-html';
import { parse as parseHTML } from 'node-html-parser';

/** Quitar comentarios Gutenberg */
function stripGutenbergComments(html) {
  if (!html) return '';
  html = html.replace(/<!--\s*wp:[a-z0-9-_]+(?:\s+\{[\s\S]*?\})?\s*-->/gi, '');
  html = html.replace(/<!--\s*\/wp:[a-z0-9-_]+\s*-->/gi, '');
  return html;
}

/** Detectar shortcodes comunes como [gallery ids="..."] */
function detectShortcodes(html) {
  const blocks = [];
  const galleryRegex = /\[gallery\s+ids="([^"]+)"\]/gi;
  let match;
  while ((match = galleryRegex.exec(html)) !== null) {
    const ids = match[1].split(',').map(id => parseInt(id.trim(), 10));
    blocks.push({ type: 'gallery', ids });
  }
  return blocks;
}

export function parseContentToBlocks(rawHtml) {
  if (!rawHtml) return [];

  // 1) Detectar shortcodes ANTES de limpiar
  const shortcodeBlocks = detectShortcodes(rawHtml);

  // 2) Quitar comentarios Gutenberg
  const noComments = stripGutenbergComments(rawHtml);

  // 3) Sanitizar
  const clean = sanitizeHtml(noComments, {
    allowedTags: false,
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'class'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen'],
    }
  });

  // 4) Parsear
  const root = parseHTML(clean, { script: true, style: true, pre: true });
  const container = root.querySelector('body') || root;

  const blocks = [];

  container.childNodes.forEach(node => {
    if (!node) return;
    const tagName = node.tagName ? node.tagName.toLowerCase() : null;

    if (tagName === 'p') {
      blocks.push({ type: 'paragraph', text: node.text.trim(), html: node.innerHTML });
      return;
    }

    if (tagName === 'figure') {
      const img = node.querySelector('img');
      if (img) {
        // detectar id en class wp-image-XXXX
        let id = null;
        const classAttr = img.getAttribute('class') || '';
        const idMatch = classAttr.match(/wp-image-(\d+)/);
        if (idMatch) id = parseInt(idMatch[1], 10);

        blocks.push({
          type: 'image',
          id,
          src: img.getAttribute('src') || '',
          alt: img.getAttribute('alt') || '',
          title: img.getAttribute('title') || '',
        });
        return;
      }
    }

    if (tagName === 'blockquote') {
      blocks.push({ type: 'quote', text: node.text.trim(), html: node.innerHTML });
      return;
    }
  });

  // 5) Unir shortcodes detectados al principio
  return [...shortcodeBlocks, ...blocks];
}
