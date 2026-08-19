import type { IconProps } from '@iconify/react';
import type Quill from 'quill';
import type { ToolbarProps } from 'quill/modules/toolbar';
import type {
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  RefObject,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import type {
  FieldPath,
  FieldValues,
  UseFormRegisterReturn,
  UseFormSetValue,
} from 'react-hook-form';

import type {
  IClassName,
  IContainerClassName,
  IQuillImageRef,
  ITitleDescription,
  ITooltip,
} from './component.type';

export type TInputIcon = IconProps | ReactElement;

export type TInputIcons = Partial<Record<'left' | 'right', TInputIcon>>;

export interface IBaseInput extends IClassName, IContainerClassName {
  needRef?: boolean;
  icons?: TInputIcons;
  register?: UseFormRegisterReturn;
  label?: string;
  error?: string;
}

export interface IInput extends IBaseInput {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
}

export interface ICheckbox extends Omit<IBaseInput, 'needRef' | 'icons' | 'label'> {
  content?: string | ReactElement;
  checkboxProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;
  tooltipRequired?: boolean;
  tooltip?: Pick<ITooltip, 'required' | 'description' | 'title' | 'placement'>;
}

export interface IOption {
  label: string | ReactNode;
  value: string;
}

export interface IRadio extends IClassName, IContainerClassName, Pick<IBaseInput, 'error'> {
  value: string;
  onChange: (value: string) => void;
  options: IOption[];
}

export interface ISelectOption extends Pick<IOption, 'label'> {
  value: IOption['value'] | number;
  disabled?: boolean;
}

export interface ISelect extends Omit<IBaseInput, 'needRef' | 'register'> {
  selectProps: Pick<SelectHTMLAttributes<HTMLSelectElement>, 'disabled'> &
    Pick<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> & {
      value: ISelectOption['value'];
      onChange: (value: ISelectOption['value']) => void;
    };
  options: ISelectOption[];
  optionsClassName?: string;
  position?: 'top' | 'bottom';
}

export interface IHierarchySelectOption extends ISelectOption {
  searchLabel?: string;
  children?: IHierarchySelectOption[];
}

export interface IHierarchySelect extends Omit<ISelect, 'options'> {
  inputProps?: IInput['inputProps'];
  options: IHierarchySelectOption[];
}

export interface IHierarchySelectTreeNode {
  node: IHierarchySelectOption;
  level?: number;
  value?: ISelectOption['value'];
  expanded: Record<ISelectOption['value'], boolean>;
  onToggle: (value: ISelectOption['value']) => void;
  onSelect: (value: ISelectOption['value']) => void;
  // When true (an active search), every branch renders expanded regardless
  // of `expanded` - `filterTree` already pruned away anything that isn't a
  // match or an ancestor of one, so everything left over is worth showing.
  forceExpanded?: boolean;
}

export interface IColorInput
  extends
    Pick<IBaseInput, 'className' | 'containerClassName' | 'error' | 'label'>,
    Pick<IInput['inputProps'], 'disabled' | 'placeholder'>,
    Pick<ISelect, 'position'> {
  value?: string;
  onChange?: (value: string) => void;
}

export interface IFileInput extends Omit<IBaseInput, 'error' | 'register'> {
  fileInputProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> & {
    value?: (File | string) | (File | string)[];
  };
  errors?: IBaseInput['error'][];
  handleRemove?: (index: number) => void;
  mediaModalClassName?: string;
  mediaCarouselClassName?: string;
}

export interface ITextArea extends Omit<IBaseInput, 'icons'> {
  textAreaProps: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export type TToolbarOption =
  | { header: (1 | 2 | 3 | 4 | 5 | 6 | false)[] }
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | { list: 'ordered' | 'bullet' }
  | { script: 'sub' | 'super' }
  | { indent: '-1' | '+1' }
  | { color: string[] } // can be empty for Quill to auto-generate colors
  | { background: string[] }
  | { align: string[] }
  | { direction: 'rtl' }
  | 'link'
  | 'image'
  | 'video'
  | 'code'
  | 'clean';

export type TQuillToolbar = (TToolbarOption | TToolbarOption[])[];

export interface IToolBarOptions {
  header?: (1 | 2 | 3 | 4 | 5 | 6 | false)[];
  script?: ('sub' | 'super')[];
  indent?: ('-1' | '+1')[];
  color?: boolean;
  background?: boolean;
  align?: boolean;
  direction?: 'rtl';
  text?: ('bold' | 'italic' | 'underline' | 'strike' | 'link')[];
  list?: ('ordered' | 'bullet')[];
  media?: ('image' | 'video' | 'link')[];
  misc?: ('code' | 'clean')[];
}

export interface IQuillInput
  extends
    IClassName,
    Pick<IBaseInput, 'error' | 'label'>,
    Pick<IInput['inputProps'], 'placeholder' | 'disabled'> {
  value?: string;
  needLinkButton?: boolean;
  onChange?: (value: string) => void;
  imagesRef?: RefObject<IQuillImageRef[]>;
  toolbarOptions?: IToolBarOptions;
}

export interface IQuillToolbar extends ToolbarProps {
  handlers: Record<string, (...args: unknown[]) => void>;
}

export interface IQuillImageBlot {
  new (): HTMLElement;
  create(value: unknown): HTMLElement;
  value(node: HTMLElement): unknown;
}

export interface IProcessQuillContent<T extends FieldValues> {
  quillRef: RefObject<Quill | null>;
  imagesRef: RefObject<IQuillImageRef[]>;
  setValue: UseFormSetValue<T>;
  field: FieldPath<T>;
  folder: string;
  toasterInfo?: Partial<ITitleDescription>;
}
