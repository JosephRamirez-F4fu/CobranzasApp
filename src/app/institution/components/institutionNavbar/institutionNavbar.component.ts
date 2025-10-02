import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { Institution } from '@domain/interface/institution';
import { filter, map } from 'rxjs/operators';

interface NavItem {
  path: string;
  label: string;
  children?: NavItem[];
  queryParamKeys?: string[];
}

@Component({
  selector: 'institution-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './institutionNavbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionNavbarComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  items = signal<NavItem[]>([]);
  institution = input.required<Institution>();
  mobileOpen = signal<boolean>(false); // nueva señal para responsive
  activeUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );
  currentQueryParams = computed(() => {
    const url = this.activeUrl() || '/';
    const tree = this.router.parseUrl(url);
    return tree.queryParams ?? {};
  });

  constructor() {
    const normalize = (s?: string) =>
      (s ?? '').toString().replace(/^\/+|\/+$/g, '');
    const children =
      this.route.routeConfig?.children ??
      this.router.config.find(
        (r) => r.component?.name === 'InstitutionLayoutComponent'
      )?.children ??
      [];

    const seen = new Set<string>();
    const items = (children ?? [])
      .filter((c) => !(c.data && (c.data as any).hideFromNav)) // ignorar padres marcados como ocultos
      .map((c) => {
        const base = normalize(c.path);
        const childRoutes = c.children ?? [];

        const childrenItems: NavItem[] = [];
        for (const sc of childRoutes) {
          if (sc.data && (sc.data as any).hideFromNav) continue; // ignorar hijos ocultos
          const seg = normalize(sc.path);
          const full = [base, seg].filter(Boolean).join('/');
          if (seen.has(full)) continue; // evitar duplicado por path
          seen.add(full);
          childrenItems.push({
            path: full,
            label: sc.data?.['title'] ?? this.humanize(seg || base),
            queryParamKeys: this.extractQueryParamKeys(
              sc.data?.['queryParams']
            ),
          } as NavItem);
        }

        // Decidir path del padre y evitar duplicados
        const parentPath = base;
        if (parentPath && seen.has(parentPath)) {
          // si ya existe una ruta con el mismo path, solo devolvemos children (si los hay)
          return {
            path: parentPath,
            label: c.data?.['title'] ?? this.humanize(parentPath),
            children: childrenItems.length ? childrenItems : undefined,
            queryParamKeys: this.extractQueryParamKeys(
              c.data?.['queryParams']
            ),
          } as NavItem;
        }
        if (parentPath) seen.add(parentPath);

        return {
          path: parentPath,
          label: c.data?.['title'] ?? this.humanize(parentPath),
          children: childrenItems.length ? childrenItems : undefined,
          queryParamKeys: this.extractQueryParamKeys(c.data?.['queryParams']),
        } as NavItem;
      })
      .filter(Boolean) as NavItem[];

    this.items.set(items);
  }

  private extractQueryParamKeys(config: unknown): string[] | undefined {
    if (!config) return undefined;
    if (Array.isArray(config)) return config.map((v) => String(v));
    if (typeof config === 'string') return [config];
    if (typeof config === 'object') {
      return Object.entries(config)
        .filter(([, value]) => value !== false && value !== undefined)
        .map(([key]) => key);
    }
    return undefined;
  }

  getQueryParams(item: NavItem): Params | undefined {
    const keys = item.queryParamKeys;
    if (!keys?.length) return undefined;
    const current = this.currentQueryParams();
    const params: Params = {};
    let hasValue = false;
    for (const key of keys) {
      const value = current[key];
      if (value !== undefined) {
        params[key] = value;
        hasValue = true;
      }
    }
    return hasValue ? params : undefined;
  }

  humanize(path?: string): string {
    if (!path) return '';
    return String(path)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  isActive(path: string) {
    return computed(() => {
      const url = this.activeUrl();
      if (!path) return false;
      const normalized = path.startsWith('/') ? path : '/' + path;
      return (
        url === normalized ||
        url.startsWith(normalized + '/') ||
        url.startsWith(normalized + '?')
      );
    });
  }
  logout() {}
}
