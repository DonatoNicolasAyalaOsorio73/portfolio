import type { Locale } from './index';

/**
 * The only place that builds an internal URL (AD-5). Paths are the English ones;
 * `build.format: 'file'` keeps the legacy `.html` URLs.
 */
export const routes = {
  home: '/',
} as const;

export type RouteKey = keyof typeof routes;

/** The URL of `route` in `locale`, optionally with a `#hash` (given without the `#`). */
export function href(route: RouteKey, locale: Locale, hash?: string): string {
  const path = locale === 'en' ? routes[route] : `/${locale}${routes[route]}`;
  return hash ? `${path}#${hash}` : path;
}
