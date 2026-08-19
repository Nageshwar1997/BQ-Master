import type { IconProps } from '@iconify/react';
import type { CSSProperties } from 'react';

import { TOAST_TYPE, TOOLTIP_GAP, VIDEO_PLACEHOLDER } from '@/constants/common.constants';
import useToastStore from '@/stores/toast.store';
import type { IButton, ITooltip } from '@/types/component.type';
import type {
  ICustomToast,
  IDefaultToast,
  ILoadingToast,
  IProgressToast,
  TProgressToastOptions,
} from '@/types/store.type';

export const getButtonCss = (pattern: IButton['pattern']) => {
  switch (pattern) {
    case 'primary':
      return 'text-white bg-sky-blue-burst shadow-primary-btn hover:shadow-primary-btn-hover';
    case 'secondary':
      return 'text-secondary-invert bg-secondary shadow-secondary-btn hover:shadow-secondary-btn-hover';
    case 'tertiary':
      return 'text-tertiary-invert bg-tertiary shadow-tertiary-btn hover:shadow-tertiary-btn-hover';
    case 'outline':
      return 'text-primary border border-primary shadow-outline-btn hover:shadow-outline-btn-hover';
    case 'transparent':
    default:
      return 'shadow-inner shadow-primary/20 hover:shadow-primary/30 bg-transparent border border-primary/30 text-secondary rotate-180 [&>span]:-rotate-180';
  }
};

export const getTooltipPosition = (
  rect: DOMRect,
  placement: NonNullable<ITooltip['placement']>,
): CSSProperties => {
  switch (placement) {
    case 'bottom':
      return { top: rect.bottom, left: rect.left + rect.width / 2 };
    case 'right':
      return { top: rect.top + rect.height / 2, left: rect.right };
    case 'left':
      return { top: rect.top + rect.height / 2, left: rect.left };
    case 'top':
    default:
      return { top: rect.top, left: rect.left + rect.width / 2 };
  }
};

export const getTooltipTransform = (
  placement: NonNullable<ITooltip['placement']>,
  isVisible: boolean,
) => {
  const gap = String(isVisible ? TOOLTIP_GAP : 0);

  switch (placement) {
    case 'bottom':
      return `translate(-50%, ${gap}px)`;
    case 'right':
      return `translate(${gap}px, -50%)`;
    case 'left':
      return `translate(calc(-100% - ${gap}px), -50%)`;
    case 'top':
    default:
      return `translate(-50%, calc(-100% - ${gap}px))`;
  }
};

export const getTooltipArrowCss = (placement: NonNullable<ITooltip['placement']>) => {
  switch (placement) {
    case 'bottom':
      return 'after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-b-silver-jet-2';
    case 'right':
      return 'after:top-1/2 after:right-full after:-translate-y-1/2 after:border-r-silver-jet-2';
    case 'left':
      return 'after:top-1/2 after:left-full after:-translate-y-1/2 after:border-l-silver-jet-2';
    case 'top':
    default:
      return 'after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-silver-jet-2';
  }
};

const { add, update, remove } = useToastStore.getState();
export const toaster = {
  success: (data: Omit<IDefaultToast, 'type'>) => add({ ...data, type: TOAST_TYPE.success }),
  error: (data: Omit<IDefaultToast, 'type'>) => add({ ...data, type: TOAST_TYPE.error }),
  warning: (data: Omit<IDefaultToast, 'type'>) => add({ ...data, type: TOAST_TYPE.warning }),
  loading: (data: Omit<ILoadingToast, 'type'>) => add({ ...data, type: TOAST_TYPE.loading }),
  custom: (data: ICustomToast) => add(data),
  progress: {
    start: (data: Omit<IProgressToast, 'type'>) => add({ ...data, type: TOAST_TYPE.progress }),
    update: (toastId: string, progress: number) => {
      update.progress(toastId, progress);
    },
    end: (toastId: string) => {
      remove(toastId);
    },
  },
  remove: (toastId: string) => {
    remove(toastId);
  },
};

export const isDeepEqual = <T>(
  obj1: T,
  obj2: T,
  options?: { ignoreValues?: unknown[] },
): boolean => {
  const ignoreValues = options?.ignoreValues ?? [];

  const shouldIgnore = (value: unknown) =>
    ignoreValues.some((ignored) => Object.is(ignored, value));

  if (obj1 === obj2) return true;

  // Date
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }

  // File
  if (obj1 instanceof File && obj2 instanceof File) {
    return (
      obj1.name === obj2.name &&
      obj1.size === obj2.size &&
      obj1.type === obj2.type &&
      obj1.lastModified === obj2.lastModified
    );
  }

  // Set
  if (obj1 instanceof Set && obj2 instanceof Set) {
    if (obj1.size !== obj2.size) return false;

    const arr1 = [...obj1];
    const arr2 = [...obj2];

    return arr1.every((item, index) => isDeepEqual(item, arr2[index], options));
  }

  // Map
  if (obj1 instanceof Map && obj2 instanceof Map) {
    if (obj1.size !== obj2.size) return false;

    for (const [key, value] of obj1.entries()) {
      if (!obj2.has(key)) return false;

      if (!isDeepEqual(value, obj2.get(key), options)) {
        return false;
      }
    }

    return true;
  }

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const isArray1 = Array.isArray(obj1);
  const isArray2 = Array.isArray(obj2);

  if (isArray1 !== isArray2) return false;

  if (isArray1 && isArray2) {
    if (obj1.length !== obj2.length) return false;

    return obj1.every((item, index) => isDeepEqual(item, obj2[index], options));
  }

  const keys1 = Object.keys(obj1).filter(
    (key) => !shouldIgnore(obj1[key as keyof T]),
  ) as (keyof T)[];

  const keys2 = Object.keys(obj2).filter(
    (key) => !shouldIgnore(obj2[key as keyof T]),
  ) as (keyof T)[];

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (shouldIgnore(value1) && shouldIgnore(value2)) {
      return true;
    }

    return isDeepEqual(value1, value2, options);
  });
};

function getPosterFromBlobVideo(blobVideoUrl: string, timeInSeconds = 0): Promise<string> {
  return new Promise((resolve) => {
    let posterCreated = false;
    let isCancelled = false;

    const video = document.createElement('video');
    video.src = blobVideoUrl;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;

    video.addEventListener('loadeddata', () => {
      if (!isCancelled) video.currentTime = timeInSeconds;
    });

    video.addEventListener('seeked', () => {
      if (isCancelled) return;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(VIDEO_PLACEHOLDER);
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      posterCreated = true;
      resolve(canvas.toDataURL('image/png'));
      video.src = '';
    });

    video.addEventListener('error', () => {
      if (!posterCreated && !isCancelled) {
        resolve(VIDEO_PLACEHOLDER); // no console.error to avoid noise
      }
    });

    // Cancel function for cleanup
    return () => {
      isCancelled = true;
      video.src = '';
    };
  });
}

export function convertVideoToPoster(videoUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (!videoUrl) {
      resolve(VIDEO_PLACEHOLDER);
      return;
    }

    try {
      // Case 1: Cloudinary URL → instant
      if (videoUrl.includes('/upload/')) {
        const [base = '', versionAndPath = ''] = videoUrl.split('/upload/');
        const cleanedPath = versionAndPath.replace(/^.*?(\/v\d+)/, '$1');
        const posterPath = cleanedPath.replace(/\.(mp4|webm|mov|mkv|ogg|m3u8)$/, '.webp');
        resolve(`${base}/upload/so_0${posterPath}`);
        return;
      }

      // Case 2: Blob URL or direct video file → async extract
      if (videoUrl.startsWith('blob:') || /\.(mp4|webm|ogg|m3u8|mov)$/i.test(videoUrl)) {
        getPosterFromBlobVideo(videoUrl)
          .then((poster) => {
            resolve(poster || VIDEO_PLACEHOLDER);
          })
          .catch(() => {
            resolve(VIDEO_PLACEHOLDER);
          });
        return;
      }

      // Fallback
      resolve(VIDEO_PLACEHOLDER);
    } catch (error) {
      console.error('Failed to create poster URL', error);
      resolve(VIDEO_PLACEHOLDER);
    }
  });
}

export const formatINRCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);

export const withProgressToast = async <T>({
  title,
  description,
  request,
}: TProgressToastOptions<T>): Promise<T> => {
  const toastId = toaster.progress.start({ title, description, progress: 0 });

  try {
    const response = await request((event) => {
      if (!event.total) return;

      toaster.progress.update(toastId, Math.round((event.loaded * 100) / event.total));
    });

    toaster.progress.update(toastId, 100);

    return response;
  } finally {
    toaster.progress.end(toastId);
  }
};

export const formatDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(date));
};

export const isIconProps = (value: unknown): value is IconProps => {
  return typeof value === 'object' && value !== null && 'icon' in value;
};

/* ========== NULL CHECK FUNCTION ========== */
export const isNull = (value: unknown): value is null => value === null;

/* ========== NULL CHECK FUNCTION ========== */
export const isUndefined = (value: unknown): value is undefined => value === undefined;

/* ========== NULL/UNDEFINED CHECK FUNCTION ========== */
export const isNullOrUndefined = (value: unknown): value is null | undefined => {
  return isNull(value) || isUndefined(value);
};
