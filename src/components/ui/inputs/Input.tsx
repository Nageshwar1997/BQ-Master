import { type ChangeEvent, useEffect, useRef } from 'react';

import type { IInput } from '@/types/input.type';

import { InputError, InputIcon, InputLabel } from './children';

const Input = ({
  label = '',
  register,
  className = '',
  error = '',
  containerClassName = '',
  icons,
  inputProps,
  needRef = false,
}: IInput) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (inputProps.disabled) return;
    inputProps.onChange?.(event);
    void register?.onChange(event);
  };

  useEffect(() => {
    if (needRef) inputRef.current?.focus();
  }, [needRef]);

  return (
    <div className={`flex max-w-full min-w-0 flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative">
        <InputLabel htmlFor={inputProps.name}>{label}</InputLabel>
        <div
          className={`border-primary/10 bg-smoke-eerie flex items-center gap-3 overflow-hidden rounded-lg border px-3 ${className}`}
        >
          {/* Left Icon */}
          <InputIcon icon={icons?.left} />
          {/* Input */}
          <input
            aria-autocomplete="none"
            {...register}
            {...inputProps}
            {...(needRef && { ref: inputRef })}
            id={inputProps.id ?? inputProps.name}
            onChange={handleChange}
            onWheel={(event) => {
              if (inputProps.type === 'number') event.currentTarget.blur();
            }}
            className={`text-primary placeholder:text-primary/30 autofill-effect min-w-0 flex-1 border-none bg-transparent py-2 text-[13px] leading-normal outline-hidden placeholder:text-[13px] focus:border-none focus:outline-hidden disabled:cursor-not-allowed xl:py-3 ${inputProps.className ?? ''}`}
          />
          {/* Right Icon */}
          <InputIcon icon={icons?.right} />
        </div>
      </div>
      <InputError error={error} />
    </div>
  );
};

export default Input;
