import type { TAdminStatus, TStateOrUT } from '@beautinique/frontend-types';
import { OlaMaps } from 'olamaps-web-sdk';
import { useEffect, useRef, useState } from 'react';

import {
  INDIA_MAP_CENTER,
  INDIA_MAP_ZOOM,
  STATE_MAP_COORDINATES,
} from '@/constants/mapStates.constants';
import envs from '@/envs';
import useThemeStore from '@/stores/theme.store';

export interface IStateMapSummary {
  adminName: string;
  // `TAdminStatus` (not a narrower `ACTIVE | ON_LEAVE | SUSPENDED` union) so
  // this lines up directly with `IAdminPopulated.status` at the call site -
  // `INACTIVE` (a demoted admin, task 7.1) shouldn't realistically reach
  // here anyway, since `useGetTerritoryMap()` excludes it by default, but
  // `MARKER_COLOR` below still handles it rather than assuming that.
  status: TAdminStatus;
  load: number;
}

const MARKER_COLOR: Record<TAdminStatus | 'UNASSIGNED', string> = {
  ACTIVE: '#16a34a', // green - at least one ACTIVE admin covers this state
  ON_LEAVE: '#ca8a04', // yellow - covered, but only by ON_LEAVE admin(s)
  SUSPENDED: '#dc2626', // red - covered, but only by SUSPENDED admin(s)
  INACTIVE: '#9ca3af', // shouldn't occur here in practice, see the note above
  UNASSIGNED: '#9ca3af', // gray - no admin configured for this state at all
};

// Best status "wins" the marker color when a state has multiple admins -
// ACTIVE (someone's actually available) beats ON_LEAVE beats SUSPENDED.
const colorForSummaries = (summaries: IStateMapSummary[] | undefined): string => {
  if (!summaries || summaries.length === 0) return MARKER_COLOR.UNASSIGNED;
  if (summaries.some((s) => s.status === 'ACTIVE')) return MARKER_COLOR.ACTIVE;
  if (summaries.some((s) => s.status === 'ON_LEAVE')) return MARKER_COLOR.ON_LEAVE;
  return MARKER_COLOR.SUSPENDED;
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });

const popupHtml = (state: TStateOrUT, summaries: IStateMapSummary[] | undefined): string => {
  const title = `<div style="font-weight:600;margin-bottom:4px;">${escapeHtml(state)}</div>`;

  if (!summaries || summaries.length === 0) {
    return `${title}<div style="font-size:12px;color:#9ca3af;">No admin assigned</div>`;
  }

  const rows = summaries
    .map(
      (s) =>
        `<div style="font-size:12px;padding:2px 0;">${escapeHtml(s.adminName)} — ${s.status.replaceAll('_', ' ').toLowerCase()} · load ${String(s.load)}</div>`,
    )
    .join('');

  return `${title}${rows}`;
};

// `olamaps-web-sdk` ships loose `any` types past `init()` (a thin MapLibre
// GL wrapper, not a fully-typed SDK) - same narrow local shapes pattern
// BQ-Client's `LocationPickerModal.tsx` uses to keep the rest of this
// component type-safe.
interface IOlaMapInstance {
  on: {
    (event: 'styleimagemissing', handler: (event: { id: string }) => void): void;
    (event: 'error', handler: () => void): void;
  };
  addImage: (id: string, image: { width: number; height: number; data: Uint8Array }) => void;
  remove: () => void;
}

interface IOlaPopupInstance {
  setHTML: (html: string) => IOlaPopupInstance;
}

interface IOlaMarkerInstance {
  setLngLat: (lngLat: [number, number]) => IOlaMarkerInstance;
  setPopup: (popup: IOlaPopupInstance) => IOlaMarkerInstance;
  addTo: (map: IOlaMapInstance) => IOlaMarkerInstance;
  remove: () => void;
}

const OLA_DARK_STYLE_URL =
  'https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard/style.json';
const OLA_LIGHT_STYLE_URL =
  'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json';

interface ITerritoryMapCanvasProps {
  summariesByState: Map<TStateOrUT, IStateMapSummary[]>;
}

/**
 * Read-only visual overview (task 6.3) - a marker per state/UT, colored by
 * coverage status, click for a per-admin breakdown popup. The table above
 * (Territory Management's existing list view, F.M1-F.M3) stays the actual
 * management surface - assign/status-override/demote all happen there, not
 * here, so this never needs to duplicate any of those modals.
 */
const TerritoryMapCanvas = ({ summariesByState }: ITerritoryMapCanvasProps) => {
  const theme = useThemeStore((s) => s.theme);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<IOlaMapInstance | null>(null);
  const sdkRef = useRef<OlaMaps | null>(null);
  const markersRef = useRef<IOlaMarkerInstance[]>([]);
  // Kept in a ref so the mount effect always reads the latest summaries
  // without re-initializing the whole map on every data refetch.
  const summariesRef = useRef(summariesByState);
  useEffect(() => {
    summariesRef.current = summariesByState;
  });

  // Surfaced instead of a silent blank box - most likely cause is this
  // app's own origin not yet being added to the Ola Maps key's
  // domain-whitelist on the Krutrim Cloud dashboard (a separate whitelist
  // entry from `BQ-Client`'s, which only covers its own origin).
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // An object property, not a plain `let` - a closured `let` gets
    // narrowed to a literal `false` by the time the second check below
    // runs (TS can't see that the cleanup function below might have
    // flipped it during the `await`s in between), which makes that check
    // a false-positive "always falsy" lint error. A property read isn't
    // narrowed the same way.
    const cancelledRef = { current: false };

    const sdk = new OlaMaps({ apiKey: envs.ola_maps.api_key });
    sdkRef.current = sdk;

    setLoadError(null);

    const boot = async () => {
      // styleBlobUrl = await fetchLabelFixedStyle(envs.ola_maps.api_key);

      const map = (await sdk.init({
        container,
        center: INDIA_MAP_CENTER,
        zoom: INDIA_MAP_ZOOM,
        style: theme === 'dark' ? OLA_DARK_STYLE_URL : OLA_LIGHT_STYLE_URL,
      })) as IOlaMapInstance;

      // Single check, right before the map is actually used/stored - TS
      // narrows a closured cancellation flag to a literal too eagerly
      // across `await` points to check it more than once usefully anyway
      // (each earlier check would read as permanently `false` to the
      // type-checker, `@typescript-eslint/no-unnecessary-condition` false
      // positive). Unmounting mid-`fetchLabelFixedStyle`/mid-`init` just
      // means this one check catches it slightly later - the map still
      // never renders into a stale/removed container either way.
      if (cancelledRef.current) {
        map.remove();
        return;
      }

      mapRef.current = map;

      // Defensive fallback, same as BQ-Client's picker - a transparent 1x1
      // pixel beats MapLibre's default "Image ... could not be loaded"
      // console warning for any icon a style references but doesn't ship.
      map.on('styleimagemissing', (event) => {
        map.addImage(event.id, { width: 1, height: 1, data: new Uint8Array(4) });
      });
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      map.on('error', () => {});

      (Object.keys(STATE_MAP_COORDINATES) as TStateOrUT[]).forEach((state) => {
        const summaries = summariesRef.current.get(state);
        const coordinates = STATE_MAP_COORDINATES[state];

        // `addPopup()`/`addMarker()` return untyped `any`, see the note
        // above `IOlaMapInstance` - the whole marker+popup setup below is
        // one unsafe boundary crossing back into the narrow local types.
        /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
        const popup: IOlaPopupInstance = sdk
          .addPopup({ offset: 16, closeButton: false })
          .setHTML(popupHtml(state, summaries));

        const marker: IOlaMarkerInstance = sdk.addMarker({ color: colorForSummaries(summaries) });
        /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

        markersRef.current.push(marker.setLngLat(coordinates).setPopup(popup).addTo(map));
      });
    };

    boot().catch((error: unknown) => {
      // Map tiles/style failing to load (e.g. API key not yet whitelisted
      // for this app's domain) shouldn't crash the page - the table above
      // is the real management surface either way - but it's still worth
      // telling whoever's looking at this rather than showing a silent
      // blank box.
      if (cancelledRef.current) return;
      setLoadError(error instanceof Error ? error.message : 'Failed to load the map.');
    });

    return () => {
      cancelledRef.current = true;
      markersRef.current.forEach((marker) => {
        marker.remove();
      });
      markersRef.current = [];
      mapRef.current?.remove();
    };
  }, [theme]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="[&_.maplibregl-popup-content]:bg-secondary-invert! h-full w-full" />
      {loadError && (
        <div className="bg-secondary-invert/95 absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
          <span className="text-primary text-sm font-semibold">Map failed to load</span>
          <span className="text-tertiary max-w-md text-xs wrap-break-word">{loadError}</span>
          <span className="text-tertiary text-xs">
            The table view above stays fully usable regardless.
          </span>
        </div>
      )}
    </div>
  );
};

export default TerritoryMapCanvas;
