export interface NewsPage<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export function getNewsPage<T>(
  items: T[],
  requestedPage: number,
  pageSize: number
): NewsPage<T> {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const totalPages = Math.max(1, Math.ceil(items.length / safePageSize));
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(1, Math.floor(requestedPage)), totalPages)
    : 1;
  const start = (page - 1) * safePageSize;

  return {
    items: items.slice(start, start + safePageSize),
    page,
    pageSize: safePageSize,
    totalPages,
    hasMore: page < totalPages,
  };
}

export function getNewsBatch<T>(
  items: T[],
  page: number,
  pageSize: number
): NewsPage<T> {
  return getNewsPage(items, page, pageSize);
}
