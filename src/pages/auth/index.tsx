import { Icon } from '@iconify/react';
import { Outlet } from 'react-router-dom';

import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';

const AUTH_HIGHLIGHTS = [
  { icon: 'solar:shield-check-linear', text: 'Verified Sellers' },
  { icon: 'solar:magic-stick-3-linear', text: 'Virtual Try-On' },
  { icon: 'solar:star-linear', text: 'Genuine Reviews' },
] as const;

const Auth = () => {
  return (
    <div className="relative flex h-dvh min-h-dvh w-full gap-4 p-4 outline-hidden">
      {/* ================= LEFT SHOWCASE PANEL ================= */}
      <div className="from-blue-crayola-c via-dodger-blue-c hidden w-full rounded-2xl bg-linear-90 to-transparent lg:flex lg:flex-col lg:items-center lg:justify-between lg:gap-6 lg:p-5">
        {/* -------- Brand -------- */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-wide text-white sm:text-3xl">
            BEAUTINIQUE
          </h1>
          <p className="max-w-sm text-sm text-white/80 sm:text-base">
            India&apos;s First Beauty Brand That Delivers Products Directly to the Customer
          </p>
        </div>

        {/* -------- Illustration -------- */}
        <img
          src="/images/auth/auth-left-side.webp"
          className="max-h-[52dvh] w-auto object-contain drop-shadow-2xl"
          alt="Auth-Image"
          loading="eager"
          fetchPriority="high"
        />

        {/* -------- Trust Highlights -------- */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {AUTH_HIGHLIGHTS.map((item) => (
            <span
              key={item.text}
              className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md sm:text-sm"
            >
              <Icon icon={item.icon} className="size-4 shrink-0" />
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* ================= FORM PANEL ================= */}
      <ScrollableGradientContainer direction="vertical" className="mx-auto max-w-md">
        <main>
          <Outlet />
        </main>
      </ScrollableGradientContainer>
    </div>
  );
};

export default Auth;
