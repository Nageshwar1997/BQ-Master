import { type ChangeEvent, useEffect, useRef } from 'react';

import type { ITextArea } from '@/types/input.type';

import { InputError, InputLabel } from './children';

const Textarea = ({
  label,
  register,
  className = '',
  error,
  containerClassName = '',
  textAreaProps,
  needRef = false,
}: ITextArea) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (textAreaProps.disabled) return;
    textAreaProps.onChange?.(event);
    void register?.onChange(event);
  };

  useEffect(() => {
    if (needRef) {
      inputRef.current?.focus();
    }
  }, [needRef]);

  return (
    <div className={`flex max-w-full min-w-0 flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative">
        <InputLabel htmlFor={textAreaProps.name}>{label}</InputLabel>
        <div
          className={`border-primary/10 bg-smoke-eerie overflow-hidden rounded-lg border ${className}`}
        >
          {/* Textarea */}
          <textarea
            aria-autocomplete="none"
            {...register}
            {...textAreaProps}
            {...(needRef && { ref: inputRef })}
            id={textAreaProps.id ?? textAreaProps.name}
            onChange={handleChange}
            rows={textAreaProps.rows ?? 5}
            className={`text-primary placeholder:text-primary/30 autofill-effect block w-full resize-y border-none bg-transparent px-3 py-2 text-[13px] leading-normal outline-hidden placeholder:text-[13px] focus:border-none focus:outline-hidden disabled:cursor-not-allowed xl:py-3 ${textAreaProps.className ?? ''}`}
          />
        </div>
      </div>
      <InputError error={error} />
    </div>
  );
};

export default Textarea;
