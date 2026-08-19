import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import Tooltip from '@/components/ui/Tooltip';
import { ROUTES, SIDEBAR_DATA } from '@/constants/common.constants';
import useIsSmallScreen from '@/hooks/useIsSmallScreen';
import usePathParams from '@/hooks/usePathParams';
import { useLogout } from '@/services/user-service/auth.service.query';

import ScrollableGradientContainer from '../containers/ScrollableGradientContainer';

const SidebarItem = ({
  isSameRoute,
  isSameIndex,
  ...item
}: (typeof SIDEBAR_DATA)[number] & {
  isSameRoute: boolean;
  isSameIndex?: boolean;
}) => {
  const icon = isSameIndex || isSameRoute ? item.icon.replace('-linear', '-bold') : item.icon;
  return (
    <div className="flex cursor-pointer flex-col items-center gap-1">
      <span
        className={`border-primary/50 size-6 w-fit shrink-0 rounded-lg border p-1 md:size-9 md:p-1.5 ${isSameRoute ? 'bg-accent-duo shadow-secondary-btn' : 'hover:bg-secondary-invert/40 hover:shadow-tertiary-btn bg-secondary-invert/30'}`}
      >
        <Icon icon={icon} className={`size-full ${isSameRoute ? 'text-white' : 'text-tertiary'}`} />
      </span>
      <span className="text-[8px] md:hidden">{item.title}</span>
    </div>
  );
};

const Sidebar = () => {
  const { pathname, paths } = usePathParams();
  const isMobile = useIsSmallScreen(767);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { mutateAsync: logout } = useLogout();

  const handleEvents = async (event: (typeof SIDEBAR_DATA)[number]['handler']) => {
    switch (event) {
      case 'logout':
        await logout();
        break;
      default:
        break;
    }
  };

  return (
    <aside className="border-t-silver/30 md:border-r-silver/30 bg-primary-invert sticky bottom-0 left-0 z-50 flex w-dvw items-center justify-center gap-4 border-t px-2 py-4 md:top-0 md:bottom-auto md:h-dvh md:w-fit md:flex-col md:border-r md:border-t-transparent">
      <Link to={ROUTES.DASHBOARD} className="hidden w-14 items-center justify-center md:flex">
        <img
          src="/images/logo/BQ_gradient_logo.webp"
          alt="Logo"
          className="w-full object-contain"
        />
      </Link>
      <Divider className="hidden md:block" />
      <ScrollableGradientContainer
        direction={isMobile ? 'horizontal' : 'vertical'}
        className="[&>div]:items-center [&>div]:justify-start"
        containerClassName="grow"
      >
        <div className="flex gap-4 md:flex-col">
          {SIDEBAR_DATA.map((item, index) => {
            const path =
              'path' in item ? (item.path !== '/' ? item.path.replace('/', '') : item.path) : '';
            const isSameRoute = path === pathname || paths.includes(path);
            const isSameIndex = hoveredIdx === index;

            return (
              <Tooltip key={index} title={item.title} placement={'right'} required={!isMobile}>
                {path ? (
                  <Link
                    to={path}
                    onMouseEnter={() => {
                      setHoveredIdx(index);
                    }}
                    onMouseLeave={() => {
                      setHoveredIdx(null);
                    }}
                  >
                    <SidebarItem {...item} isSameRoute={isSameRoute} isSameIndex={isSameIndex} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      void handleEvents(item.handler);
                    }}
                    onMouseEnter={() => {
                      setHoveredIdx(index);
                    }}
                    onMouseLeave={() => {
                      setHoveredIdx(null);
                    }}
                  >
                    <SidebarItem {...item} isSameRoute={isSameRoute} isSameIndex={isSameIndex} />
                  </button>
                )}
              </Tooltip>
            );
          })}
        </div>
      </ScrollableGradientContainer>
    </aside>
  );
};

export default Sidebar;
