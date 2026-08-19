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
  // N

  VITE_NODE_ENV,

  // O
  // VITE_OPENING_GOOGLE_APP_SCRIPTS_URL,
  // VITE_OPENING_GOOGLE_DEPLOYMENT_ID, // NOTE - This is not used anywhere It's just for convenience
  // VITE_OPENING_GOOGLE_SHEET_URL, // NOTE - This is not used anywhere It's just for convenience

  // P
  // Q
  // R

  // VITE_RAZORPAY_KEY_ID,
  // VITE_RAZORPAY_KEY_SECRET, // NOTE - This is not used anywhere It's just for convenience

  // S
  // T
  // U
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
  // O
  // P
  // Q
  // R
  // S
  // T
  // U

  urls: { gateway: requireEnv(VITE_GATEWAY_BASE_URL, 'VITE_GATEWAY_BASE_URL') },

  // V
  // W
  // X
  // Y
  // Z
};

export default envs;
