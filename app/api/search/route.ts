import { NextRequest, NextResponse } from "next/server";
import { getDataset } from "@/src/lib/data/loader";
import { searchDataset } from "@/src/lib/data/search";
import { logServerEvent } from "@/src/lib/manager";

const MAX_QUERY_LENGTH = 100;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=600";

function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: { "Cache-Control": CACHE_CONTROL } });
}

function resolveLimit(rawLimit: string | null): number | null {
  if (rawLimit === null) return DEFAULT_LIMIT;
  const trimmed = rawLimit.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsed)) return null;
  return Math.min(Math.max(parsed, 1), MAX_LIMIT);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  if (query.length > MAX_QUERY_LENGTH) {
    return json({ error: `Query must be ${MAX_QUERY_LENGTH} characters or fewer` }, 400);
  }

  const limit = resolveLimit(searchParams.get("limit"));
  if (limit === null) {
    return json({ error: `limit must be an integer between 1 and ${MAX_LIMIT}` }, 400);
  }

  if (!query.trim()) {
    return json({ results: [] });
  }

  const dataset = getDataset();
  const results = searchDataset(dataset, query, limit);
  logServerEvent("search_completed", { queryLength: query.length, limit, results: results.length });

  return json({ results });
}
