import LinearGradient from '@/components/ui/LinearGradient';
import { EMPTY_OBJECT } from '@/constants/common.constants';
import useScrollable from '@/hooks/useScrollable';
import type { IScrollableGradientContainer } from '@/types/component.type';
import type { TGradientPos } from '@/types/hook.type';

const ScrollableGradientContainer = ({
  className = '',
  children,
  containerClassName = '',
  gradientClassNames = EMPTY_OBJECT,
  direction,
}: IScrollableGradientContainer) => {
  const { showH_Gradient, showV_Gradient, containerRef } = useScrollable(direction);

  const isHorizontal = direction === 'horizontal';
  const isVertical = direction === 'vertical';

  const gradients = { ...showH_Gradient, ...showV_Gradient };
  const isScrollable = isVertical
    ? // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      !!(gradients.top || gradients.bottom)
    : // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      !!(gradients.left || gradients.right);

  const gradientKeys = Object.entries(gradients)
    .filter(([, value]) => value)
    .map(([key]) => key as TGradientPos);

  return (
    <div
      className={`relative flex h-full w-full overflow-hidden ${
        isVertical ? 'h-full w-fit flex-col' : ''
      } ${isHorizontal ? 'h-fit w-full flex-row' : ''} ${containerClassName}`}
    >
      {gradientKeys.map((key) => (
        <LinearGradient key={key} position={key} className={gradientClassNames[key]} />
      ))}
      <div
        ref={containerRef}
        className={`relative scroll-smooth ${isVertical ? 'flex-1 overflow-y-auto' : ''} ${isHorizontal ? 'grow overflow-x-auto' : ''} ${className} `}
      >
        <div
          className={`flex h-full w-full gap-2 ${isVertical ? 'min-h-full flex-col' : ''} ${isHorizontal ? 'min-w-full flex-row' : ''} ${
            isScrollable ? 'items-start justify-start' : 'items-center justify-center'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollableGradientContainer;
