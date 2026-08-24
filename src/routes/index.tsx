import { type ComponentType } from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

import LoadingScreen from '@/components/layout/loaders/LoadingScreen';
import { ROUTES } from '@/constants/common.constants';
import { authenticate, guestOnly } from '@/middlewares';
import ErrorBoundary from '@/pages/error/ErrorBoundary';

const {
  AUTH,
  CATEGORIES,
  DASHBOARD,
  PRODUCTS,
  PROFILE,
  ENQUIRIES,
  TERRITORY_MANAGEMENT,
  ALL_SELLERS,
  AUDIT_LOG,
} = ROUTES;

// Wraps a page's dynamic import into the function react-router's `lazy` route property expects.
// The import itself must stay a literal `() => import('@/path')` callback (not a variable path)
// so Vite can statically split each page into its own chunk.
const loadPage = (loader: () => Promise<{ default: ComponentType }>) => async () => {
  const { default: Component } = await loader();
  return { Component };
};

const routes: RouteObject[] = [
  {
    path: DASHBOARD,
    HydrateFallback: LoadingScreen,
    ErrorBoundary,
    middleware: [authenticate],
    lazy: loadPage(() => import('@/pages/layout')),
    children: [
      {
        index: true,
        lazy: loadPage(() => import('@/pages/home')),
      },
      {
        path: PRODUCTS.BASE,
        element: <Outlet />,
        children: [
          {
            index: true,
            lazy: loadPage(() => import('@/pages/product/Products')),
          },
          {
            path: PRODUCTS.ADD,
            lazy: loadPage(() => import('@/pages/product/AddProduct')),
          },
          {
            path: PRODUCTS.PRODUCT_ID,
            lazy: loadPage(() => import('@/pages/product/ProductDetails')),
          },
          {
            path: PRODUCTS.CATEGORY_L1,
            lazy: loadPage(() => import('@/pages/product/CategoryProducts')),
          },
          {
            path: `${PRODUCTS.CATEGORY_L1}/${PRODUCTS.CATEGORY_L2}`,
            lazy: loadPage(() => import('@/pages/product/CategoryProducts')),
          },
          {
            path: `${PRODUCTS.CATEGORY_L1}/${PRODUCTS.CATEGORY_L2}/${PRODUCTS.CATEGORY_L3}`,
            lazy: loadPage(() => import('@/pages/product/CategoryProducts')),
          },
        ],
      },
      /* ========== CATEGORIES ========== */
      {
        path: CATEGORIES.BASE,
        lazy: loadPage(() => import('@/pages/category/Categories')),
      },
      {
        path: PROFILE.UPDATE_PASSWORD,
        middleware: [authenticate],
        lazy: loadPage(() => import('@/pages/auth/UpdatePassword')),
      },

      /* ========== ENQUIRIES ========== */
      {
        path: ENQUIRIES,
        lazy: loadPage(() => import('@/pages/organization/Enquiries')),
      },

      /* ========== TERRITORY MANAGEMENT ========== */
      {
        path: TERRITORY_MANAGEMENT,
        lazy: loadPage(() => import('@/pages/admin/TerritoryManagement')),
      },

      /* ========== ALL SELLERS ========== */
      {
        path: ALL_SELLERS,
        lazy: loadPage(() => import('@/pages/organization/AllSellers')),
      },

      /* ========== AUDIT LOG ========== */
      {
        path: AUDIT_LOG,
        lazy: loadPage(() => import('@/pages/admin/AuditLog')),
      },
    ],
  },
  {
    path: AUTH.BASE,
    HydrateFallback: LoadingScreen,
    ErrorBoundary: ErrorBoundary,
    middleware: [guestOnly],
    lazy: loadPage(() => import('@/pages/auth')),
    children: [
      {
        index: true,
        lazy: loadPage(() => import('@/pages/auth/Login')),
      },

      {
        path: AUTH.FORGOT_PASSWORD,
        lazy: loadPage(() => import('@/pages/auth/ForgotPassword')),
      },
    ],
  },
  {
    path: '*',
    lazy: loadPage(() => import('@/pages/error/NotFound')),
  },
];

export default routes;
