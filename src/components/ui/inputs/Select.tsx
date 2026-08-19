import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import type { ISelect } from '@/types/input.type';

import { InputError, InputIcon, InputLabel } from './children';

interface IDropdownPosition {
  top: number;
  left: number;
  width: number;
}

const Select = ({
  label = '',
  className = '',
  error = '',
  containerClassName = '',
  optionsClassName = '',
  icons,
  selectProps,
  options,
  position = 'bottom',
}: ISelect) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<IDropdownPosition | null>(null);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const selectedOptionRef = useRef<HTMLLIElement | null>(null);

  // The options list is portalled to <body> (see below) so it can escape any
  // ancestor `overflow-hidden`/`overflow-auto` (e.g. a scrollable table). Because
  // of that, `dropdownRef`'s DOM node is no longer a descendant of `containerRef`,
  // so a plain "outside click" check would treat clicks on options as outside
  // clicks and close the menu before the option's own onClick can fire.
  const containerRef = useOutsideClick<HTMLDivElement>(
    (event) => {
      if (dropdownRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    },
    { enabled: isOpen },
  );

  const selected = options.find((opt) => opt.value === selectProps.value);

  const handleToggle = () => {
    if (selectProps.disabled || !options.length) return;
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen && selectedOptionRef.current) {
      selectedOptionRef.current.scrollIntoView({
        block: 'end',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      setDropdownPosition({
        top: position === 'top' ? rect.top : rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, position]);

  return (
    <div
      ref={containerRef}
      className={`flex max-w-full min-w-0 flex-col gap-1.5 ${containerClassName}`}
    >
      <div className="relative" ref={triggerRef}>
        <InputLabel onClick={handleToggle} className="z-2 cursor-pointer">
          {label}
        </InputLabel>
        <div
          className={`border-primary/10 bg-smoke-eerie flex items-center gap-3 overflow-hidden rounded-lg border px-3 ${className}`}
        >
          {/* Left Icon */}
          <InputIcon icon={icons?.left} />
          <div
            className={`text-primary flex flex-1 items-center justify-between gap-0.5 truncate border-none bg-transparent text-[13px] ${selectProps.disabled ? 'cursor-no-drop' : 'cursor-pointer'}`}
            onClick={handleToggle}
          >
            <span
              className={`flex-1 truncate py-2 xl:py-3 first-letter:capitalize ${!selected?.value ? 'text-primary/30' : ''}`}
            >
              {selected?.label ?? selectProps.placeholder}
            </span>
            <Icon
              icon="solar:alt-arrow-down-linear"
              className={`size-4 transition-transform md:size-5 ${
                isOpen ? 'rotate-180' : ''
              } ${selected?.value ? 'text-primary' : 'text-primary/30'}`}
            />
          </div>
          {/* Right Icon */}
          <InputIcon icon={icons?.right} />
        </div>
      </div>
      <InputError error={error} />
      {isOpen &&
        options.length > 0 &&
        dropdownPosition &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`border-primary/10 bg-smoke-eerie fixed z-3 overflow-hidden rounded-lg border shadow-md ${optionsClassName}`}
            style={{
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              ...(position === 'top'
                ? { bottom: window.innerHeight - dropdownPosition.top + 8 }
                : { top: dropdownPosition.top + 8 }),
            }}
          >
            <ul className="flex max-h-60 flex-col gap-0.5 overflow-auto p-1">
              {options.map((option) => {
                const active = selected?.value === option.value;
                return (
                  <li
                    key={option.value}
                    ref={active ? selectedOptionRef : null}
                    className={`hover:bg-primary/5 text-tertiary flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-[13px] ${
                      active ? 'bg-primary/8' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();

                      if (option.disabled || selectProps.disabled) return;
                      selectProps.onChange(active ? '' : option.value || '');
                      setIsOpen(false);
                    }}
                  >
                    <span className="flex-1 text-left text-[13px] first-letter:capitalize">{option.label}</span>
                    {active && (
                      <Icon icon="solar:unread-linear" className="text-primary size-4 md:size-5" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Select;
