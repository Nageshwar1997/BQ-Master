import { parseData, stringifyData } from '@beautinique/shared-utils';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

import envs from '@/envs';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const encryptData = <T extends object | string>(data: T): string => {
  const stringData = typeof data === 'string' ? data : stringifyData<T>(data);

  const encrypted = AES.encrypt(stringData, envs.encryption_secret_key);
  return encrypted.toString();
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const decryptData = <T = unknown>(encryptedData: string | null): T | null => {
  if (!encryptedData) return null;

  const bytes = AES.decrypt(encryptedData, envs.encryption_secret_key);
  const decrypted = bytes.toString(Utf8);

  try {
    return parseData<T>(decrypted);
  } catch {
    return (decrypted as T) || null;
  }
};
