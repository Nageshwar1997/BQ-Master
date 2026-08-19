import { Icon } from '@iconify/react';

import useThemeStore from '@/stores/theme.store';
import type { IClassName } from '@/types/component.type';

import Tooltip from './Tooltip';

const Theme = ({ className = '' }: IClassName) => {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <Tooltip placement="bottom" title={theme === 'dark' ? 'Light Theme' : 'Dark Theme'}>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        className={`size-5 cursor-pointer md:size-6 ${className}`}
      >
        <Icon
          icon={theme === 'dark' ? 'line-md:sunny-loop' : 'line-md:moon-loop'}
          className="text-tertiary hover:text-secondary size-full [&_path]:stroke-[1.5]"
        />
      </button>
    </Tooltip>
  );
};

export default Theme;
