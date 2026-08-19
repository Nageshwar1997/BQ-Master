import { Icon } from '@iconify/react';

import { ROUTES } from '@/constants/common.constants';
import usePathParams from '@/hooks/usePathParams';
import type { IBreadcrumb } from '@/types/component.type';

import ScrollableGradientContainer from '../layout/containers/ScrollableGradientContainer';

const Breadcrumb = ({ className = '', customPath, customPaths }: IBreadcrumb) => {
  const { pathname, paths, navigate } = usePathParams();
  const finalPathName = customPath ?? pathname;
  const activePaths = customPaths ?? paths;

  const handleNavigate = (targetIndex: number) => {
    const targetPath =
      targetIndex === -1
        ? ROUTES.DASHBOARD
        : `/${activePaths.slice(0, targetIndex + 1).join('/')}`;

    if (targetPath !== finalPathName) {
      void navigate(targetPath);
    }
  };

  return (
    <ScrollableGradientContainer direction="horizontal" className="[&>div]:justify-start">
      <nav
        aria-label="Breadcrumb"
        className={`text-secondary flex items-center gap-2 ${className}`}
      >
        <div className="flex items-center gap-2 truncate">
          {finalPathName !== ROUTES.DASHBOARD ? (
            <button
              type="button"
              className="cursor-pointer truncate capitalize"
              onClick={() => {
                handleNavigate(-1);
              }}
            >
              Dashboard
            </button>
          ) : (
            <span aria-current="page" className="truncate capitalize opacity-80">
              Dashboard
            </span>
          )}
          {activePaths.length > 0 && <Icon icon="solar:alt-arrow-right-linear" className="" />}
        </div>

        {activePaths.map((path, index) => {
          const targetPath = `/${activePaths.slice(0, index + 1).join('/')}`;
          const isLast = index === activePaths.length - 1;
          const isClickable = !isLast && finalPathName !== targetPath;

          return (
            <div key={index} className="flex items-center gap-2 truncate">
              {isClickable ? (
                <button
                  type="button"
                  className="cursor-pointer truncate capitalize"
                  onClick={() => {
                    handleNavigate(index);
                  }}
                >
                  {path.replace('-', ' ')}
                </button>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="truncate capitalize opacity-80"
                >
                  {path.replace('-', ' ')}
                </span>
              )}
              {!isLast && <Icon icon="solar:alt-arrow-right-linear" />}
            </div>
          );
        })}
      </nav>
    </ScrollableGradientContainer>
  );
};

export default Breadcrumb;
