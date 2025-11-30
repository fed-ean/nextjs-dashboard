// app/api/warm-cache/route.ts
import { NextResponse } from "next/server";
import { getCachedPostsPage } from "../../lib/data-fetcher";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug") || "";

    if (!slug) {
      return NextResponse.json(
        { ok: false, message: "slug required" },
        { status: 400 }
      );
    }

    // Se corrige la llamada para que coincida con la firma (slug, page)
    // Se asume que queremos calentar la primera página.
    const data = await getCachedPostsPage(slug, 1);

    return NextResponse.json({
      ok: true,
      slug,
      postsCount: (data?.posts || []).length,
    });
  } catch (err: any) {
    console.error("[API warm-cache] Error:", err);
    return NextResponse.json(
      { ok: false, message: err?.message || "Error interno" },
      { status: 500 }
    );
  }
}
