import { VARIANT_TYPES, VARIANT_TYPES_MAP } from '@beautinique/frontend-constants';

import type { TQuillToolbar } from '@/types/input.type';

export const PASSWORD_KEYS = ['password', 'confirmPassword'];

const NAME_DATA = { type: 'text', autoComplete: 'given-name' } as const;

export const EMAIL_INPUT_DATA = {
  name: 'email',
  label: 'Email',
  type: 'text',
  autoComplete: 'email',
  placeholder: 'Enter your email',
} as const;

export const OTP_INPUT_DATA = {
  label: 'OTP',
  name: 'otp',
  type: 'number',
  autoComplete: 'tel',
  placeholder: 'Enter your OTP',
} as const;

const FIRST_NAME_INPUT_DATA = {
  ...NAME_DATA,
  name: 'firstName',
  label: 'First Name',
  placeholder: 'Enter first name',
} as const;

const LAST_NAME_INPUT_DATA = {
  ...NAME_DATA,
  name: 'lastName',
  label: 'Last Name',
  placeholder: 'Enter last name',
} as const;

const PHONE_NUMBER_INPUT_DATA = {
  name: 'phoneNumber',
  label: 'Phone Number',
  type: 'number',
  autoComplete: 'tel',
  placeholder: 'Enter your number',
} as const;

const PASSWORD_INPUT_DATA = {
  name: 'password',
  label: 'Password',
  type: 'password',
  autoComplete: 'current-password',
  placeholder: 'Enter your password',
} as const;

export const LOGIN_INPUT_MAP_DATA = [
  EMAIL_INPUT_DATA,
  PHONE_NUMBER_INPUT_DATA,
  PASSWORD_INPUT_DATA,
] as const;

export const PASSWORDS_INPUT_MAP_DATA = [
  PASSWORD_INPUT_DATA,
  {
    ...PASSWORD_INPUT_DATA,
    name: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Reenter password',
  },
] as const;

export const CHANGE_PASSWORD_INPUT_MAP_DATA = [
  {
    ...PASSWORD_INPUT_DATA,
    name: 'currentPassword',
    label: 'Current Password',
    placeholder: 'Enter current password',
  },
  {
    ...PASSWORD_INPUT_DATA,
    label: 'New Password',
    placeholder: 'Enter new password',
  },
  {
    ...PASSWORD_INPUT_DATA,
    name: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Reenter password',
  },
] as const;

export const REGISTER_INPUT_MAP_DATA = [
  FIRST_NAME_INPUT_DATA,
  LAST_NAME_INPUT_DATA,
  PHONE_NUMBER_INPUT_DATA,
  ...PASSWORDS_INPUT_MAP_DATA,
] as const;

export const PRODUCT_BASIC_INFO_INPUT_MAP_DATA = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    autoComplete: 'given-name',
    placeholder: 'Enter product title',
  },
  {
    name: 'brand',
    label: 'Brand',
    type: 'text',
    autoComplete: 'given-name',
    placeholder: 'Enter product brand',
  },
  {
    name: 'originalPrice',
    label: 'Original Price',
    type: 'number',
    autoComplete: 'tel',
    placeholder: 'Enter product original price',
  },
  {
    name: 'sellingPrice',
    label: 'Selling Price',
    type: 'number',
    autoComplete: 'tel',
    placeholder: 'Enter product selling price',
  },
] as const;

export const PRODUCT_CATEGORIES_SELECT_MAP_DATA = [
  {
    name: 'l1Category',
    label: 'Main category',
    placeholder: 'Select (L1) main category',
  },
  {
    name: 'l2Category',
    label: 'Sub-category',
    placeholder: 'Select (L2) sub-category',
  },
  {
    name: 'l3Category',
    label: 'Product category',
    placeholder: 'Select (L3) product category',
  },
] as const;

const THUMBNAIL_INPUT_DATA = {
  name: 'thumbnail',
  label: 'Thumbnail',
  type: 'file',
  placeholder1: 'Select thumbnail',
  placeholder2: 'Change thumbnail',
} as const;

const IMAGES_INPUT_DATA = {
  name: 'images',
  label: 'Images',
  type: 'file',
  placeholder1: 'Select images',
  placeholder2: 'Add images',
} as const;

export const PRODUCT_MEDIA_AND_GALLERY_INPUT_MAP_DATA = [
  THUMBNAIL_INPUT_DATA,
  {
    name: 'video',
    label: 'Video',
    type: 'file',
    placeholder1: 'Select video',
    placeholder2: 'Change video',
  },
  IMAGES_INPUT_DATA,
] as const;

export const PRODUCT_DESCRIPTION_AND_CONTENT_INPUT_MAP_DATA = [
  {
    name: 'shortDescription',
    label: 'Short description',
    placeholder: 'Enter short description',
  },
  {
    name: 'description',
    label: 'Description',
    placeholder: 'Write product description here...',
  },
  {
    name: 'ingredients',
    label: 'Ingredients',
    placeholder: 'Write product ingredients here...',
  },
  {
    name: 'instructions',
    label: 'Usage instructions',
    placeholder: 'Write product usage instructions here...',
  },
  {
    name: 'additional',
    label: 'Additional details',
    placeholder: 'Write product additional details here...',
  },
] as const;

export const STOCKS_INPUT_MAP_DATA = [
  {
    name: 'stock',
    label: 'Stock',
    type: 'number',
    placeholder: 'Enter stock',
    autoComplete: 'tel',
  },
  {
    name: 'stockThreshold',
    label: 'Stock threshold',
    type: 'number',
    placeholder: 'Enter stock threshold',
    autoComplete: 'tel',
  },
] as const;

export const PRODUCT_VARIANT_INPUT_MAP_DATA = [
  {
    name: 'type',
    type: 'radio',
    defaultValue: VARIANT_TYPES_MAP.Color,
    options: VARIANT_TYPES.map((type) => ({ label: type, value: type })),
  },
  {
    name: 'label',
    label: 'Label',
    type: 'text',
    placeholder: 'Enter label',
    autoComplete: 'given-name',
  },
  {
    name: 'value',
    label: 'Value',
    type: 'color',
    placeholder: 'Enter value',
    autoComplete: 'given-name',
  },
  {
    name: 'value',
    label: 'Value',
    type: 'text',
    placeholder: 'Enter value',
    autoComplete: 'given-name',
  },
  {
    name: 'originalPrice',
    label: 'Original price',
    type: 'number',
    placeholder: 'Enter original price',
    autoComplete: 'tel',
  },
  {
    name: 'sellingPrice',
    label: 'Selling price',
    type: 'number',
    placeholder: 'Enter selling price',
    autoComplete: 'tel',
  },
  ...STOCKS_INPUT_MAP_DATA,
  THUMBNAIL_INPUT_DATA,
  IMAGES_INPUT_DATA,
] as const;

export const PRODUCT_TRYON_INPUT_MAP_DATA = [
  {
    name: 'enabled',
    content: 'Enable try-on',
    type: 'checkbox',
  },
  {
    name: 'category',
    label: 'Try-on category',
    type: 'select',
    placeholder: 'Select try-on category',
  },
  {
    name: 'subCategory',
    label: 'Try-on sub-category',
    type: 'select',
    placeholder: 'Select try-on sub-category',
  },
] as const;

export const DEFAULT_QUILL_LINK_ID = 'custom-link-btn' as const;

export const defaultQuillToolbar: TQuillToolbar = [
  [{ header: [false, 6, 5, 4, 3, 2, 1] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ align: [] }],
  [{ direction: 'rtl' }],
  ['link', 'image', 'video'],
  ['code', 'clean'],
] as const;
