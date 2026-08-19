import type { ILoading } from '@/types/component.type';

import LoadingRings from './LoadingRings';

const LoadingPage = ({ text, className = '' }: ILoading) => {
  return (
    <div
      className={`bg-primary-invert/50 fixed inset-0 z-100 flex h-full w-full items-center justify-center ${className}`}
    >
      <LoadingRings text={text} />
    </div>
  );
};

export default LoadingPage;
