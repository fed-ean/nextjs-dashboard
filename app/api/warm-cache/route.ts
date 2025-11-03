// app/api/warm-cache/route.ts
import { NextResponse } from 'next/server';
import { getCachedPostsPage } from '../../lib/cacheProxy';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug') || '';
    const page = Number(url.searchParams.get('page') || '1');
    const perPage = Number(url.searchParams.get('perPage') || '9');
    const ttl = Number(process.env.CACHE_TTL_SECONDS || '60');

    if (!slug) return NextResponse.json({ ok: false, message: 'slug required' }, { status: 400 });

    // Llama al helper cacheado. Esto forzará generación y guardado si no existía.
    const data = await getCachedPostsPage(slug, page, perPage, ttl);

    // Responder rápido con meta — no devolvemos posts para ahorrar payload, solo status
    return NextResponse.json({ ok: true, slug, page, postsCount: (data?.posts || []).length, source: data?.source || 'cached' });
  } catch (err: any) {
    console.error('warm-cache error', err);
    return NextResponse.json({ ok: false, message: String(err?.message || err) }, { status: 500 });
  }
}
