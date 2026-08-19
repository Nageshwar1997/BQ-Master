import { Icon } from '@iconify/react';
import { type LabelHTMLAttributes } from 'react';

import type { TInputIcon } from '@/types/input.type';
import { isIconProps } from '@/utils/common.util';

export const InputError = ({ error = '', className = '' }) => {
  if (!error) return null;
  return (
    <p className={`text-red-c flex w-full items-center gap-1 text-start text-[11px] ${className}`}>
      <Icon icon="solar:info-circle-linear" className="mb-0.5 shrink-0" />
      <span className="line-clamp-2 leading-3 whitespace-pre-line first-letter:uppercase">
        {error}
      </span>
    </p>
  );
};

export const InputIcon = ({ icon }: { icon?: TInputIcon }) => {
  if (!icon) return null;

  if (isIconProps(icon)) {
    return <Icon {...icon} className={`shrink-0 ${icon.className ?? ''}`} />;
  }

  return icon;
};

export const InputLabel = (props: LabelHTMLAttributes<HTMLLabelElement>) => {
  if (!props.children) return null;
  return (
    <label
      {...props}
      htmlFor={props.htmlFor ?? ''}
      className={`text-primary/50 border-primary/10 bg-smoke-eerie absolute top-0 left-3 -translate-y-1/2 transform rounded-sm border px-1 py-0.5 pt-1 text-[10px] leading-none md:px-2 ${props.htmlFor ? 'cursor-pointer' : 'cursor-default'} ${props.className ?? ''}`}
    />
  );
};
