import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: "TMDB API key is not configured. Add TMDB_API_KEY to .env.local" },
      { status: 500 }
    );
  }

  const url = `${TMDB_BASE}/movie/${encodeURIComponent(id)}?api_key=${TMDB_API_KEY}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: `TMDB returned ${res.status}: ${body}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to reach TMDB: ${(err as Error).message}` },
      { status: 502 }
    );
  }
}
