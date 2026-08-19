import type { TProductDescriptionAndContentZodSchema } from '@beautinique/frontend-types';
import type { AxiosProgressEvent } from 'axios';
import type Quill from 'quill';
import type { RefObject } from 'react';

import type { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';

import type { IQuillImageRef } from './component.type';

export type TAddProductStepNumber = keyof typeof ADD_PRODUCT_FORM_ID_MAP;

export type TAddProductFormId = (typeof ADD_PRODUCT_FORM_ID_MAP)[TAddProductStepNumber];

export type TProductContentFields = keyof Omit<
  TProductDescriptionAndContentZodSchema,
  'shortDescription' | 'step'
>;

export type TProductQuillRefs = Record<TProductContentFields, RefObject<Quill | null>>;

export type TProductQuillImageRefs = Record<TProductContentFields, RefObject<IQuillImageRef[]>>;

export interface TFormDataProgress {
  data: FormData;
  onUploadProgress?: (event: AxiosProgressEvent) => void;
}
