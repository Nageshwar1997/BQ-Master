import { LOADING_RINGS_DATA } from '@/constants/common.constants';
import type { ILoading } from '@/types/component.type';

import LoadingText from './LoadingText';

const LoadingRings = ({ className = '', text }: ILoading) => {
  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`}>
      <div className="relative flex flex-col items-center">
        <div className="relative h-[20vmin] w-[20vmin]">
          {LOADING_RINGS_DATA.map((ring, index) => (
            <div
              key={index}
              className="absolute inset-0 animate-[ring-spin_2s_linear_infinite] rounded-full border-solid shadow-[0_0_10px_rgb(var(--primary-rgb),0.15)]"
              style={{
                ['--rx' as string]: `${String(ring.rotation.rx)}deg`,
                ['--ry' as string]: `${String(ring.rotation.ry)}deg`,
                ['--z' as string]: `${String(ring.rotation.z)}deg`,
                borderColor: ring.border.color,
                [ring.border.side]: '0.6vmin',
                animationDelay: `${String(index * -0.5)}s`,
              }}
            />
          ))}
        </div>
        <LoadingText text={text} className="mt-[2vmin]" />
      </div>
    </div>
  );
};

export default LoadingRings;
