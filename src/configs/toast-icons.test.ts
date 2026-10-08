// @vitest-environment jsdom
import { getIcon } from '@iconify/react';
import { describe, expect, it } from 'vitest';

import { TOAST_ICON_NAMES } from './toast-icons';

describe('bundled toast icons', () => {
  it('lists the icons the toasts use', () => {
    expect([...TOAST_ICON_NAMES].sort()).toEqual([
      'lucide:x',
      'quill:loading-spin',
      'solar:check-circle-linear',
      'solar:danger-triangle-linear',
      'solar:info-circle-outline',
    ]);
  });

  it('has the drawing and the size of every icon it lists, with no network', () => {
    for (const name of TOAST_ICON_NAMES) {
      const icon = getIcon(name);

      expect(icon, name).not.toBeNull();
      expect(icon?.body, name).toContain('currentColor'); // takes the toast's colour
      expect(icon?.width, name).toBeGreaterThan(0);
      expect(icon?.height, name).toBeGreaterThan(0);
    }
  });
});
