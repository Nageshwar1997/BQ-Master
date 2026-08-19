import packageJson from '../../package.json';
import { SIDEBAR_DATA } from './common.constants';

type TFooterNavLink = Extract<(typeof SIDEBAR_DATA)[number], { path: string }>;

// Sourced straight from SIDEBAR_DATA (minus the Logout action) so the footer's
// quick links can never drift out of sync with the actual admin routes/icons.
export const FOOTER_LINKS: TFooterNavLink[] = SIDEBAR_DATA.filter(
  (item): item is TFooterNavLink => 'path' in item,
);

export const APP_VERSION = packageJson.version;
