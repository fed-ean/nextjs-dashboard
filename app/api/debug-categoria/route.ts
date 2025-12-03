// /app/api/debug-categoria/route.ts
import { NextResponse } from "next/server";
import { GraphQLClient } from "graphql-request";
import { GET_POSTS_BY_CATEGORY } from "@/app/lib/queries";

const GQL_ENDPOINT = "https://radioempresaria.com.ar/graphql";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Falta slug" }, { status: 400 });
  }

  try {
    const client = new GraphQLClient(GQL_ENDPOINT, {
      headers: { "Content-Type": "application/json" },
    });

    const data = await client.request(GET_POSTS_BY_CATEGORY, { slug });

    return NextResponse.json({
      inputSlug: slug,
      rawResponse: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
        raw: err.response?.errors ?? null,
      },
      { status: 500 }
    );
  }
}
