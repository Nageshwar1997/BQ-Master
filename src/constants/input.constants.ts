import {
  CONTACT_QUERY_TYPES,
  COUNTRIES,
  SELLER_TYPES,
  STATES_AND_UTS,
  VARIANT_TYPES,
  VARIANT_TYPES_MAP,
} from '@beautinique/frontend-constants';
import type { TPasswordsZodSchema } from '@beautinique/frontend-types';

import type { TQuillToolbar } from '@/types/input.type';

export const BASE_PASSWORD_KEYS: readonly (keyof TPasswordsZodSchema)[] = [
  'password',
  'confirmPassword',
];

export const BASE_PASSWORDS_VISIBILITY = Object.fromEntries(
  BASE_PASSWORD_KEYS.map((key) => [key, false] as const),
) as Readonly<Record<(typeof BASE_PASSWORD_KEYS)[number], false>>;

const NAME_INPUT_DATA = {
  name: 'name',
  label: 'Name',
  type: 'text',
  autoComplete: 'given-name',
  placeholder: 'Enter your full name',
} as const;

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
  ...NAME_INPUT_DATA,
  name: 'firstName',
  label: 'First Name',
  placeholder: 'Enter first name',
} as const;

const LAST_NAME_INPUT_DATA = {
  ...NAME_INPUT_DATA,
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

export const UPDATE_USER_INPUT_MAP_DATA = [
  FIRST_NAME_INPUT_DATA,
  LAST_NAME_INPUT_DATA,
  EMAIL_INPUT_DATA,
  PHONE_NUMBER_INPUT_DATA,
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
    content: 'Enable Try-On',
    type: 'checkbox',
  },
  {
    name: 'category',
    label: 'Try-on category',
    type: 'select',
    placeholder: 'Select Try-On category',
  },
  {
    name: 'subCategory',
    label: 'Try-on sub-category',
    type: 'select',
    placeholder: 'Select Try-On sub-category',
  },
] as const;

export const SELLER_BUSINESS_DETAILS_INPUT_MAP_DATA = [
  {
    label: 'Business name',
    name: 'name',
    type: 'text',
    placeholder: 'Enter business name',
    autoComplete: 'given-name',
  },
  {
    label: 'Business type',
    name: 'type',
    type: 'select',
    placeholder: 'Select business type',
    options: SELLER_TYPES.map((type) => ({ label: type, value: type })),
  },
  {
    label: 'Business email',
    name: 'email',
    type: 'text',
    placeholder: 'Enter business email',
    autoComplete: 'email',
  },
  {
    label: 'Business phone number',
    name: 'phoneNumber',
    type: 'number',
    placeholder: 'Enter business phone number',
    autoComplete: 'tel',
  },
  {
    label: 'GSTIN',
    name: 'gstin',
    type: 'text',
    placeholder: 'Enter GSTIN',
    autoComplete: 'given-name',
  },
  {
    label: 'PAN',
    name: 'pan',
    type: 'text',
    placeholder: 'Enter PAN',
    autoComplete: 'given-name',
  },
] as const;

export const SELLER_BANK_DETAILS_INPUT_MAP_DATA = [
  {
    label: 'Account holder name',
    name: 'accountHolderName',
    type: 'text',
    placeholder: 'Enter name as per bank records',
    autoComplete: 'given-name',
  },
  {
    label: 'Account number',
    name: 'accountNumber',
    type: 'number',
    placeholder: 'Enter account number',
    autoComplete: 'tel',
  },
  {
    label: 'IFSC code',
    name: 'ifscCode',
    type: 'text',
    placeholder: 'Enter IFSC code',
    autoComplete: 'given-name',
  },
  {
    label: 'Bank name',
    name: 'bankName',
    type: 'text',
    placeholder: 'Enter bank name',
    autoComplete: 'given-name',
  },
] as const;

export const SELLER_ADDRESS_INPUT_MAP_DATA = [
  {
    label: 'Address line 1',
    name: 'line1',
    type: 'text',
    placeholder: 'Enter Building, street',
    autoComplete: 'address-line1',
  },
  {
    label: 'Address line 2 (optional)',
    name: 'line2',
    type: 'text',
    placeholder: 'Enter Landmark, area',
    autoComplete: 'address-line2',
  },
  {
    label: 'City / Town',
    name: 'city',
    type: 'text',
    placeholder: 'Enter City / Town',
    autoComplete: 'address-level2',
  },
  {
    label: 'State / Province',
    name: 'state',
    type: 'select',
    placeholder: 'Select State / Province',
    autoComplete: 'address-level1',
    options: STATES_AND_UTS.map((value) => ({ label: value, value })),
  },
  {
    label: 'Pincode',
    name: 'pincode',
    type: 'number',
    placeholder: 'Enter pincode',
    autoComplete: 'postal-code',
  },
  {
    label: 'Country',
    name: 'country',
    type: 'select',
    placeholder: 'Select Country',
    autoComplete: 'address-level1',
    options: COUNTRIES.map((value) => ({ label: value, value })),
  },
] as const;

export const SELLER_DOCUMENTS_INPUT_MAP_DATA = [
  {
    label: 'ID proof',
    name: 'id',
    type: 'file',
    placeholder: 'Select ID proof',
  },
  {
    label: 'Address proof',
    name: 'address',
    type: 'file',
    placeholder: 'Select address proof',
  },
  {
    label: 'Business license',
    name: 'license',
    type: 'file',
    placeholder: 'Select business license',
  },
  {
    label: 'PAN card copy',
    name: 'pan',
    type: 'file',
    placeholder: 'Select PAN card copy',
  },
  {
    label: 'GST certificate',
    name: 'gst',
    type: 'file',
    placeholder: 'Select GST certificate',
  },
  {
    label: 'Cancelled cheque / bank passbook',
    name: 'bank',
    type: 'file',
    placeholder: 'Select cancelled cheque or passbook',
  },
] as const;

export const CONTACT_INPUT_MAP_DATA = [
  NAME_INPUT_DATA,
  EMAIL_INPUT_DATA,
  PHONE_NUMBER_INPUT_DATA,
  {
    name: 'queryType',
    label: 'Query Type',
    type: 'select',
    placeholder: 'What is your query about?',
    options: CONTACT_QUERY_TYPES.map((option) => ({ label: option, value: option })),
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'How can we help?',
    autoComplete: 'off',
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
