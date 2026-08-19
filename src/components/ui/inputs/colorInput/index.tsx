import './colorInput.css';

import { useState } from 'react';
import { ColorPicker, type IColor, useColor } from 'react-color-palette';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import type { IColorInput } from '@/types/input.type';

import { InputError, InputIcon, InputLabel } from '../children';

const ColorInput = ({
  label,
  value,
  error,
  disabled,
  placeholder,
  onChange,
  containerClassName = '',
  className = '',
  position = 'bottom',
}: IColorInput) => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useColor(value ?? '#000000');

  const containerRef = useOutsideClick<HTMLDivElement>(
    () => {
      setIsOpen(false);
    },
    { enabled: isOpen },
  );

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleChange = (col: IColor) => {
    if (disabled) return;
    setColor(col);
    onChange?.(col.hex);
  };

  return (
    <div
      ref={containerRef}
      className={`flex max-w-full min-w-0 flex-col gap-1.5 ${containerClassName}`}
    >
      <div className="relative">
        <InputLabel onClick={handleToggle} className="z-2">
          {label}
        </InputLabel>
        <div
          className={`text-primary border-primary/10 bg-smoke-eerie flex flex-1 items-center justify-between gap-1 truncate rounded-lg border px-3 text-[13px] ${className}`}
        >
          <div
            className={`border-primary/10 ${disabled ? 'cursor-no-drop' : 'cursor-pointer'} rounded border p-0.5 xl:p-1`}
            style={{ backgroundColor: color.hex }}
            onClick={handleToggle}
          >
            <InputIcon
              icon={{
                icon: 'mage:color-picker-fill',
                className: '[&>path]:last:stroke-primary [&>path]:last:fill-primary-invert',
              }}
            />
          </div>
          <span className={`flex-1 truncate py-2 xl:py-3 ${!value ? 'text-primary/30' : ''}`}>
            {value ? value.toUpperCase() : placeholder}
          </span>
          <InputIcon
            icon={{
              icon: isOpen ? 'pepicons-pop:color-picker-off' : 'pepicons-pop:color-picker',
              className: disabled ? 'cursor-no-drop' : 'cursor-pointer',
              onClick: handleToggle,
            }}
          />
          {isOpen && (
            <div
              className={`border-primary/10 bg-smoke-eerie absolute left-0 z-3 w-full overflow-hidden rounded-lg border shadow-md ${
                position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
              }`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ColorPicker
                hideInput={['hsv']}
                color={color}
                onChange={handleChange}
                onChangeComplete={!disabled ? setColor : undefined}
              />
            </div>
          )}
        </div>
      </div>
      <InputError error={error} />
    </div>
  );
};

export default ColorInput;
