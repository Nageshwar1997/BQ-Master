import type {
  ICreateHeaders,
  TApiMethod,
  TAuthProvider,
  TCategoryLevel,
  TCategoryLevelsMap,
  TCategoryZodSchema,
  TContactQueryStatus,
  TCreateContactQueryZodSchema,
  TProductBasicInfoZodSchema,
  TProductDescriptionAndContentZodSchema,
  TProductMediaAndGalleryZodSchema,
  TProductStatus,
  TProductWithoutVariantsZodSchema,
  TProductWithVariantsZodSchema,
  TRegisterZodSchema,
  TSort,
  TTryOnSelection,
  TUserRole,
} from '@beautinique/frontend-types';

export type TFieldErrors = Record<string, string[]>;

export interface IErrorResponse {
  message?: string;
  fieldErrors?: TFieldErrors;
  globalErrors?: string[];
}

export interface IId {
  _id: string;
}

export interface ITimeStamp {
  createdAt: string;
  updatedAt: string;
}

export interface IUser
  extends Omit<TRegisterZodSchema, 'confirmPassword' | 'password'>, IId, ITimeStamp {
  providers: TAuthProvider[];
  role: TUserRole;
  avatar?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  CATEGORY                                  */
/* -------------------------------------------------------------------------- */

export type TLevel1 = TCategoryLevelsMap['L1'];
export type TLevel2 = TCategoryLevelsMap['L2'];
export type TLevel3 = TCategoryLevelsMap['L3'];

type CategoryBase<TLevel extends TCategoryLevel> = IId &
  Pick<TCategoryZodSchema, 'name'> & { slug: string; level: TLevel };

export type TL1Category = CategoryBase<TLevel1>;
export type TL2Category = CategoryBase<TLevel2> & { parent: string };
export type TL3Category = CategoryBase<TLevel3> & { parent: string; description: string };

export type TCategory = TL1Category | TL2Category | TL3Category;

export type TCategoryHierarchyNode<TLevel extends TCategoryLevel> = TLevel extends TLevel1
  ? CategoryBase<TLevel1> & { subcategories: TCategoryHierarchyNode<TLevel2>[] }
  : TLevel extends TLevel2
    ? CategoryBase<TLevel2> & { parent: string; subcategories: TCategoryHierarchyNode<TLevel3>[] }
    : CategoryBase<TLevel3> & { parent: string; description: string; subcategories?: never };

export type TCategoryHierarchy = TCategoryHierarchyNode<TLevel1>;

/**
 * Depth-agnostic version of `TCategoryHierarchyNode` - a single flat type
 * that can represent an L1, L2, *or* L3 node, used as the row type for the
 * categories table.
 *
 * `TCategoryHierarchy` (= `TCategoryHierarchyNode<TLevel1>`) can't be reused
 * for this: it's locked to `level: 1` specifically (an L1 node whose
 * `subcategories` are typed as L2 nodes, whose `subcategories` are typed as
 * L3 nodes - each depth gets its own distinct type via the conditional in
 * `TCategoryHierarchyNode`). tanstack/react-table needs one consistent
 * `TData` for every row regardless of depth (`getSubRows`, `columns`,
 * `row.original` are all typed against a single `TData`) - handing it an L2
 * node (`level: 2`) where `TData = TCategoryHierarchy` demands `level: 1` is
 * a real type error (`Type '2' is not assignable to type '1'`), not just a
 * style preference.
 *
 * `TCategoryNode` fixes that by using `TCategory` (already the
 * `TL1Category | TL2Category | TL3Category` union) with `subcategories`
 * recursing into itself instead of a level-specific type, so a node at any
 * depth satisfies it. `TCategoryHierarchy[]` is structurally assignable to
 * `TCategoryNode[]` as-is, so the hierarchy API's response can be passed to
 * the table without a cast.
 */
export type TCategoryNode = TCategory & { subcategories?: TCategoryNode[] };

export type TCreateHeaders = Omit<
  ICreateHeaders<Partial<Pick<IUser, '_id' | 'role'>>>,
  'serviceSecret'
>;

export type TRouteNode = Record<string, unknown> & { base?: string };

export interface IEndpoint {
  path: string;
  method: Lowercase<TApiMethod>;
}

export type TParams = Record<string, string | number>;

type TExtractRouteParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? Record<Param | keyof TExtractRouteParams<`/${Rest}`>, string | number>
  : T extends `${string}:${infer Param}`
    ? Record<Param, string | number>
    : never;

type TUrl<FullPath extends string> =
  TExtractRouteParams<FullPath> extends never
    ? FullPath
    : (params: TExtractRouteParams<FullPath>) => FullPath;

interface IGeneratedEndpoint<T extends IEndpoint, FullPath extends string> {
  method: Uppercase<T['method']>;
  url: TUrl<FullPath>;
}

export type TGenerateRoutes<
  T,
  ParentPath extends string = T extends { base: infer B } ? (B extends string ? B : '') : '',
> = {
  [K in keyof T as K extends 'base' ? never : K]: T[K] extends IEndpoint
    ? IGeneratedEndpoint<T[K], `${ParentPath}${T[K]['path']}`>
    : T[K] extends Record<string, unknown>
      ? TGenerateRoutes<
          T[K],
          `${ParentPath}${T[K] extends {
            base: infer B;
          }
            ? B extends string
              ? B
              : ''
            : ''}`
        >
      : never;
};

type TQueryKey<FullPath extends string, Method extends string> =
  TExtractRouteParams<FullPath> extends never
    ? readonly [Uppercase<Method>, FullPath]
    : (params: TExtractRouteParams<FullPath>) => readonly [Uppercase<Method>, FullPath];

export type TGenerateQueryKeys<
  T,
  ParentPath extends string = T extends { base: infer B } ? (B extends string ? B : '') : '',
> = {
  [K in keyof T as K extends 'base' ? never : K]: T[K] extends IEndpoint
    ? TQueryKey<`${ParentPath}${T[K]['path']}`, T[K]['method']>
    : T[K] extends Record<string, unknown>
      ? TGenerateQueryKeys<
          T[K],
          `${ParentPath}${T[K] extends {
            base: infer B;
          }
            ? B extends string
              ? B
              : ''
            : ''}`
        >
      : never;
};

type TApiTryOn =
  | { enabled: boolean; configured: false }
  | ({ enabled: false; configured: true } & Partial<TTryOnSelection>)
  | ({ enabled: true; configured: true } & TTryOnSelection);

export type TRemoveFileType<T> = {
  [K in keyof T]: T[K] extends (infer U)[] ? Exclude<U, File>[] : Exclude<T[K], File>;
};

export type TApiProductBase = IId &
  ITimeStamp &
  Pick<TProductBasicInfoZodSchema, 'title' | 'brand' | 'sellingPrice' | 'originalPrice'> &
  Omit<TProductDescriptionAndContentZodSchema, 'step'> &
  TRemoveFileType<Omit<TProductMediaAndGalleryZodSchema, 'step'>> & {
    tryOn: TApiTryOn;
    seller: string;
    sku: string;
    slug: string;
    discount: number;
    soldCount: number;
    returnCount: number;
    reviews: string[];
    totalReviews: number;
    averageRating: number;
    totalRating: number;
    status: TProductStatus;
    history?: {
      approvedBy?: string | null;
      approvedAt?: string | null;
      blockedBy?: string | null;
      blockedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectReason?: string | null;
    };
  };

type TVariant = TRemoveFileType<TProductWithVariantsZodSchema['variants'][number]> & {
  sku: string;
  discount: number;
  images: string[];
  thumbnail?: string;
} & IId;

type TApiStockAndVariants =
  | Omit<TProductWithoutVariantsZodSchema, 'step'>
  | (Pick<TProductWithVariantsZodSchema, 'hasVariants'> & { variants: TVariant[] });

export type TApiProduct = TApiProductBase & TApiStockAndVariants & { category: string };

export type TApiProductPopulated = TApiProductBase &
  TApiStockAndVariants & { category: TCategory; seller: unknown };

export type TProductSortBy = keyof Pick<
  TApiProduct,
  'createdAt' | 'updatedAt' | 'title' | 'sellingPrice' | 'originalPrice' | 'soldCount'
>;

export interface IGetDashboardProductsQuery {
  page: string;
  limit: string;
  search?: string;
  status?: TProductStatus;
  category?: string;
  sortBy?: TProductSortBy;
  sortOrder?: TSort;
}

export interface IApiPagination {
  page: number;
  totalPages: number;
}

export interface IDashboardProductsResponse {
  products: TApiProductPopulated[];
  pagination: IApiPagination;
  counts: Record<TProductStatus | 'ALL', number>;
}

export interface IContactQuery
  extends IId, Pick<ITimeStamp, 'createdAt'>, TCreateContactQueryZodSchema {
  status: TContactQueryStatus;
  expiresAt?: string | null;
}

export interface IContactQueriesListResponse {
  queries: IContactQuery[];
  pagination: IApiPagination;
}

export interface IUpdateContactQueryStatus {
  ticketId: string;
  status: TContactQueryStatus;
}
