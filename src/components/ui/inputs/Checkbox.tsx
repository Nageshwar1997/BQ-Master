import type { ChangeEvent } from 'react';

import type { ICheckbox } from '@/types/input.type';

import Tooltip from '../Tooltip';
import { InputError } from './children';

const Checkbox = ({
  register,
  className = '',
  content,
  checkboxProps,
  containerClassName = '',
  error,
  tooltip,
}: ICheckbox) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (checkboxProps.disabled) return;
    void register?.onChange(e);
    checkboxProps.onChange?.(e);
  };
  return (
    <div className={`flex max-w-full min-w-0 flex-col gap-1.5 ${containerClassName}`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <Tooltip
          title={tooltip?.title}
          description={tooltip?.description}
          placement={tooltip?.placement}
          required={tooltip?.required ?? false}
        >
          <label className="relative inline-block h-6 w-12 shrink-0">
            <input
              type="checkbox"
              className="peer sr-only outline-hidden"
              {...register}
              {...checkboxProps}
              onChange={handleChange}
              id={checkboxProps.id ?? checkboxProps.name}
            />
            <span
              className={`border-primary/10 bg-tertiary-invert peer-checked:border-blue-crayola-c before:bg-silver-duo peer-checked:before:bg-accent-duo absolute inset-0 cursor-pointer rounded-full border transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] peer-checked:shadow-[0_0_10px_rgba(var(--blue-crayola-c-rgb),0.8)] peer-disabled:cursor-not-allowed before:absolute before:top-1/2 before:left-1 before:aspect-square before:h-[70%] before:-translate-y-1/2 before:rounded-full before:transition-all before:duration-400 before:ease-[cubic-bezier(0.23,1,0.32,1)] before:content-[''] peer-checked:before:translate-x-[calc(150%)] ${className}`}
            />
          </label>
        </Tooltip>
        {content && (
          <span className="text-primary/50 text-xs font-medium whitespace-break-spaces sm:text-[13px] md:text-sm">
            {content}
          </span>
        )}
      </div>
      <InputError error={error} />
    </div>
  );
};

export default Checkbox;
