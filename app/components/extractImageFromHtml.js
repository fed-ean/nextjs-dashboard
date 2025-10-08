// utils/extractImageFromHtml.js
export function extractFirstImageSrc(html = '') {
  if (!html) return null;
  // busca el primer src de <img ... src="...">
  const imgRegex = /<img[^>]+src=(?:'|")([^'">]+)(?:'|")/i;
  const match = imgRegex.exec(html);
  return match ? match[1] : null;
}

export function htmlToPlainText(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
