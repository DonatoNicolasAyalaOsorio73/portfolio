import { locales, type Locale } from './index';

/**
 * The only place that builds an internal URL (AD-5). Paths are the English ones;
 * `build.format: 'preserve'` keeps the legacy `.html` URLs and gives `/es/` its own index.
 */
export const routes = {
  home: '/',
} as const;

export type RouteKey = keyof typeof routes;

const routeKeys = Object.keys(routes) as RouteKey[];

/** The URL of `route` in `locale`, optionally with a `#hash` (given without the `#`). */
export function href(route: RouteKey, locale: Locale, hash?: string): string {
  const path = locale === 'en' ? routes[route] : `/${locale}${routes[route]}`;
  return hash ? `${path}#${hash}` : path;
}

/** The route and locale a pathname belongs to, or `undefined` for an unknown path. */
export function routeOf(pathname: string): { route: RouteKey; locale: Locale } | undefined {
  for (const locale of locales) {
    for (const route of routeKeys) {
      if (href(route, locale) === pathname) return { route, locale };
    }
  }
  return undefined;
}

/**
 * The same page in the other language: `/x` ↔ `/es/x`. An unknown path falls back to the
 * other language's home.
 */
export function twin(pathname: string): string {
  const match = routeOf(pathname);
  if (!match) {
    const esHome = href('home', 'es');
    const isSpanish = pathname === esHome.replace(/\/$/, '') || pathname.startsWith(esHome);
    return href('home', isSpanish ? 'en' : 'es');
  }
  return href(match.route, match.locale === 'en' ? 'es' : 'en');
}
