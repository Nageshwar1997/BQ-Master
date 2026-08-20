import type { TSellerApprovalStatus } from '@beautinique/frontend-types';
import { useTable } from '@tanstack/react-table';
import { useMemo } from 'react';

import ApiStatus from '@/components/layout/ApiStatus';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableRowCell,
} from '@/components/layout/table';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/inputs/Select';
import { APP_TABLE_FEATURES, createAppColumnHelper, toColumn } from '@/constants/table.constants';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetSellerQueue } from '@/services/organization-service/seller.service.query';
import type { ISeller, ISellerQueueQuery } from '@/types/api.type';
import { formatDate } from '@/utils/common.util';

const STATUS_BADGE_CLASSNAME: Record<TSellerApprovalStatus, string> = {
  PENDING: 'text-primary-yellow border-primary-yellow/30 bg-primary-yellow/5',
  APPROVED: 'text-primary-green border-primary-green/30 bg-primary-green/5',
  REJECTED: 'text-primary-red border-primary-red/30 bg-primary-red/5',
};

const columnHelper = createAppColumnHelper<ISeller>();

const AllSellers = () => {
  const { queryParams, setParams, removeParams } = useQueryParams();

  const filter = (queryParams.filter as ISellerQueueQuery['filter']) ?? 'all';
  const status = (queryParams.status as ISellerQueueQuery['status']) ?? 'PENDING';

  const { data: sellers, isLoading, isError } = useGetSellerQueue({ status, filter });

  const columns = useMemo(
    () => [
      toColumn(
        columnHelper.display({
          id: 'serial',
          header: () => 'S. No',
          cell: (info) => info.row.index + 1,
        }),
      ),
      toColumn(
        columnHelper.accessor((row) => row.businessDetails.name, {
          id: 'name',
          header: () => 'Business',
          cell: (info) => (
            <div className="flex flex-col gap-1 text-left">
              <span className="text-primary font-medium">{info.getValue()}</span>
              <span className="text-tertiary text-[11px] capitalize">
                {info.row.original.businessDetails.type.toLowerCase()}
              </span>
            </div>
          ),
        }),
      ),
      toColumn(
        columnHelper.accessor((row) => row.address.state, {
          id: 'state',
          header: () => 'State',
          cell: (info) => info.getValue(),
        }),
      ),
      toColumn(
        columnHelper.accessor((row) => row.assignedAdmin ?? '', {
          id: 'assignedAdmin',
          header: () => 'Assigned Admin',
          cell: (info) =>
            info.getValue() ? (
              <span className="text-[11px] uppercase">{info.getValue()}</span>
            ) : (
              <span className="text-primary-red text-xs italic">Unassigned</span>
            ),
        }),
      ),
      toColumn(
        columnHelper.accessor('createdAt', {
          header: () => 'Applied At',
          cell: (info) => (
            <span className="uppercase">
              {formatDate(info.getValue(), {
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          ),
        }),
      ),
      toColumn(
        columnHelper.accessor('approvalStatus', {
          header: () => 'Status',
          cell: (info) => (
            <Badge
              content={info.getValue().toLowerCase()}
              className={`capitalize ${STATUS_BADGE_CLASSNAME[info.getValue()]}`}
            />
          ),
        }),
      ),
    ],
    [],
  );

  const table = useTable({
    features: APP_TABLE_FEATURES,
    data: sellers ?? [],
    columns,
    getRowId: (row) => row._id,
  });

  const rows = table.getRowModel().rows;

  return (
    <PageWrapper
      navbar={{
        children: (
          <div className="base:justify-between flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <Select
              key="filter"
              options={[
                { label: 'All sellers', value: 'all' },
                { label: 'Unassigned only', value: 'unassigned' },
              ]}
              selectProps={{
                value: filter,
                onChange: (value) => {
                  if (!value || value === 'all') removeParams(['filter']);
                  else setParams({ filter: String(value) });
                },
                placeholder: 'Filter',
              }}
              containerClassName="min-w-40 max-w-50! w-full"
              optionsClassName="z-50"
            />
            <Select
              key="status"
              options={[
                { label: 'Pending', value: 'PENDING' },
                { label: 'Approved', value: 'APPROVED' },
                { label: 'Rejected', value: 'REJECTED' },
              ]}
              selectProps={{
                value: status,
                onChange: (value) => {
                  if (!value || value === 'PENDING') removeParams(['status']);
                  else setParams({ status: String(value) });
                },
                placeholder: 'Status',
              }}
              containerClassName="min-w-40 max-w-50! w-full"
              optionsClassName="z-50"
            />
          </div>
        ),
      }}
    >
      <div className="border-primary/10 bg-secondary-invert overflow-hidden rounded-xl border">
        {!!rows.length && (
          <ScrollableGradientContainer
            direction="horizontal"
            gradientClassNames={{ left: 'from-secondary-invert', right: 'from-secondary-invert' }}
          >
            <Table className="relative text-xs">
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHeadCell key={header.id}>
                        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                      </TableHeadCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    tabIndex={0}
                    className="border-y-primary/5 odd:bg-primary/5 even:bg-primary/2.5 border-y first:border-t-0 last:border-b-0 [&>td]:px-3 [&>td]:py-2 [&>td]:text-xs"
                  >
                    {row.getAllCells().map((cell) => (
                      <TableRowCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableRowCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollableGradientContainer>
        )}

        {(isLoading || isError || rows.length === 0) && (
          <div className="flex min-h-[40dvh] items-center justify-center">
            {isLoading ? (
              <ApiStatus status="loading" text="Loading sellers..." />
            ) : (
              <ApiStatus
                className="min-h-0!"
                status={isError ? 'error' : 'empty'}
                title={isError ? 'Failed to load sellers' : 'No sellers found'}
                description={
                  isError
                    ? 'Something went wrong while fetching sellers. Please try again.'
                    : 'No sellers match this filter right now.'
                }
              />
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default AllSellers;
