import { create } from 'zustand';

import type { IActionItem, IActionsStore } from '@/types/store.type';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const useActionsStore = create<IActionsStore>((set, get) => ({
  actions: [],

  addAction: (fn, options) => {
    const id = crypto.randomUUID();

    const item: IActionItem = {
      id,
      fn,
      retries: 0,
      maxRetries: options?.maxRetries ?? 3, // 🔥 default
    };

    set((state) => ({
      actions: [...state.actions, item],
    }));

    return id;
  },

  removeAction: (id) => {
    set((state) => ({
      actions: state.actions.filter((a) => a.id !== id),
    }));
  },

  clearActions: () => {
    set({ actions: [] });
  },

  runNextAction: async () => {
    const { actions } = get();
    if (!actions.length) return;

    const [current, ...rest] = actions;

    if (!current) return;

    try {
      await current.fn();

      // ✅ success → remove
      set({ actions: rest });
    } catch (err) {
      console.error('Action failed:', err);

      // 🔁 retry allowed
      if (current.retries < current.maxRetries) {
        const updated = {
          ...current,
          retries: current.retries + 1,
        };

        // 🔥 exponential backoff
        const delay = 500 * Math.pow(2, current.retries);
        await sleep(delay);

        set((state) => ({
          actions: [updated, ...state.actions.slice(1)],
        }));
      } else {
        console.warn('Max retries reached → dropping action');

        // ❌ remove permanently
        set({ actions: rest });
      }
    }
  },

  runAllActions: async () => {
    while (get().actions.length) {
      await get().runNextAction();
    }
  },
}));

export default useActionsStore;
