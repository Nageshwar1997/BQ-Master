import { requireEnv } from '@beautinique/shared-utils';

const {
  // A
  // B
  // C
  // VITE_CONTACT_US_GOOGLE_APP_SCRIPTS_URL,
  // VITE_CONTACT_US_GOOGLE_DEPLOYMENT_ID, // NOTE - This is not used anywhere It's just for convenience
  // VITE_CONTACT_US_GOOGLE_SHEET_URL, // NOTE - This is not used anywhere It's just for convenience

  // D
  // E
  VITE_ENCRYPTION_SECRET_KEY,

  // F
  // G

  VITE_GATEWAY_BASE_URL,
  // VITE_GOOGLE_MAPS_API_KEY,

  // H
  // I
  // J
  // K
  // L
  // M

  VITE_MAIL_SERVICE_BASE_URL,
  VITE_MEDIA_SERVICE_BASE_URL,

  // N

  VITE_NODE_ENV,

  // O
  VITE_OLA_MAPS_API_KEY,
  VITE_ORGANIZATION_SERVICE_BASE_URL,
  // VITE_OPENING_GOOGLE_APP_SCRIPTS_URL,
  // VITE_OPENING_GOOGLE_DEPLOYMENT_ID, // NOTE - This is not used anywhere It's just for convenience
  // VITE_OPENING_GOOGLE_SHEET_URL, // NOTE - This is not used anywhere It's just for convenience

  // P

  VITE_PRODUCT_SERVICE_BASE_URL,
  // Q
  // R

  // VITE_RAZORPAY_KEY_ID,
  // VITE_RAZORPAY_KEY_SECRET, // NOTE - This is not used anywhere It's just for convenience

  // S
  // T
  // U

  VITE_USER_SERVICE_BASE_URL,
  // V
  // W
  // X
  // Y
  // Z
} = import.meta.env as Record<string, string>;

const envs = {
  // A
  // B
  // C
  // D
  // E
  encryption_secret_key: requireEnv(VITE_ENCRYPTION_SECRET_KEY, 'VITE_ENCRYPTION_SECRET_KEY'),
  // F
  // G
  // H
  // I

  is_dev: VITE_NODE_ENV === 'development',

  // J
  // K
  // L
  // M
  // N

  ola_maps: { api_key: requireEnv(VITE_OLA_MAPS_API_KEY, 'VITE_OLA_MAPS_API_KEY') },

  // P
  // Q
  // R
  // S
  // T
  // U

  urls: {
    gateway: requireEnv(VITE_GATEWAY_BASE_URL, 'VITE_GATEWAY_BASE_URL'),
    // Direct service URLs - ONLY for the boot-time wake-up ping (`pingServicesWakeUp`). Real API
    // traffic still goes through the gateway; the services reject calls without the service secret.
    services: {
      mail: requireEnv(VITE_MAIL_SERVICE_BASE_URL, 'VITE_MAIL_SERVICE_BASE_URL'),
      media: requireEnv(VITE_MEDIA_SERVICE_BASE_URL, 'VITE_MEDIA_SERVICE_BASE_URL'),
      organization: requireEnv(
        VITE_ORGANIZATION_SERVICE_BASE_URL,
        'VITE_ORGANIZATION_SERVICE_BASE_URL',
      ),
      product: requireEnv(VITE_PRODUCT_SERVICE_BASE_URL, 'VITE_PRODUCT_SERVICE_BASE_URL'),
      user: requireEnv(VITE_USER_SERVICE_BASE_URL, 'VITE_USER_SERVICE_BASE_URL'),
    },
  },

  // V
  // W
  // X
  // Y
  // Z
};

export default envs;
