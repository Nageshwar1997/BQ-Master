import { usePathParams } from '@beautinique/frontend-hooks';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const { pathname } = usePathParams();

  useEffect(() => {
    const el = document.getElementById('main');

    if (!el) return;
    el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
