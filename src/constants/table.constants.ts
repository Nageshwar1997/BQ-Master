import type { ColumnDef, RowData, TableFeatures } from '@tanstack/react-table';
import {
  coreFeatures,
  createColumnHelper,
  createExpandedRowModel,
  createSortedRowModel,
  rowExpandingFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table';

// Core (table/column/row/header/cell + core row model) plus the row-sorting
// feature's state/UI plumbing (state.sorting, onSortingChange,
// column.getToggleSortingHandler()/getIsSorted()) - deliberately WITHOUT a
// `sortedRowModel` factory, so tanstack never reorders rows itself. Products
// sorts server-side via query params; tanstack only needs to drive the
// sort-toggle UI and expose the current sort state to it (`manualSorting:
// true` on the table that uses this).
export const APP_TABLE_FEATURES = tableFeatures({ ...coreFeatures, rowSortingFeature });
export type TAppTableFeatures = typeof APP_TABLE_FEATURES;

// The categories table loads the whole L1/L2/L3 tree up front (one hierarchy
// fetch, see Categories.tsx) rather than lazily fetching each level, so it
// gets real tanstack features throughout: `sortedRowModel` actually reorders
// rows (sorting is genuinely client-side), and `rowExpandingFeature` +
// `expandedRowModel` build the flattened, indented row list straight from
// each node's `subcategories` (via `getSubRows` on the table) instead of
// hand-rolled expand/collapse state per level.
export const CATEGORY_TABLE_FEATURES = tableFeatures({
  ...coreFeatures,
  rowSortingFeature,
  rowExpandingFeature,
  sortedRowModel: createSortedRowModel(),
  expandedRowModel: createExpandedRowModel(),
});
export type TCategoryTableFeatures = typeof CATEGORY_TABLE_FEATURES;

/** Same `createColumnHelper` every product/enquiry table page would otherwise
 * call directly, with `TAppTableFeatures` baked in so call sites only ever
 * need to name their row type. */
export const createAppColumnHelper = <TData extends RowData>() =>
  createColumnHelper<TAppTableFeatures, TData>();

/** `createAppColumnHelper`'s counterpart for the category tables' feature set. */
export const createCategoryColumnHelper = <TData extends RowData>() =>
  createColumnHelper<TCategoryTableFeatures, TData>();

/**
 * Widens one column definition's value type to `any` so a list of columns
 * with different value types (string/number/date/...) can live in a single
 * array and be handed to `useTable`. `TValue` (and `TFeatures`/`TData`) are
 * inferred from the column passed in, so `header`/`cell` callbacks inside
 * `def` are still checked against their own concrete value type - only the
 * value returned by this function loses that precision, not the definition
 * itself.
 */
export const toColumn = <TFeatures extends TableFeatures, TData extends RowData, TValue>(
  def: ColumnDef<TFeatures, TData, TValue>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see doc comment above
): ColumnDef<TFeatures, TData, any> => def;
