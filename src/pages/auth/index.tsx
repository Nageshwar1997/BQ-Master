import { Outlet } from 'react-router-dom';

import BrandShowcasePanel from '@/components/layout/containers/BrandShowcasePanel';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';

const AUTH_HIGHLIGHTS = [
  { icon: 'solar:shield-check-linear', text: 'Verified Sellers' },
  { icon: 'solar:magic-stick-3-linear', text: 'Virtual Try-On' },
  { icon: 'solar:star-linear', text: 'Genuine Reviews' },
] as const;

const Auth = () => {
  return (
    <div className="relative flex h-dvh min-h-dvh w-full gap-4 p-4">
      {/* ================= LEFT SHOWCASE PANEL ================= */}
      <BrandShowcasePanel
        title="BEAUTINIQUE"
        description="India's First Beauty Brand That Delivers Products Directly to the Customer"
        image={{ src: '/images/auth/auth-left-side.webp', alt: 'Auth-Image' }}
        highlights={AUTH_HIGHLIGHTS}
        imageClassName="max-h-1/2"
      />

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
