import { CATEGORY_LEVELS_MAP } from '@beautinique/frontend-constants';

const passwords = { password: '', confirmPassword: '' };

const changePassword = { ...passwords, currentPassword: '' };

export const FORM_DEFAULT_VALUES = {
  passwords,
  changePassword,
  email: { email: '' },
  phoneNumber: { phoneNumber: '' },
  otp: { otp: '' },
  register: {
    ...passwords,
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  },
  login: {
    loginMethod: 'email',
    email: undefined,
    phoneNumber: undefined,
    password: '',
  },
  addProduct: {
    title: '',
    brand: '',
    mainCategory: '',
    subCategory: '',
    productCategory: '',
    mrp: '',
    salePrice: '',
    stock: '',
    imageUrl: '',
    confirmDetails: false,
  },
  category: {
    activeStep: 0,
    name: '',
    level: CATEGORY_LEVELS_MAP.L1,
    mainCategory: '',
    subCategory: '',
    description: '',
  },
} as const;

export const ADD_PRODUCT_FORM_ID_MAP = {
  0: 'product-basic-info-form',
  1: 'product-media-form',
  2: 'product-description-form',
  3: 'product-variants-form',
  4: 'product-try-on-form',
  5: 'product-confirm-form',
} as const;
