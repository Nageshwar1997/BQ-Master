import { SORT_MAP } from '@beautinique/frontend-constants';
import { Icon } from '@iconify/react';
import type { ExpandedState, HeaderContext, SortingState } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import { Fragment, useCallback, useDeferredValue, useMemo, useState } from 'react';

import ApiStatus from '@/components/layout/ApiStatus';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import LoadingText from '@/components/layout/loaders/LoadingText';
import ConfirmModal from '@/components/layout/modals/ConfirmModal';
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableRowCell,
} from '@/components/layout/table';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/inputs/Input';
import { EMPTY_ARRAY, QUERY_PARAMS_KEY_MAP } from '@/constants/common.constants';
import {
  CATEGORY_TABLE_FEATURES,
  createCategoryColumnHelper,
  type TCategoryTableFeatures,
  toColumn,
} from '@/constants/table.constants';
import useDebounce from '@/hooks/useDebounce';
import useIsSmallScreen from '@/hooks/useIsSmallScreen';
import useQueryParams from '@/hooks/useQueryParams';
import {
  useDeleteCategory,
  useGetCategoriesHierarchy,
} from '@/services/product-service/category.service.query';
import type { TCategoryNode } from '@/types/api.type';
import type { ICatModal } from '@/types/component.type';
import { filterCategoryTree } from '@/utils/api.util';

import CategoryActions from './children/CategoryActions';
import CategoryInfo from './children/CategoryInfo';
import CategoryModal from './children/CategoryModal';

const q_cat_keys = QUERY_PARAMS_KEY_MAP.category;

const columnHelper = createCategoryColumnHelper<TCategoryNode>();

const countNodes = (nodes: TCategoryNode[]): number =>
  nodes.reduce(
    (acc, node) => acc + 1 + (node.subcategories ? countNodes(node.subcategories) : 0),
    0,
  );

// Renders a header cell driven entirely by tanstack/react-table's own
// row-sorting feature - `column.getToggleSortingHandler()` for the click
// handler and `column.getIsSorted()` for the current direction. The single
// sort applies to every depth: `sortedRowModel` recursively sorts each
// node's `subRows`, so L1/L2/L3 siblings all sort the same way.
const renderSortableHeader = (label: string) => {
  function SortableHeader<TValue>({
    column,
  }: HeaderContext<TCategoryTableFeatures, TCategoryNode, TValue>) {
    const sorted = column.getIsSorted();
    return (
      <button
        type="button"
        onClick={column.getToggleSortingHandler()}
        className="hover:text-primary/80 group flex cursor-pointer items-center gap-2"
      >
        {label}
        <Icon
          icon={
            sorted === 'asc'
              ? 'solar:arrow-up-linear'
              : sorted === 'desc'
                ? 'solar:arrow-down-linear'
                : 'solar:sort-linear'
          }
          className="group-hover:text-primary/80 size-4"
        />
      </button>
    );
  }

  return SortableHeader;
};

const Categories = () => {
  const { queryParams, setParams, removeParams, clearParams } = useQueryParams();
  const isSmallScreen = useIsSmallScreen(1024);

  const [searchQuery, setSearchQuery] = useState(queryParams[q_cat_keys.search] ?? '');
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [editData, setEditData] = useState<ICatModal | null>(null);
  const [deleteId, setDeleteId] = useState('');

  const { data: hierarchy = EMPTY_ARRAY, isLoading, isError } = useGetCategoriesHierarchy();
  const deleteCategory = useDeleteCategory({ categoryId: deleteId });

  const handleSearch = useDebounce({
    callback: (value: string) => {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        setParams({ [q_cat_keys.search]: trimmedValue });
      } else {
        removeParams([q_cat_keys.search]);
      }
    },
    delay: 600,
  });

  const search = useDeferredValue(queryParams[q_cat_keys.search] ?? '');
  const sortValue = queryParams[q_cat_keys.sort];

  const filteredTree = useMemo(() => filterCategoryTree(hierarchy, search), [hierarchy, search]);

  const totalCount = useMemo(() => countNodes(hierarchy), [hierarchy]);
  const visibleCount = useMemo(() => countNodes(filteredTree), [filteredTree]);

  const handleEdit = useCallback(
    (data: ICatModal) => {
      setEditData(data);
      setParams({ [q_cat_keys.mode]: q_cat_keys.edit });
    },
    [setParams],
  );

  const handleDelete = async () => {
    await deleteCategory.mutateAsync(deleteId, {
      onSettled: () => {
        setDeleteId('');

        setExpanded((prev) => {
          const map = prev === true ? {} : prev;
          if (!map[deleteId]) return prev;
          const { [deleteId]: _removed, ...rest } = map;
          return rest;
        });
      },
    });
  };

  const handleOnClose = () => {
    setEditData(null);
    removeParams([q_cat_keys.mode]);
  };

  const sorting: SortingState = sortValue
    ? [{ id: 'category', desc: sortValue === SORT_MAP.desc }]
    : [];

  const columns = useMemo(
    () => [
      toColumn(
        columnHelper.accessor('name', {
          id: 'category',
          header: renderSortableHeader('Category'),
          enableSorting: true,
          sortFn: (rowA, rowB) => rowA.original.name.localeCompare(rowB.original.name),
          cell: (info) => {
            const { row } = info;
            const canExpand = row.getCanExpand();
            return (
              <div className="flex items-center gap-2" style={{ paddingLeft: row.depth * 28 }}>
                {canExpand ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      row.toggleExpanded();
                    }}
                    className="text-primary/50 hover:text-primary shrink-0 cursor-pointer"
                  >
                    <Icon
                      icon={
                        row.getIsExpanded()
                          ? 'solar:alt-arrow-down-linear'
                          : 'solar:alt-arrow-right-linear'
                      }
                      className="size-4"
                    />
                  </button>
                ) : (
                  <span className="size-4 shrink-0" />
                )}
                <CategoryInfo category={row.original} />
              </div>
            );
          },
        }),
      ),
      toColumn(
        columnHelper.display({
          id: 'level',
          header: () => 'Level',
          cell: (info) => <Badge content={`Level ${String(info.row.original.level)}`} />,
        }),
      ),
      toColumn(
        columnHelper.display({
          id: 'parent',
          header: () => 'Parent',
          cell: (info) => {
            const category = info.row.original;
            return (
              <span className="text-primary/65 uppercase">
                {'parent' in category ? category.parent : 'N/A'}
              </span>
            );
          },
        }),
      ),
      toColumn(
        columnHelper.display({
          id: 'actions',
          header: () => 'Actions',
          cell: (info) => {
            const { row } = info;
            // Only an L3 (depth 2) category carries a `mainCatId` - the L1
            // root ancestor, needed by the edit modal's hierarchy context.
            const mainCatId = row.depth === 2 ? row.getParentRows()[0]?.original._id : undefined;
            return (
              <CategoryActions
                category={row.original}
                mainCatId={mainCatId}
                onDelete={setDeleteId}
                onEdit={handleEdit}
              />
            );
          },
        }),
      ),
    ],
    [handleEdit],
  );

  const table = useTable({
    features: CATEGORY_TABLE_FEATURES,
    data: filteredTree,
    columns,
    getRowId: (row) => row._id,
    getSubRows: (row) => row.subcategories,
    state: { sorting, expanded: search ? true : expanded },
    enableMultiSort: false,
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      const first = next[0];
      if (!first) {
        removeParams([q_cat_keys.sort]);
        return;
      }
      setParams({ [q_cat_keys.sort]: first.desc ? SORT_MAP.desc : SORT_MAP.asc });
    },
    onExpandedChange: (updater) => {
      setExpanded((prev) => (typeof updater === 'function' ? updater(prev) : updater));
    },
  });
  const rows = table.getRowModel().rows;

  const hasActiveParams = !!(queryParams[q_cat_keys.search] ?? queryParams[q_cat_keys.sort]);

  return (
    <Fragment>
      {queryParams[q_cat_keys.mode] === q_cat_keys.add && <CategoryModal />}
      <PageWrapper
        navbar={{
          buttons: [
            {
              content: 'Clear',
              pattern: 'secondary',
              leftIcon: { icon: 'solar:eraser-linear', className: '*:stroke-[2.5]' },
              buttonProps: {
                onClick: () => {
                  setSearchQuery('');
                  clearParams();
                },
              },
              className: !hasActiveParams ? 'hidden' : '',
            },
            {
              content: 'Add',
              pattern: 'primary',
              leftIcon: { icon: 'solar:add-circle-linear', className: '*:stroke-[2.5]' },
              buttonProps: {
                onClick: () => {
                  setParams({ [q_cat_keys.mode]: q_cat_keys.add });
                },
              },
            },
          ],
        }}
      >
        <div className="border-primary/10 bg-secondary-invert rounded-xl border">
          <div className="space-y-3 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-primary/50 text-xs">All categories</p>
              <Badge content={`${String(visibleCount)}/${String(totalCount)} items`} />
            </div>
            <Input
              needRef={!isSmallScreen}
              inputProps={{
                name: 'search',
                placeholder: 'Search categories here...',
                value: searchQuery,
                onChange: (e) => {
                  const value = (e.target.value || '').trimStart();
                  setSearchQuery(value);
                  handleSearch(value);
                },
              }}
              containerClassName="max-w-sm"
              className="bg-silver/10!"
              icons={{
                right: {
                  icon: 'solar:magnifer-linear',
                  className: 'text-primary/50 size-4 md:size-5',
                },
              }}
            />
          </div>
          <ScrollableGradientContainer
            direction="horizontal"
            gradientClassNames={{ left: 'from-secondary-invert', right: 'from-secondary-invert' }}
          >
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHeadCell className="first:text-left last:text-right" key={header.id}>
                        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                      </TableHeadCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {rows.length ? (
                  rows.map((row) => {
                    const canExpand = row.getCanExpand();
                    return (
                      <TableRow
                        key={row.id}
                        tabIndex={0}
                        onClick={canExpand ? row.getToggleExpandedHandler() : undefined}
                        onKeyDown={
                          canExpand
                            ? (event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  row.toggleExpanded();
                                }
                              }
                            : undefined
                        }
                        className={`border-y-primary/5 border-y first:border-t-0 last:border-b-0 ${canExpand ? 'hover:bg-primary/2 cursor-pointer' : ''}`}
                      >
                        {row.getAllCells().map((cell) => (
                          <TableRowCell className="first:text-left last:text-right" key={cell.id}>
                            <table.FlexRender cell={cell} />
                          </TableRowCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className="border-y-primary/5 border-y first:border-t-0 last:border-b-0">
                    <TableRowCell className="h-50" colSpan={4}>
                      {isLoading ? (
                        <LoadingText text="Loading..." className="mx-auto my-2" />
                      ) : (
                        <ApiStatus
                          className="min-h-0!"
                          status={isError ? 'error' : 'empty'}
                          title={
                            isError ? 'Failed to load categories' : 'No matching categories found'
                          }
                          description={
                            isError
                              ? 'Something went wrong while fetching categories. Please try again.'
                              : 'Try searching with a different keyword or clear the search.'
                          }
                        />
                      )}
                    </TableRowCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollableGradientContainer>
        </div>
        {queryParams[q_cat_keys.mode] === q_cat_keys.edit && editData && (
          <CategoryModal {...editData} onClose={handleOnClose} />
        )}
        {!!deleteId && (
          <ConfirmModal
            modalProps={{
              isOpen: !!deleteId,
              onClose: () => {
                setDeleteId('');
              },
            }}
            type="warning"
            title="Are you sure?"
            description="Are you sure you want to delete this category? This action cannot be undone."
            buttons={{
              left: {
                content: 'Cancel',
                buttonProps: {
                  onClick: () => {
                    setDeleteId('');
                  },
                },
              },
              right: { content: 'Delete', buttonProps: { onClick: handleDelete } },
            }}
          />
        )}
      </PageWrapper>
    </Fragment>
  );
};

export default Categories;
