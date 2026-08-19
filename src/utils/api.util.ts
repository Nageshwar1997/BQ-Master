import type ApiError from '@/classes/ApiError';
import type {
  IEndpoint,
  TCategoryNode,
  TGenerateQueryKeys,
  TGenerateRoutes,
  TParams,
  TRouteNode,
} from '@/types/api.type';

import { toaster } from './common.util';

export const handleApiErrorToaster = ({ message, globalErrors }: ApiError, title = 'Error') => {
  if (globalErrors?.length) {
    globalErrors.forEach((error) => {
      if (error) {
        toaster.error({ title, description: error });
      }
    });
  } else if (message) {
    toaster.error({ title, description: message });
  }
};

export const handleApiSuccessToaster = (message: string, title = 'Success') => {
  toaster.success({ title, description: message });
};

// Sorting is handled by tanstack/react-table's own sortedRowModel (see
// CATEGORY_TABLE_FEATURES in table.constants.ts) - this only does the search
// filtering, which happens before the data reaches the table.
//
// The category tree is filtered before it reaches the table (rather than via
// a tanstack column filter) so collapsed branches never need to be expanded
// for a match somewhere inside them to be findable: a node is kept if it
// matches directly (keeping its whole subtree as-is) or if any descendant
// matches (recursively pruning the rest of that subtree away). Categories.tsx
// auto-expands every row while a search is active so matches stay visible.
export const filterCategoryTree = (nodes: TCategoryNode[], search: string): TCategoryNode[] => {
  const value = search.toLowerCase().trim();
  if (!value) return nodes;

  const matches = (node: TCategoryNode) =>
    [node.name, node.slug].join(' ').toLowerCase().includes(value);

  const filterNode = (node: TCategoryNode): TCategoryNode | null => {
    if (matches(node)) return node;

    const filteredChildren = (node.subcategories ?? [])
      .map(filterNode)
      .filter((child): child is TCategoryNode => child !== null);

    return filteredChildren.length ? { ...node, subcategories: filteredChildren } : null;
  };

  return nodes.map(filterNode).filter((node): node is TCategoryNode => node !== null);
};

const joinPaths = (...paths: (string | undefined)[]) =>
  paths.filter(Boolean).join('/').replace(/\/+/g, '/').replace(/\/$/, '');

const isEndpoint = (value: unknown): value is IEndpoint => {
  return typeof value === 'object' && value !== null && 'path' in value && 'method' in value;
};

const buildDynamicUrl = <TPath extends string>(path: TPath, params?: TParams): TPath => {
  if (!params) {
    return path;
  }

  let result = path as string;

  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });

  return result as TPath;
};

export const createRouteHelper = <T extends Record<string, unknown>>(
  config: T,
): TGenerateRoutes<T> => {
  const build = (node: TRouteNode, parents: string[] = []): Record<string, unknown> => {
    const currentBase = node.base ? [...parents, node.base] : parents;

    const result: Record<string, unknown> = {};

    Object.entries(node).forEach(([key, value]) => {
      if (isEndpoint(value)) {
        const fullPath = joinPaths(...currentBase, value.path);

        const hasParams = fullPath.includes(':');

        result[key] = {
          method: value.method.toUpperCase(),
          url: hasParams ? (params: TParams) => buildDynamicUrl(fullPath, params) : fullPath,
        };

        return;
      }

      if (typeof value === 'object' && value !== null) {
        result[key] = build(value as TRouteNode, currentBase);
      }
    });

    return result;
  };

  return build(config) as TGenerateRoutes<T>;
};

export const createQueryKeys = <T extends Record<string, unknown>>(
  config: T,
): TGenerateQueryKeys<T> => {
  const build = (node: TRouteNode, parents: string[] = []): Record<string, unknown> => {
    const currentBase = node.base ? [...parents, node.base] : parents;

    const result: Record<string, unknown> = {};

    Object.entries(node).forEach(([key, value]) => {
      if (isEndpoint(value)) {
        const fullPath = joinPaths(...currentBase, value.path);

        const hasParams = fullPath.includes(':');

        result[key] = hasParams
          ? (params: TParams) => [value.method.toUpperCase(), buildDynamicUrl(fullPath, params)]
          : [value.method.toUpperCase(), fullPath];

        return;
      }

      if (typeof value === 'object' && value !== null) {
        result[key] = build(value as TRouteNode, currentBase);
      }
    });

    return result;
  };

  return build(config) as TGenerateQueryKeys<T>;
};
