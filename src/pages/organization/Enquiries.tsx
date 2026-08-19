/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { CONTACT_QUERY_STATUS, CONTACT_QUERY_TYPES } from '@beautinique/frontend-constants';
import type { IListContactQueriesQuery, TContactQueryStatus } from '@beautinique/frontend-types';
import { isNullOrUndefined } from '@beautinique/shared-utils';
import { Icon } from '@iconify/react';
import { useTable } from '@tanstack/react-table';
import { Fragment, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

import ApiStatus from '@/components/layout/ApiStatus';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import LoadingText from '@/components/layout/loaders/LoadingText';
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableRowCell,
} from '@/components/layout/table';
import Select from '@/components/ui/inputs/Select';
import { APP_TABLE_FEATURES, createAppColumnHelper, toColumn } from '@/constants/table.constants';
import useQueryParams from '@/hooks/useQueryParams';
import {
  useGetContactQueries,
  useUpdateContactQueryStatus,
} from '@/services/organization-service/contact.service.query';
import type { IContactQuery, IUpdateContactQueryStatus } from '@/types/api.type';
import { formatDate } from '@/utils/common.util';

const STATUS_ICONS: Record<TContactQueryStatus, string> = {
  OPENED: 'solar:bell-linear',
  ANSWERED: 'solar:chat-round-check-linear',
  CLOSED: 'solar:check-circle-linear',
  REJECTED: 'solar:close-circle-linear',
};

const STATUS_ICON_COLORS: Record<TContactQueryStatus, string> = {
  OPENED: 'text-primary-yellow',
  ANSWERED: 'text-picton-blue-c',
  CLOSED: 'text-primary-green',
  REJECTED: 'text-primary-red',
};

const columnHelper = createAppColumnHelper<IContactQuery>();

const Enquiries = () => {
  const { ref, inView } = useInView();
  const { queryParams, removeParams, setParams } = useQueryParams();
  const {
    data: enquiries,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useGetContactQueries({
    queryType: queryParams.queryType as IListContactQueriesQuery['queryType'] | undefined,
    status: queryParams.status?.toUpperCase() as IListContactQueriesQuery['status'] | undefined,
  });
  const { mutateAsync, isPending: isUpdatingStatus } = useUpdateContactQueryStatus();

  const handleUpdateStatus = async (data: IUpdateContactQueryStatus) => {
    await mutateAsync(data);
  };

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
        columnHelper.accessor('name', { header: () => 'Name', cell: (info) => info.getValue() }),
      ),
      toColumn(
        columnHelper.accessor('_id', {
          header: () => 'Ticket Id',
          cell: (info) => <span className="uppercase">{info.getValue()}</span>,
        }),
      ),
      toColumn(
        columnHelper.accessor('message', {
          header: () => 'Message',
          cell: (info) => <p className="max-w-sm truncate text-left">{info.getValue()}</p>,
        }),
      ),
      toColumn(
        columnHelper.accessor('email', {
          header: () => 'Email',
          cell: (info) => (
            <Link
              className="text-primary group flex items-center gap-2"
              to={`mailto:${info.getValue()}`}
              target="_blank"
            >
              <span className="size-4 shrink-0">
                <Icon
                  icon="solar:letter-linear"
                  className="group-hover:text-blue-crayola-c size-full"
                />
              </span>
              {info.getValue()}
            </Link>
          ),
        }),
      ),
      toColumn(
        columnHelper.accessor('phoneNumber', {
          header: () => 'Phone Number',
          cell: (info) => {
            const phoneNumber = info.getValue();
            return (
              <span className="text-primary space-x-2 text-start">
                {!!phoneNumber && (
                  <Fragment>
                    <Link
                      target="_blank"
                      className="size-3.5"
                      to={`https://wa.me/+91${phoneNumber}`}
                    >
                      <Icon icon="logos:whatsapp-icon" className="inline size-3.5" />
                    </Link>
                    <Link target="_blank" to={`tel:${phoneNumber}`}>
                      <Icon
                        icon="solar:phone-calling-bold-duotone"
                        className="[&>*:first-child]:text-blue-crayola-c stroke-primary inline [&>*:first-child]:opacity-100"
                      />
                    </Link>
                  </Fragment>
                )}
                <span>{phoneNumber}</span>
              </span>
            );
          },
        }),
      ),
      toColumn(
        columnHelper.accessor('queryType', {
          header: () => 'Query Type',
          cell: (info) => info.getValue(),
        }),
      ),
      toColumn(
        columnHelper.accessor('status', {
          header: () => 'Status',
          cell: (info) => {
            const query = info.row.original;
            return (
              <Select
                key={`status-${query._id}`}
                icons={{
                  left: {
                    icon: STATUS_ICONS[query.status],
                    className: STATUS_ICON_COLORS[query.status],
                  },
                }}
                options={CONTACT_QUERY_STATUS.map((status) => ({
                  label: status.toLowerCase(),
                  value: status,
                }))}
                selectProps={{
                  value: query.status,
                  onChange: async (value) => {
                    if (!value) return;
                    await handleUpdateStatus({
                      ticketId: query._id,
                      status: value as TContactQueryStatus,
                    });
                  },
                  placeholder: 'Status',
                  disabled: isUpdatingStatus,
                }}
                className="gap-2! text-left [&>div>span]:py-2! [&>div>span]:text-xs"
                containerClassName="min-w-32"
                optionsClassName="[&>ul>li>span]:text-xs"
              />
            );
          },
        }),
      ),
      toColumn(
        columnHelper.accessor('createdAt', {
          header: () => 'Raised At',
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
        columnHelper.accessor('expiresAt', {
          header: () => 'Expires At',
          cell: (info) => {
            const expiresAt = info.getValue();
            return (
              <span className="uppercase">
                {!isNullOrUndefined(expiresAt)
                  ? formatDate(expiresAt, { month: '2-digit', hour: '2-digit', minute: '2-digit' })
                  : '-'}
              </span>
            );
          },
        }),
      ),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleUpdateStatus closes over mutateAsync (stable), only isUpdatingStatus needs to trigger a rebuild
    [isUpdatingStatus],
  );

  const table = useTable({
    features: APP_TABLE_FEATURES,
    data: enquiries ?? [],
    columns,
    getRowId: (row) => row._id,
  });

  const rows = table.getRowModel().rows;

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <PageWrapper
      navbar={{
        children: (
          <div className="base:justify-between flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <Select
              key="queryType"
              options={CONTACT_QUERY_TYPES.map((value) => ({ label: value, value }))}
              selectProps={{
                value: queryParams.queryType ?? '',
                onChange: (value) => {
                  if (!value) {
                    removeParams(['queryType']);
                  } else if (value) {
                    setParams({ queryType: String(value) });
                  }
                },
                placeholder: 'Select query type',
              }}
              containerClassName="min-w-40 max-w-50! w-full"
              optionsClassName="z-50"
            />
            <Select
              key="status"
              options={CONTACT_QUERY_STATUS.map((value) => ({
                label: value,
                value: value.toLowerCase(),
              }))}
              selectProps={{
                value: queryParams.status ?? '',
                onChange: (value) => {
                  if (!value) {
                    removeParams(['status']);
                  } else if (value) {
                    setParams({ status: String(value) });
                  }
                },
                placeholder: 'Select query status',
              }}
              containerClassName="min-w-40 max-w-50! w-full"
              optionsClassName="z-50 lowercase"
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
                    ref={row.index === rows.length - 10 ? ref : undefined}
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

        {(isLoading ||
          isFetchingNextPage ||
          isError ||
          isFetchNextPageError ||
          rows.length === 0) && (
          <div
            className={`flex items-center justify-center ${!isFetchingNextPage ? 'min-h-[40dvh]' : ''}`}
          >
            {isLoading || isFetchingNextPage ? (
              <LoadingText
                text={isLoading ? 'Loading queries...' : 'Loading more queries...'}
                className="my-2"
              />
            ) : (
              <ApiStatus
                className="min-h-0!"
                status={isError || isFetchNextPageError ? 'error' : 'empty'}
                title={
                  isError
                    ? 'Failed to load queries'
                    : isFetchNextPageError
                      ? 'Failed to load more queries'
                      : 'No queries available'
                }
                description={
                  isError
                    ? 'Something went wrong while fetching queries. Please try again.'
                    : isFetchNextPageError
                      ? 'Something went wrong while fetching more queries. Please try again.'
                      : 'No queries have been reported yet.'
                }
              />
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Enquiries;
