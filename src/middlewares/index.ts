import { type MiddlewareFunction, redirect } from 'react-router-dom';

import { ROUTES } from '@/constants/common.constants';
import useUserStore from '@/stores/user.store';

export const authenticate: MiddlewareFunction = ({ request }, next) => {
  const { user } = useUserStore.getState();

  if (!user) {
    // Remember where the user was trying to go, so login can send them back here instead of Dashboard.
    const { pathname, search } = new URL(request.url);
    const intendedPath = `${pathname}${search}`;
    const redirectParam =
      intendedPath === ROUTES.DASHBOARD ? '' : `?redirect=${encodeURIComponent(intendedPath)}`;

    return redirect(`/${ROUTES.AUTH.BASE}${redirectParam}`);
  }

  return next();
};

// Keeps already-logged-in users off guest-only pages (login/forgot-password).
export const guestOnly: MiddlewareFunction = (_args, next) => {
  const { user } = useUserStore.getState();

  if (user) {
    return redirect(ROUTES.DASHBOARD);
  }

  return next();
};
