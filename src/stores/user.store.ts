import { create } from 'zustand';

import { resetAuthLogoutState } from '@/classes/ApiRequest';
import { USER_KEY } from '@/constants/common.constants';
import type { IUser } from '@/types/api.type';
import type { IUserStore } from '@/types/store.type';
import { decryptData, encryptData } from '@/utils/crypto.util';

const useUserStore = create<IUserStore>((set) => {
  const getInitialUser = (): IUser | null => {
    const encrypted = localStorage.getItem(USER_KEY);
    const decrypted = decryptData<IUser>(encrypted ?? '');
    return decrypted;
  };

  const user = getInitialUser();

  return {
    user,
    authenticated: !!user,

    setUser: (user) => {
      if (user) {
        localStorage.setItem(USER_KEY, encryptData(user));
        resetAuthLogoutState();
      } else {
        localStorage.removeItem(USER_KEY);
      }

      set({ user, authenticated: !!user });
    },
  };
});

export default useUserStore;
