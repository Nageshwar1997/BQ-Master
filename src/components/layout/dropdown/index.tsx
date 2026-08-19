import { Icon } from '@iconify/react';
import { cloneElement, isValidElement, useEffect, useRef, useState } from 'react';

import { InputIcon } from '@/components/ui/inputs/children';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import type { IDropdown } from '@/types/component.type';

const Dropdown = ({
  title,
  icons,
  children,
  className = '',
  closeOnOptionClick = false,
  closeOnOutsideClick = false,
  isAbsolute = false,
  showShadow = false,
  isRounded = false,
  options = [],
  defaultOpen = false,
}: IDropdown) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ref = useOutsideClick<HTMLDivElement>(
    () => {
      if (isOpen) setIsOpen(false);
    },
    { enabled: closeOnOutsideClick },
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateHeight = () => {
      if (isOpen) {
        el.style.maxHeight = `${String(el.scrollHeight)}px`;
        el.style.opacity = '1';
      } else {
        el.style.maxHeight = '0px';
        el.style.opacity = '0';
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [isOpen, options]);
  return (
    <div
      className={`flex w-full cursor-pointer flex-col items-start ${
        isAbsolute ? 'relative' : 'static'
      } ${className}`}
      ref={ref}
    >
      <button
        className="bg-primary-invert group flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left transition-colors duration-300 xl:py-3"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        role="button"
      >
        <div className="flex items-center gap-3 transition-all duration-300">
          <InputIcon icon={icons?.left} />
          <span className="text-primary text-sm font-medium whitespace-nowrap">{title}</span>
          <InputIcon icon={icons?.right} />
        </div>
        <Icon
          icon="solar:alt-arrow-down-linear"
          className={`text-primary size-4 transition-transform duration-300 ease-in-out md:size-5 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>
      <div
        ref={containerRef}
        className={`bg-primary-invert max-h-0 w-full overflow-hidden opacity-0 transition-all duration-500 ease-in-out *:px-3 *:py-2 ${
          isAbsolute ? 'absolute inset-x-0 top-full z-10 mt-2' : ''
        } ${
          showShadow
            ? 'shadow-[rgba(var(--primary-rgb),0.08)_0px_4px_16px,rgba(var(--primary-rgb),0.1)_0px_8px_32px]'
            : ''
        } ${isRounded ? 'rounded-lg' : ''}`}
      >
        {isValidElement(children)
          ? cloneElement(children, {
              onSelect: () => {
                if (closeOnOptionClick) setIsOpen(false);
              },
            })
          : children}
      </div>
    </div>
  );
};

export default Dropdown;
