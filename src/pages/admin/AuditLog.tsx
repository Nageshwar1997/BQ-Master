import type {
  TTerritoryAssignmentReason,
  TTerritoryStatusChangeReason,
} from '@beautinique/frontend-types';
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
import Radio from '@/components/ui/inputs/Radio';
import { APP_TABLE_FEATURES, createAppColumnHelper, toColumn } from '@/constants/table.constants';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetSellerQueue } from '@/services/organization-service/seller.service.query';
import { useGetTerritoryMap } from '@/services/user-service/admin.service.query';
import { formatDate } from '@/utils/common.util';

/* -------------------------------------------------------------------------- */
/*                          ADMIN STATUS HISTORY TAB                          */
/* -------------------------------------------------------------------------- */

interface IAdminStatusLogRow {
  id: string;
  adminName: string;
  status: string;
  reason: TTerritoryStatusChangeReason;
  note?: string;
  changedAt: string;
  changedByName: string;
}

const statusColumnHelper = createAppColumnHelper<IAdminStatusLogRow>();

const statusColumns = [
  toColumn(
    statusColumnHelper.accessor('adminName', {
      header: () => 'Admin',
      cell: (info) => <span className="text-left">{info.getValue()}</span>,
    }),
  ),
  toColumn(
    statusColumnHelper.accessor('status', {
      header: () => 'New Status',
      cell: (info) => <span className="capitalize">{info.getValue().replaceAll('_', ' ')}</span>,
    }),
  ),
  toColumn(
    statusColumnHelper.accessor('reason', {
      header: () => 'Reason',
      cell: (info) => <span className="capitalize">{info.getValue().toLowerCase()}</span>,
    }),
  ),
  toColumn(
    statusColumnHelper.accessor('note', {
      header: () => 'Note',
      cell: (info) => <span className="max-w-xs truncate text-left">{info.getValue() ?? '—'}</span>,
    }),
  ),
  toColumn(
    statusColumnHelper.accessor('changedByName', {
      header: () => 'Changed By',
      cell: (info) => info.getValue(),
    }),
  ),
  toColumn(
    statusColumnHelper.accessor('changedAt', {
      header: () => 'Changed At',
      cell: (info) => (
        <span className="uppercase">
          {formatDate(info.getValue(), { month: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    }),
  ),
];

/* -------------------------------------------------------------------------- */
/*                        SELLER ASSIGNMENT HISTORY TAB                       */
/* -------------------------------------------------------------------------- */

interface ISellerAssignmentLogRow {
  id: string;
  sellerName: string;
  state: string;
  assignedAdminName: string;
  reason: TTerritoryAssignmentReason;
  assignedAt: string;
}

const assignmentColumnHelper = createAppColumnHelper<ISellerAssignmentLogRow>();

const assignmentColumns = [
  toColumn(
    assignmentColumnHelper.accessor('sellerName', {
      header: () => 'Seller',
      cell: (info) => <span className="text-left">{info.getValue()}</span>,
    }),
  ),
  toColumn(
    assignmentColumnHelper.accessor('state', {
      header: () => 'State',
      cell: (info) => info.getValue(),
    }),
  ),
  toColumn(
    assignmentColumnHelper.accessor('assignedAdminName', {
      header: () => 'Assigned To',
      cell: (info) => info.getValue(),
    }),
  ),
  toColumn(
    assignmentColumnHelper.accessor('reason', {
      header: () => 'Reason',
      cell: (info) => (
        <span className="capitalize">{info.getValue().replaceAll('_', ' ').toLowerCase()}</span>
      ),
    }),
  ),
  toColumn(
    assignmentColumnHelper.accessor('assignedAt', {
      header: () => 'Assigned At',
      cell: (info) => (
        <span className="uppercase">
          {formatDate(info.getValue(), { month: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    }),
  ),
];

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

const AuditLog = () => {
  const { queryParams, setParams } = useQueryParams();
  const tab = queryParams.tab === 'assignments' ? 'assignments' : 'status';

  // `includeInactive: true` - a demoted admin (task 7.1) still needs their
  // full `statusHistory` visible here, even though Territory Management
  // hides them from the day-to-day view.
  const {
    data: admins,
    isLoading: isLoadingAdmins,
    isError: isAdminsError,
  } = useGetTerritoryMap(true);

  // `status: 'ALL'` (task 7.3) - an audit trail needs every seller
  // regardless of where it currently stands, not just PENDING.
  const {
    data: sellers,
    isLoading: isLoadingSellers,
    isError: isSellersError,
  } = useGetSellerQueue({ status: 'ALL', filter: 'all' });

  // Shared lookup - both tabs resolve a raw admin/user ObjectId to a
  // display name from the same territory-map data (a `MASTER` who's ever
  // force-changed a status also has an auto-provisioned `Admin` profile,
  // see `WorkerManager`'s `update-role` handler, so this covers them too).
  const adminNameById = useMemo(() => {
    const map = new Map<string, string>();

    for (const admin of admins ?? []) {
      map.set(admin.user._id, `${admin.user.firstName} ${admin.user.lastName}`);
    }

    return map;
  }, [admins]);

  const statusRows = useMemo(() => {
    const rows: IAdminStatusLogRow[] = [];

    for (const admin of admins ?? []) {
      const adminName = adminNameById.get(admin.user._id) ?? admin.user._id;

      admin.statusHistory.forEach((entry, index) => {
        rows.push({
          id: `${admin._id}-${String(index)}`,
          adminName,
          status: entry.status,
          reason: entry.reason,
          note: entry.note,
          changedAt: entry.changedAt,
          changedByName: adminNameById.get(entry.changedBy) ?? entry.changedBy,
        });
      });
    }

    return rows.sort((a, b) => (a.changedAt < b.changedAt ? 1 : -1));
  }, [admins, adminNameById]);

  const assignmentRows = useMemo(() => {
    const rows: ISellerAssignmentLogRow[] = [];

    for (const seller of sellers ?? []) {
      seller.assignedAdminHistory.forEach((entry, index) => {
        rows.push({
          id: `${seller._id}-${String(index)}`,
          sellerName: seller.businessDetails.name,
          state: seller.address.state,
          assignedAdminName: adminNameById.get(entry.admin) ?? entry.admin,
          reason: entry.reason,
          assignedAt: entry.assignedAt,
        });
      });
    }

    return rows.sort((a, b) => (a.assignedAt < b.assignedAt ? 1 : -1));
  }, [sellers, adminNameById]);

  const statusTable = useTable({
    features: APP_TABLE_FEATURES,
    data: statusRows,
    columns: statusColumns,
    getRowId: (row) => row.id,
  });

  const assignmentTable = useTable({
    features: APP_TABLE_FEATURES,
    data: assignmentRows,
    columns: assignmentColumns,
    getRowId: (row) => row.id,
  });

  const isLoading = tab === 'status' ? isLoadingAdmins : isLoadingSellers;
  const isError = tab === 'status' ? isAdminsError : isSellersError;
  // Kept as two fully-separate render branches below (not a shared
  // `activeTable`/`rows` variable) - `statusTable`/`assignmentTable` have
  // different row types, and tanstack's `Header`/`Cell` types don't unify
  // across them, so a shared variable would need an unsafe cast.
  const rowCount =
    tab === 'status'
      ? statusTable.getRowModel().rows.length
      : assignmentTable.getRowModel().rows.length;

  return (
    <PageWrapper
      navbar={{
        children: (
          <Radio
            value={tab}
            onChange={(value) => {
              setParams({ tab: value });
            }}
            options={[
              { label: 'Admin Status Changes', value: 'status' },
              { label: 'Seller Assignments', value: 'assignments' },
            ]}
            className="w-80!"
          />
        ),
      }}
    >
      <div className="border-primary/10 bg-secondary-invert overflow-hidden rounded-xl border">
        {!!rowCount && tab === 'status' && (
          <ScrollableGradientContainer
            direction="horizontal"
            gradientClassNames={{ left: 'from-secondary-invert', right: 'from-secondary-invert' }}
          >
            <Table className="relative text-xs">
              <TableHead>
                {statusTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHeadCell key={header.id}>
                        {header.isPlaceholder ? null : <statusTable.FlexRender header={header} />}
                      </TableHeadCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {statusTable.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    tabIndex={0}
                    className="border-y-primary/5 odd:bg-primary/5 even:bg-primary/2.5 border-y first:border-t-0 last:border-b-0 [&>td]:px-3 [&>td]:py-2 [&>td]:text-xs"
                  >
                    {row.getAllCells().map((cell) => (
                      <TableRowCell key={cell.id}>
                        <statusTable.FlexRender cell={cell} />
                      </TableRowCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollableGradientContainer>
        )}

        {!!rowCount && tab === 'assignments' && (
          <ScrollableGradientContainer
            direction="horizontal"
            gradientClassNames={{ left: 'from-secondary-invert', right: 'from-secondary-invert' }}
          >
            <Table className="relative text-xs">
              <TableHead>
                {assignmentTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHeadCell key={header.id}>
                        {header.isPlaceholder ? null : (
                          <assignmentTable.FlexRender header={header} />
                        )}
                      </TableHeadCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {assignmentTable.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    tabIndex={0}
                    className="border-y-primary/5 odd:bg-primary/5 even:bg-primary/2.5 border-y first:border-t-0 last:border-b-0 [&>td]:px-3 [&>td]:py-2 [&>td]:text-xs"
                  >
                    {row.getAllCells().map((cell) => (
                      <TableRowCell key={cell.id}>
                        <assignmentTable.FlexRender cell={cell} />
                      </TableRowCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollableGradientContainer>
        )}

        {(isLoading || isError || rowCount === 0) && (
          <div className="flex min-h-[40dvh] items-center justify-center">
            {isLoading ? (
              <ApiStatus status="loading" text="Loading audit log..." />
            ) : (
              <ApiStatus
                className="min-h-0!"
                status={isError ? 'error' : 'empty'}
                title={isError ? 'Failed to load audit log' : 'No history yet'}
                description={
                  isError
                    ? 'Something went wrong while fetching the audit log. Please try again.'
                    : tab === 'status'
                      ? 'No admin status changes recorded yet.'
                      : 'No seller assignment history recorded yet.'
                }
              />
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default AuditLog;
