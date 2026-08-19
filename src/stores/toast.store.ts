import { nanoid } from 'nanoid';
import { create } from 'zustand';

import type { IToastStore } from '@/types/store.type';

const useToastStore = create<IToastStore>((set) => ({
  toasts: [],

  add: (toast) => {
    const id = nanoid();

    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));

    return id; // return the id of the toast for removal
  },

  update: {
    progress: (id, progress) => {
      set((state) => ({
        toasts: state.toasts.map((toast) => (toast.id === id ? { ...toast, progress } : toast)),
      }));
    },
  },

  remove: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

export default useToastStore;
