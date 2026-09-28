/**
 * Shared pagination arithmetic for the list routes.
 * Guards against non-numeric, zero, negative and absurdly large `?page=` values
 * so a hostile or mistyped query string can never produce a NaN offset or a
 * "Page NaN of NaN" header.
 */

export interface PaginationResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export const MAX_PAGE_PARAM = 100000;

export function parsePageParam(rawPage?: string | null): number {
  if (rawPage === undefined || rawPage === null) return 1;
  const trimmed = String(rawPage).trim();
  if (!trimmed || !/^\d+$/.test(trimmed)) return 1;
  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(parsed, MAX_PAGE_PARAM);
}

export function paginate<T>(items: T[], rawPage: string | null | undefined, pageSize: number): PaginationResult<T> {
  const size = pageSize > 0 ? Math.floor(pageSize) : 1;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const currentPage = Math.min(parsePageParam(rawPage), totalPages);
  const offset = (currentPage - 1) * size;
  return { items: items.slice(offset, offset + size), currentPage, totalPages, total };
}
