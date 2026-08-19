import {
  API_METHODS_MAP,
  PRODUCT_STATUSES_MAP,
  SERVICE_NAMES_MAP,
} from '@beautinique/frontend-constants';

import { createQueryKeys, createRouteHelper } from '@/utils/api.util';

const { DELETE, GET, PATCH, POST } = API_METHODS_MAP;

// The gateway registers these at its own root (`/health`, `/wake-up`, `/overall-health`) -
// not under `base` like everything below - so this stays a separate object. Running it
// through `createRouteHelper` alongside `METHODS_AND_PATHS` would wrongly prefix these with
// `/api/v1`, since the helper prepends every entry's `base` to all of its children.
export const GATEWAY_ROOT_METHODS_AND_PATHS = {
  health: { method: GET, path: '/health' },
  overallHealth: { method: GET, path: '/overall-health' },
  wakeUp: { method: GET, path: '/wake-up' },
} as const;

export const METHODS_AND_PATHS = {
  base: '/api/v1',
  gateway: {
    refreshAccessToken: { method: POST, path: '/refresh-access-token' },
  },
  user_service: {
    base: `/${SERVICE_NAMES_MAP.user}`,
    auth: {
      base: '/auth',
      login: {
        base: '/login',
        manual: { method: POST, path: '/manual' },
        oauth: {
          google: {
            redirect: { method: GET, path: '/oauth/google/redirect' },
            callback: { method: GET, path: '/oauth/google/callback' },
          },

          linkedin: {
            redirect: { method: GET, path: '/oauth/linkedin/redirect' },
            callback: { method: GET, path: '/oauth/linkedin/callback' },
          },

          github: {
            redirect: { method: GET, path: '/oauth/github/redirect' },
            callback: { method: GET, path: '/oauth/github/callback' },
          },
        },
      },
      logout: { method: DELETE, path: '/logout' },
      register: {
        base: '/register',
        sendOtp: { method: POST, path: '/send-otp' },
        resendOtp: { method: PATCH, path: '/resend-otp' },
        verifyOtp: { method: POST, path: '/verify-otp' },
        saveUser: { method: POST, path: '/save-user' },
      },
      password: {
        base: '/password',
        forgot: {
          sendOtp: { method: POST, path: '/forgot-send-otp' },
          resendOtp: { method: PATCH, path: '/forgot-resend-otp' },
          verifyOtp: { method: POST, path: '/forgot-verify-otp' },
          save: { method: POST, path: '/forgot-save' },
        },
      },
    },
    user: {
      base: '/user',
      session: { method: GET, path: '/session' },
      password: {
        base: '/password',
        change: { method: PATCH, path: '/change' },
        set: { method: PATCH, path: '/set' },
      },
    },
  },
  media_service: {
    base: `/${SERVICE_NAMES_MAP.media}`,
    upload: {
      base: '/upload',
      single: { method: POST, path: '/single' },
      multiple: { method: POST, path: '/multiple' },
    },
  },
  product_service: {
    base: `/${SERVICE_NAMES_MAP.product}`,
    category: {
      base: '/category',
      add: { method: POST, path: '/' },
      update: { method: PATCH, path: '/:categoryId' },
      delete: { method: DELETE, path: '/:categoryId' },
      get: {
        byParentLevel: { method: GET, path: '/by-parent-level' },
        byHierarchy: { method: GET, path: '/by-hierarchy' },
      },
    },
    product: {
      base: '/product',
      draft: {
        base: '/draft',
        publish: { method: PATCH, path: '/publish' }, // For publish existing draft
        save: { method: POST, path: '/' }, // For upload new Product as draft
        get: { method: GET, path: '/' }, // For get existing draft Product
        remove: { method: DELETE, path: '/' }, // For remove existing draft
        update: { method: PATCH, path: '/' }, // For already published product and seller again made some changes
      },
      publish: { method: PATCH, path: '/publish' }, // For publish existing Product
      get: {
        dashboard: {
          base: '/dashboard',
          products: { method: GET, path: '/products' },
          bySlug: { method: GET, path: '/:slug' },
        },
        suggestions: { method: GET, path: '/suggestions' },
        products: { method: GET, path: '/products' },
        bySlug: { method: GET, path: '/:slug' },
      },
    },
  },
  organization_service: {
    base: `/${SERVICE_NAMES_MAP.organization}`,
    contact: {
      base: '/contact',
      create: { method: POST, path: '/' },
      list: { method: GET, path: '/' },
      updateStatus: { method: PATCH, path: '/:ticketId' },
    },
  },
} as const;

export const API_METHODS_AND_URLS = createRouteHelper(METHODS_AND_PATHS);

export const GATEWAY_ROOT_API_METHODS_AND_URLS = createRouteHelper(GATEWAY_ROOT_METHODS_AND_PATHS);

export const API_QUERY_KEYS = createQueryKeys(METHODS_AND_PATHS);

export const PRODUCT_STATUS_TRANSITIONS = {
  [PRODUCT_STATUSES_MAP.PENDING]: [
    PRODUCT_STATUSES_MAP.PUBLISHED,
    PRODUCT_STATUSES_MAP.REJECTED,
    PRODUCT_STATUSES_MAP.BLOCKED,
  ],

  [PRODUCT_STATUSES_MAP.PUBLISHED]: [PRODUCT_STATUSES_MAP.BLOCKED, PRODUCT_STATUSES_MAP.DELETED],

  [PRODUCT_STATUSES_MAP.REJECTED]: [PRODUCT_STATUSES_MAP.PENDING, PRODUCT_STATUSES_MAP.BLOCKED],

  [PRODUCT_STATUSES_MAP.BLOCKED]: [
    PRODUCT_STATUSES_MAP.PENDING,
    PRODUCT_STATUSES_MAP.PUBLISHED,
    PRODUCT_STATUSES_MAP.DELETED,
  ],

  [PRODUCT_STATUSES_MAP.DELETED]: [
    PRODUCT_STATUSES_MAP.PENDING,
    PRODUCT_STATUSES_MAP.PUBLISHED,
    PRODUCT_STATUSES_MAP.BLOCKED,
  ],
} as const;
