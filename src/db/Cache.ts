import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (...args: any[]) => Promise<any>;

export function cache<T extends Callback>(
  db: T,
  keyParts: string[],
  option: { revalidate?: number | false; tags?: string[] }
) {
  return nextCache(reactCache(db), keyParts, option);
}
