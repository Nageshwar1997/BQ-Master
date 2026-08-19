import { useEffect, useRef, useState } from 'react';

import type { TScrollDirection } from '@/types/hook.type';

interface IHorizontal {
  left: boolean;
  right: boolean;
  direction: 'horizontal';
}
interface IVertical {
  top: boolean;
  bottom: boolean;
  direction: 'vertical';
}

type TScroll = IHorizontal | IVertical;

const useScrollable = (direction: TScrollDirection) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showGradient, setShowGradient] = useState<TScroll>(
    direction === 'horizontal'
      ? { direction: 'horizontal', left: false, right: false }
      : { direction: 'vertical', top: false, bottom: false },
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const SCROLL_EPSILON = 4;

    const checkScroll = () => {
      if (direction === 'horizontal') {
        const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
        const rightGap = container.scrollWidth - (container.scrollLeft + container.clientWidth);
        const hasScroll = maxScrollLeft > SCROLL_EPSILON;
        const isAtLeft = container.scrollLeft <= SCROLL_EPSILON;
        const isAtRight = rightGap <= SCROLL_EPSILON;

        setShowGradient({
          direction: 'horizontal',
          left: hasScroll && !isAtLeft,
          right: hasScroll && !isAtRight,
        });
      } else {
        const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
        const bottomGap = container.scrollHeight - (container.scrollTop + container.clientHeight);
        const hasScroll = maxScrollTop > SCROLL_EPSILON;
        const isAtTop = container.scrollTop <= SCROLL_EPSILON;
        const isAtBottom = bottomGap <= SCROLL_EPSILON;

        setShowGradient({
          direction: 'vertical',
          top: hasScroll && !isAtTop,
          bottom: hasScroll && !isAtBottom,
        });
      }
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(container);
    if (container.firstElementChild instanceof Element) {
      resizeObserver.observe(container.firstElementChild);
    }

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      resizeObserver.disconnect();
    };
  }, [direction]);

  const showV_Gradient = {
    ...(showGradient.direction === 'vertical' && {
      top: showGradient.top,
      bottom: showGradient.bottom,
    }),
  };
  const showH_Gradient = {
    ...(showGradient.direction === 'horizontal' && {
      left: showGradient.left,
      right: showGradient.right,
    }),
  };

  return { showV_Gradient, showH_Gradient, containerRef } as const;
};

export default useScrollable;
