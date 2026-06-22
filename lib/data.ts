import { NewsItem } from "./types";
import { getAllNews } from "./kv";
import { getDemoNews } from "./demo-data";

export async function getNewsWithFallback(): Promise<NewsItem[]> {
  return getAllNews();
}

export { getDemoNews };
