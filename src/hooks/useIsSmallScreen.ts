import { useEffect, useState } from 'react';

const useIsSmallScreen = (width = 1023) => {
  // Lazy initializer: reads matchMedia synchronously for the first render, instead of hardcoding
  // `false` and correcting it a render later inside the effect below (which caused needRef/etc.
  // consumers to briefly see the wrong value on mount, on small screens).
  const [isSmallScreen, setIsSmallScreen] = useState(
    () => window.matchMedia(`(max-width: ${String(width)}px)`).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${String(width)}px)`);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsSmallScreen(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Clean up the event listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [width]);

  return isSmallScreen;
};

export default useIsSmallScreen;
