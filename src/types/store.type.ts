import type { AxiosProgressEvent } from 'axios';
import type { ReactNode } from 'react';

import type { TOAST_TYPE } from '@/constants/common.constants';

import type { IUser } from './api.type';
import type { IButton, IClassName, ITitleDescription } from './component.type';

interface IBaseToast extends IClassName {
  icon?: ReactNode;
  buttonProps?: Partial<IButton>;
}

interface IToastClosable {
  isClosable?: boolean;
  autoClose?: boolean;
  closeTimer?: number;
}

export interface IDefaultToast extends IBaseToast, IToastClosable, ITitleDescription {
  type:
    | typeof TOAST_TYPE.success
    | typeof TOAST_TYPE.error
    | typeof TOAST_TYPE.warning
    | typeof TOAST_TYPE.default;
}

export interface ICustomToast extends IBaseToast, IToastClosable {
  type: typeof TOAST_TYPE.custom;
  children: ReactNode;
  title?: never;
  description?: never;
}

export interface ILoadingToast extends IBaseToast, ITitleDescription {
  type: typeof TOAST_TYPE.loading;
  isClosable?: never;
  autoClose?: never;
  closeTimer?: never;
}

export interface IProgressToast extends Omit<ILoadingToast, 'type'> {
  type: typeof TOAST_TYPE.progress;
  progress: number;
}

export type TToast = IDefaultToast | ICustomToast | ILoadingToast | IProgressToast;

export type TToastItem = TToast & { id: string };

export interface IToastStore {
  toasts: TToastItem[];
  add: (toast: TToast) => string;
  update: { progress: (id: string, progress: number) => void };
  remove: (id: string) => void;
}

export type TProgressToastOptions<T> = ITitleDescription & {
  request: (onProgress: (event: AxiosProgressEvent) => void) => Promise<T>;
};

export type TTheme = 'light' | 'dark';

export interface IThemeStore {
  theme: TTheme;
  toggleTheme: () => void;
}

export interface IUserStore {
  user: IUser | null;
  authenticated: boolean;
  setUser: (user: IUser | null) => void;
}

type TActionFn = () => void | Promise<void>;

export interface IActionItem {
  id: string;
  fn: TActionFn;
  retries: number;
  maxRetries: number;
}

export interface IActionsStore {
  actions: IActionItem[];
  addAction: (fn: TActionFn, options?: { maxRetries?: number }) => string;
  removeAction: (id: string) => void;
  clearActions: () => void;
  runNextAction: () => Promise<void>;
  runAllActions: () => Promise<void>;
}
