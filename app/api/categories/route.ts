// app/api/categories/route.ts (Next.js App Router API route)
import { NextResponse } from 'next/server';
import { getAllCategories } from '@/app/lib/data-fetcher';

export async function GET() {
  try {
    const cats = await getAllCategories();
    return NextResponse.json(cats);
  } catch (err) {
    console.error('API /categories error', err);
    return NextResponse.json({ error: 'Error loading categories' }, { status: 500 });
  }
}
