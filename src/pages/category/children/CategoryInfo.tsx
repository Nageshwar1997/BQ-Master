import { CATEGORY_LEVELS_MAP } from '@beautinique/frontend-constants';
import { Icon } from '@iconify/react';

import type { TCatTable } from '@/types/component.type';

const CategoryInfo = ({ category }: Pick<TCatTable, 'category'>) => (
  <div className="flex items-center gap-3">
    <div
      className={`to-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-lg bg-linear-to-br ${
        category.level === CATEGORY_LEVELS_MAP.L1
          ? 'from-rose-c/25 via-rose-c/10'
          : category.level === CATEGORY_LEVELS_MAP.L2
            ? 'from-jade-c/25 via-jade-c/10'
            : 'from-blue-crayola-c/25 via-blue-crayola-c/10'
      }`}
    >
      <Icon icon="solar:hanger-2-linear" className="size-5" />
    </div>
    <div>
      <p className="text-primary text-sm font-semibold whitespace-nowrap">{category.name}</p>
      <p className="text-primary/45 text-xs whitespace-nowrap">{category.slug}</p>
      {'description' in category && category.description && (
        <p className="text-primary/30 text-xs whitespace-nowrap">{category.description}</p>
      )}
    </div>
  </div>
);

export default CategoryInfo;
