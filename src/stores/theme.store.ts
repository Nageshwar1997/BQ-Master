import { create } from 'zustand';

import type { IThemeStore, TTheme } from '@/types/store.type';

const useThemeStore = create<IThemeStore>((set) => {
  const currentTheme = localStorage.getItem('theme') ?? 'dark';
  const isValidTheme = ['dark', 'light'].includes(currentTheme);

  return {
    theme: isValidTheme ? (currentTheme as TTheme) : 'dark',
    toggleTheme: () => {
      set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        return { theme: newTheme };
      });
    },
  };
});

export default useThemeStore;
