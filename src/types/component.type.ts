import type { IconProps } from '@iconify/react';
import type {
  ButtonHTMLAttributes,
  ComponentProps,
  JSX,
  ReactElement,
  ReactNode,
  RefObject,
  VideoHTMLAttributes,
} from 'react';

import type { TOAST_TYPE } from '@/constants/common.constants';

import type { TCategory } from './api.type';
import type { TGradientPos, TScrollDirection } from './hook.type';
import type { IOption, TInputIcons } from './input.type';

export interface IClassName {
  className?: string;
}

export interface IContainerClassName {
  containerClassName?: string;
}

export interface IChildren {
  children: ReactNode | ReactElement;
}

export interface IButton extends IClassName {
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'content'>;
  content: IconProps | string;
  pattern: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'transparent';
  leftIcon?: IconProps;
  rightIcon?: IconProps;
}

export interface ILoading extends IClassName {
  text: string;
}

export interface IScrollableGradientContainer extends IClassName, IChildren, IContainerClassName {
  gradientClassNames?: Partial<Record<TGradientPos, string>>;
  direction: TScrollDirection;
}

export interface ILinerGradient extends IClassName {
  position: TGradientPos;
}

export interface IGradientText extends IClassName, Partial<IChildren> {
  text: string;
  type: 'accent' | 'silver';
  path?: string;
}

export interface IResend extends IClassName {
  label: string;
  count: number;
  onResend?: () => void;
}

export interface ITitleDescription {
  title: string | ReactNode;
  description?: string | ReactNode;
}

export interface ITooltip extends IClassName, IChildren, ITitleDescription, IContainerClassName {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  required?: boolean;
}

type TBaseStatus = ITitleDescription & IClassName & { divider?: boolean };

type TErrorStatus = TBaseStatus & { status: 'error' };
type TEmptyStatus = TBaseStatus & { status: 'empty' };
type TSuccessStatus = TBaseStatus & { status: 'success' };
type TLoadingStatus = IClassName & { status: 'loading'; text?: string };

export type TApiStatus = TErrorStatus | TEmptyStatus | TSuccessStatus | TLoadingStatus;

export interface IModalWrapper extends IClassName, IChildren {
  isOpen: boolean;
  onClose: () => void;
  containerProps?: JSX.IntrinsicElements['div'];
  header?: { title?: string; showCloseIcon?: boolean };
  closeOnOutsideClick?: boolean;
  style?: ComponentProps<'div'>['style'];
}

export interface IVideoPlayer extends IClassName {
  videoProps: VideoHTMLAttributes<HTMLVideoElement>;
  ref?: RefObject<HTMLVideoElement | null>;
  showPosterOnly?: boolean;
}

export interface IBreadcrumb extends IClassName {
  customPath?: string;
  customPaths?: string[];
}

export interface ICatModal {
  category: TCategory;
  mainCatId?: string;
}

export interface ICatActionHandle {
  onEdit: (data: ICatModal) => void;
  onDelete: (categoryId: string) => void;
}

export type TCatTable = ICatActionHandle & ICatModal;

interface TCustomConfirmModal extends IChildren {
  type: typeof TOAST_TYPE.custom;
  title?: never;
  description?: never;
  buttons?: Partial<Record<'left' | 'right', Omit<IButton, 'pattern'>>>;
}

interface IDefaultConfirmModal {
  type:
    | typeof TOAST_TYPE.success
    | typeof TOAST_TYPE.error
    | typeof TOAST_TYPE.warning
    | typeof TOAST_TYPE.default;
  children?: never;
  title: string;
  description?: string;
  buttons: Partial<Record<'left' | 'right', Omit<IButton, 'pattern'>>>;
}

export type TConfirmModal = (TCustomConfirmModal | IDefaultConfirmModal) & {
  modalProps?: Omit<IModalWrapper, 'children' | 'closeOnOutsideClick'>;
};

export type TMediaResource = 'image' | 'video';

export interface TMediaOption {
  type: TMediaResource;
  url: string;
}

export interface IVideo {
  videoProps: VideoHTMLAttributes<HTMLVideoElement>;
  ref?: RefObject<HTMLVideoElement | null>;
}

export interface IMediaCarousel
  extends IClassName, Pick<IScrollableGradientContainer, 'gradientClassNames'> {
  media: TMediaOption[];
  selected?: number | null;
  onClick: (index: number) => void;
  thumbnailRefs?: RefObject<(HTMLDivElement | null)[]>;
  handleRemove?: (index: number) => void;
}

export interface IMediaCarouselWithParent
  extends
    IClassName,
    Partial<Pick<IVideo, 'videoProps'>>,
    Pick<IMediaCarousel, 'media' | 'selected' | 'handleRemove'> {
  needButtonControls?: boolean;
}

export interface IQuillImageRef {
  id: string;
  file: File;
  blobUrl: string;
}

export interface IPageWrapper extends IChildren, IContainerClassName, IClassName {
  navbar?: {
    components?: ReactElement[];
    buttons?: Partial<IButton & IChildren>[];
  } & Partial<IChildren>;
}

export interface IDropdownOptions extends IClassName {
  options: IOption[];
  selected: string;
  onChange: (opt: IOption) => void;
  onSelect?: () => void;
}

export interface IDropdown extends IClassName, Partial<Pick<IDropdownOptions, 'options'>> {
  title: string | ReactElement;
  icons?: TInputIcons;
  children: ReactElement<{ onSelect?: () => void }>;
  closeOnOutsideClick?: boolean;
  isAbsolute?: boolean;
  showShadow?: boolean;
  closeOnOptionClick?: boolean;
  isRounded?: boolean;
  defaultOpen?: boolean;
}

export interface INavbar extends IClassName, Partial<IChildren> {
  components?: ReactNode[];
  buttons?: Partial<IButton & IChildren>[];
}
