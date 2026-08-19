import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/common.constants';
import { APP_VERSION, FOOTER_LINKS } from '@/constants/footer.constants';
import envs from '@/envs';
import useThemeStore from '@/stores/theme.store';

const Footer = () => {
  const theme = useThemeStore((s) => s.theme);
  const year = new Date().getFullYear();

  return (
    <footer className="w-full">
      <div className="flex flex-col gap-6 px-4 py-8 md:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        {/* Brand */}
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-3">
          <img
            src={`/images/logo/BQ_${theme === 'dark' ? 'white' : 'black'}_logo.webp`}
            alt="Logo"
            loading="lazy"
            className="h-9 w-9 shrink-0 object-contain"
          />
          <div className="flex flex-col leading-tight">
            <GradientText text="Beautinique" type="accent" className="text-lg font-semibold" />
            <span className="text-primary/40 text-[10px] font-medium tracking-[0.15em] uppercase">
              Seller Panel
            </span>
          </div>
        </Link>

        {/* Quick links — mirrors the sidebar so it never drifts out of sync */}
        <nav className="flex flex-wrap items-center justify-center gap-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="border-primary/10 bg-secondary-invert/30 text-primary/60 hover:border-primary/25 hover:bg-secondary-invert/60 hover:text-primary flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors"
            >
              <Icon icon={link.icon} className="size-3.5 shrink-0" />
              {link.title}
            </Link>
          ))}
        </nav>

        {/* System info */}
        <div className="flex items-center justify-center gap-2">
          <span className="border-primary/10 text-primary/50 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px]">
            <span
              className={`size-1.5 shrink-0 rounded-full ${
                envs.is_dev ? 'bg-primary-yellow' : 'bg-primary-green'
              }`}
            />
            {envs.is_dev ? 'Development' : 'Production'}
          </span>
          <span className="border-primary/10 text-primary/50 rounded-full border px-3 py-1.5 text-[11px]">
            v{APP_VERSION}
          </span>
        </div>
      </div>

      <Divider />

      <p className="text-primary/40 px-4 py-4 text-center text-[11px] lg:px-10">
        &copy; {year} Beautinique Pvt. Ltd. — Seller Use Only &middot; Crafted by{' '}
        <GradientText text="Nageshwar Pawar" type="accent" className="font-medium" />
      </p>
    </footer>
  );
};

export default Footer;
