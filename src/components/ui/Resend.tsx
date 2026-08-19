import { useEffect, useState } from 'react';

import type { IResend } from '@/types/component.type';

import GradientText from './GradientText';

const Resend = ({ onResend, count, label, className = '' }: IResend) => {
  const [counter, setCounter] = useState(count);
  const isCounting = counter > 0;

  useEffect(() => {
    if (!isCounting) return;

    const timer = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isCounting]);

  const handleResend = () => {
    if (counter > 0) return;

    onResend?.();
    setCounter(count); // reset timer after resend
  };

  return (
    <p className={`space-x-2 ${className}`}>
      <GradientText text={label} type="silver" className="text-xs sm:text-sm" />
      {counter > 0 ? (
        <span className="text-muted text-xs sm:text-sm">
          <GradientText text="Resend in" type="silver" />{' '}
          <GradientText text={`${String(counter)}s`} type="accent" className="font-semibold" />
        </span>
      ) : (
        <button onClick={handleResend} className="cursor-pointer" type="button">
          <GradientText type="accent" text="Resend" className="text-xs font-semibold sm:text-sm" />
        </button>
      )}
    </p>
  );
};

export default Resend;
