import { NextRequest, NextResponse } from "next/server";
import { getDataset } from "@/src/lib/data/loader";
import { searchDataset } from "@/src/lib/data/search";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const dataset = getDataset();
  const results = searchDataset(dataset, query, limit);

  return NextResponse.json({ results });
}
