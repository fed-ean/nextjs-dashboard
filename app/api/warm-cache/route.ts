// app/api/warm-cache/route.ts
import { NextResponse } from 'next/server';
import { getCachedPostsPage } from '../../lib/wpRest'; // <-- RUTA CORREGIDA DEFINITIVAMENTE

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug') || '';
    const page = Number(url.searchParams.get('page') || '1');
    const perPage = Number(url.searchParams.get('perPage') || '9');

    if (!slug) return NextResponse.json({ ok: false, message: 'slug required' }, { status: 400 });

    // Llama a la función, ya no necesita TTL
    const data = await getCachedPostsPage(slug, page, perPage);

    // Responder rápido con meta
    return NextResponse.json({ ok: true, slug, page, postsCount: (data?.posts || []).length, source: data?.source || 'graphql' });
  } catch (err: any) {
    console.error('[API warm-cache] Error:', err);
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
