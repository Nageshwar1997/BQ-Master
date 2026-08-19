import { useMemo } from 'react';

import type { ILinerGradient } from '@/types/component.type';

const LinearGradient = ({ className = '', position }: ILinerGradient) => {
  const positionClass = useMemo(() => {
    switch (position) {
      case 'top':
        return 'inset-x-0 top-0 h-10 md:h-20 bg-linear-to-b';
      case 'bottom':
        return 'inset-x-0 bottom-0 h-10 md:h-20 bg-linear-to-t';
      case 'left':
        return 'inset-y-0 left-0 w-10 md:w-20 bg-linear-to-r';
      case 'right':
        return 'inset-y-0 right-0 w-10 md:w-20 bg-linear-to-l';
      default:
        return '';
    }
  }, [position]);

  return (
    <div
      className={`from-primary-invert pointer-events-none absolute z-1 to-transparent ${positionClass} ${className}`}
    />
  );
};

export default LinearGradient;
