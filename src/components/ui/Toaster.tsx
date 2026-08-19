import { Icon } from '@iconify/react';
import { type ComponentProps, useCallback, useEffect, useRef, useState } from 'react';

import { TOAST_TYPE } from '@/constants/common.constants';
import useToastStore from '@/stores/toast.store';
import type { IClassName } from '@/types/component.type';
import type { TToast, TToastItem } from '@/types/store.type';

import Button from './Button';

const CircularProgress = ({ progress, ...props }: { progress: number } & ComponentProps<'svg'>) => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.15}
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 12 12)"
      />

      <text
        x="12"
        y="12"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="6"
        fontWeight="500"
        fill="currentColor"
      >
        {progress}%
      </text>
    </svg>
  );
};

const cardConfig = (type: TToast['type']) => {
  switch (type) {
    case TOAST_TYPE.success:
      return { iconName: 'solar:check-circle-linear', rgb: 'var(--primary-green-rgb)' };
    case TOAST_TYPE.error:
      return { iconName: 'solar:danger-triangle-linear', rgb: 'var(--primary-red-rgb)' };
    case TOAST_TYPE.warning:
      return { iconName: 'solar:danger-triangle-linear', rgb: 'var(--primary-yellow-rgb)' };
    case TOAST_TYPE.progress:
      return { iconName: '', rgb: 'var(--primary-rgb)' };
    case TOAST_TYPE.loading:
      return { iconName: 'quill:loading-spin', rgb: 'var(--primary-rgb)' };
    case TOAST_TYPE.default:
    case TOAST_TYPE.custom:
    default:
      return { iconName: 'solar:info-circle-outline', rgb: 'var(--primary-rgb)' };
  }
};

export const Toaster = (props: TToastItem & IClassName) => {
  const {
    className = '',
    type,
    icon,
    buttonProps,
    isClosable = true,
    autoClose = true,
    closeTimer = 5000,
  } = props;

  const remove = useToastStore((s) => s.remove);

  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resolvedAutoClose =
    TOAST_TYPE.loading === type || TOAST_TYPE.progress === type ? false : autoClose;
  const resolvedIsClosable =
    TOAST_TYPE.loading === type || TOAST_TYPE.progress === type ? false : isClosable;

  const config = cardConfig(type);

  const handleClose = useCallback(() => {
    setVisible(false);

    timeoutRef.current = setTimeout(() => {
      setMounted(false);
      remove(props.id);
    }, 300);
  }, [remove, props.id]);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setVisible(true);
    }, 50);

    let autoTimer: ReturnType<typeof setTimeout> | null = null;

    if (resolvedAutoClose) {
      autoTimer = setTimeout(() => {
        handleClose();
      }, closeTimer);
    }

    return () => {
      clearTimeout(enterTimer);
      if (autoTimer) clearTimeout(autoTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resolvedAutoClose, closeTimer, handleClose]);

  if (!mounted) return null;

  const isCustom = type === TOAST_TYPE.custom;

  return (
    <div
      className={`rounded-xl border-2 transition-all duration-300 ease-in-out ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${className}`}
      style={{
        borderColor: `rgba(${config.rgb}, 0.2)`,
        boxShadow: `0 10px 10px 0px rgba(${config.rgb}, 0.1)`,
      }}
    >
      <div className="bg-secondary-invert flex w-full items-center gap-2 rounded-[10.25px] p-1.5 md:p-2.5 lg:p-3 [&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:md:size-6 [&>svg]:lg:size-7">
        {icon ??
          (type === TOAST_TYPE.progress ? (
            <CircularProgress
              progress={props.progress}
              style={{ strokeColor: `rgb(${config.rgb})` }}
            />
          ) : (
            <Icon
              icon={config.iconName}
              className={type === TOAST_TYPE.loading ? 'animate-spin' : ''}
              style={{ color: `rgb(${config.rgb})` }}
            />
          ))}

        <div className="flex flex-1 items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            {!isCustom && 'title' in props && (
              <p
                className="line-clamp-1 text-xs font-semibold md:text-sm"
                style={{ color: `rgb(${config.rgb})` }}
              >
                {props.title}
              </p>
            )}

            {!isCustom && 'description' in props && (
              <p className="text-tertiary line-clamp-2 text-[9px]/3 whitespace-pre-line md:text-xs">
                {props.description}
              </p>
            )}
            {isCustom && 'children' in props && props.children}
          </div>

          {buttonProps && type !== TOAST_TYPE.loading && type !== TOAST_TYPE.progress && (
            <Button
              {...buttonProps}
              content={buttonProps.content ?? 'Try Again'}
              pattern={buttonProps.pattern ?? 'secondary'}
              className={`w-fit! rounded-md! px-2! py-1! pt-1.5! text-[10px] whitespace-nowrap md:text-xs! ${buttonProps.className ?? ''}`}
            />
          )}
        </div>

        {resolvedIsClosable && (
          <Icon
            icon="lucide:x"
            className="text-primary cursor-pointer md:size-5"
            onClick={handleClose}
          />
        )}
      </div>
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="base:max-w-sm fixed right-2 bottom-2 z-999 flex w-full max-w-xs flex-col gap-2 sm:max-w-md md:right-4 md:bottom-4 md:max-w-lg lg:right-8 lg:bottom-8 lg:max-w-xl">
      {toasts.map((toast) => (
        <Toaster key={toast.id} {...toast} id={toast.id} />
      ))}
    </div>
  );
};

export default ToastContainer;
