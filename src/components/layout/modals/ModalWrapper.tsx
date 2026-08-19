import { Icon } from '@iconify/react';
import { useEffect } from 'react';

import GradientText from '@/components/ui/GradientText';
import type { IModalWrapper } from '@/types/component.type';

import ScrollableGradientContainer from '../containers/ScrollableGradientContainer';

export const ModalWrapper = ({
  isOpen,
  onClose,
  children,
  containerProps,
  className = '',
  header,
  closeOnOutsideClick = true,
  style,
}: IModalWrapper) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={closeOnOutsideClick ? onClose : undefined}
      {...containerProps}
      className={`bg-primary-invert/50 fixed inset-0 z-100 flex items-center justify-center p-8 backdrop-blur-xs ${
        containerProps?.className ?? ''
      }`}
    >
      <div
        className={`bg-primary-invert border-primary/20 relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl border shadow-lg ${className}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={style}
      >
        {/* HEADER */}
        {!!header && Object.keys(header).length > 0 && (
          <div
            className={`bg-primary-invert z-20 flex max-h-16 items-center ${header.title ? 'border-b-primary/50 sticky inset-x-0 top-0 justify-between border-b px-6 py-4' : 'border-primary/20 shadow-primary/20 absolute top-0 right-0 justify-center rounded-bl-xl border-b border-l shadow-lg'}`}
          >
            {header.title && (
              <h2 className="flex-1 text-center text-lg font-semibold">
                <GradientText text={header.title} type="silver" />
              </h2>
            )}
            {header.showCloseIcon && (
              <button
                type="button"
                aria-label="Close"
                className="group cursor-pointer p-3"
                onClick={onClose}
              >
                <Icon
                  icon="lucide:x"
                  className="text-tertiary group-hover:text-primary size-4 transition-all duration-300 group-hover:scale-110 sm:size-5"
                />
              </button>
            )}
          </div>
        )}
        <ScrollableGradientContainer
          direction="vertical"
          containerClassName="flex-1"
          className="p-4"
          gradientClassNames={{ top: 'h-8!', bottom: 'h-8!' }}
        >
          {children}
        </ScrollableGradientContainer>
      </div>
    </div>
  );
};
