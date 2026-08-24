import { STATES_AND_UTS } from '@beautinique/frontend-constants';
import type { TAdminStatus, TStateOrUT } from '@beautinique/frontend-types';
import { useTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import ApiStatus from '@/components/layout/ApiStatus';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import { ModalWrapper } from '@/components/layout/modals/ModalWrapper';
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableRowCell,
} from '@/components/layout/table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/inputs/Checkbox';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import Textarea from '@/components/ui/inputs/Textarea';
import Tooltip from '@/components/ui/Tooltip';
import { APP_TABLE_FEATURES, createAppColumnHelper, toColumn } from '@/constants/table.constants';
import {
  useAssignAdminTerritory,
  useDemoteAdmin,
  useGetTerritoryMap,
  useUpdateAdminStatus,
} from '@/services/user-service/admin.service.query';
import type { IAdminPopulated } from '@/types/api.type';

const STATUS_BADGE_CLASSNAME: Record<TAdminStatus, string> = {
  ACTIVE: 'text-primary-green border-primary-green/30 bg-primary-green/5',
  ON_LEAVE: 'text-primary-yellow border-primary-yellow/30 bg-primary-yellow/5',
  SUSPENDED: 'text-primary-red border-primary-red/30 bg-primary-red/5',
  INACTIVE: 'text-tertiary border-primary/10 bg-primary/5',
};

const columnHelper = createAppColumnHelper<IAdminPopulated>();

/* -------------------------------------------------------------------------- */
/*                          ASSIGN TERRITORY MODAL                            */
/* -------------------------------------------------------------------------- */

// `key={admin._id}` on the form below remounts it fresh whenever a different
// admin is opened, so the form always starts seeded from that admin's actual
// current territory - no effect/sync needed to keep it in step.
const AssignTerritoryForm = ({
  admin,
  otherAdmins,
  onClose,
}: {
  admin: IAdminPopulated;
  otherAdmins: IAdminPopulated[];
  onClose: () => void;
}) => {
  const [states, setStates] = useState<TStateOrUT[]>(admin.assignedStates);
  const [priority, setPriority] = useState(String(admin.priority));
  const [backupAdmin, setBackupAdmin] = useState(admin.backupAdmin ?? '');
  const { mutateAsync, isPending } = useAssignAdminTerritory();

  const toggleState = (state: TStateOrUT) => {
    setStates((prev) =>
      prev.includes(state) ? prev.filter((value) => value !== state) : [...prev, state],
    );
  };

  const handleSubmit = async () => {
    if (!states.length) return;

    await mutateAsync(
      {
        adminId: admin.user._id,
        data: {
          states,
          priority: priority.trim() || undefined,
          backupAdmin: backupAdmin || undefined,
        },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-tertiary text-xs sm:text-sm">
        Assigning territory for{' '}
        <span className="text-primary font-semibold">
          {admin.user.firstName} {admin.user.lastName}
        </span>
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-primary/55 text-xs font-semibold uppercase">States</span>
        <div className="border-primary/10 grid max-h-60 grid-cols-2 gap-x-3 gap-y-2 overflow-y-auto rounded-lg border p-3 sm:grid-cols-3">
          {STATES_AND_UTS.map((state) => (
            <Checkbox
              key={state}
              content={state}
              checkboxProps={{
                checked: states.includes(state),
                onChange: () => {
                  toggleState(state);
                },
                disabled: isPending,
              }}
            />
          ))}
        </div>
      </div>

      <Input
        label="Priority (optional - tie-break for same-state admins)"
        inputProps={{
          type: 'number',
          value: priority,
          onChange: (e) => {
            setPriority(e.target.value);
          },
          disabled: isPending,
          min: 0,
        }}
      />

      <Select
        label="Backup admin (optional)"
        options={otherAdmins.map((other) => ({
          label: `${other.user.firstName} ${other.user.lastName}`,
          value: other.user._id,
        }))}
        selectProps={{
          value: backupAdmin,
          onChange: (value) => {
            setBackupAdmin(String(value));
          },
          placeholder: 'No backup admin',
          disabled: isPending,
        }}
      />

      <Button
        pattern="primary"
        content="Save territory"
        buttonProps={{
          disabled: isPending || !states.length,
          onClick: () => {
            void handleSubmit();
          },
        }}
      />
    </div>
  );
};

const AssignTerritoryModal = ({
  admin,
  otherAdmins,
  onClose,
}: {
  admin: IAdminPopulated | null;
  otherAdmins: IAdminPopulated[];
  onClose: () => void;
}) => (
  <ModalWrapper
    isOpen={!!admin}
    onClose={onClose}
    header={{ title: 'Assign territory', showCloseIcon: true }}
    className="max-w-lg"
  >
    {admin && (
      <AssignTerritoryForm
        key={admin._id}
        admin={admin}
        otherAdmins={otherAdmins}
        onClose={onClose}
      />
    )}
  </ModalWrapper>
);

/* -------------------------------------------------------------------------- */
/*                          STATUS OVERRIDE MODAL                             */
/* -------------------------------------------------------------------------- */

const StatusOverrideForm = ({
  admin,
  onClose,
}: {
  admin: IAdminPopulated;
  onClose: () => void;
}) => {
  const [status, setStatus] = useState<TAdminStatus>(admin.status);
  const [reason, setReason] = useState('');
  const [leaveUntil, setLeaveUntil] = useState('');
  const { mutateAsync, isPending } = useUpdateAdminStatus();

  const needsReason = status === 'ON_LEAVE' || status === 'SUSPENDED';

  const handleSubmit = async () => {
    if (status === admin.status) return;
    if (needsReason && !reason.trim()) return;

    await mutateAsync(
      {
        adminId: admin.user._id,
        data:
          status === 'ACTIVE'
            ? { status: 'ACTIVE' }
            : status === 'ON_LEAVE'
              ? { status: 'ON_LEAVE', reason: reason.trim(), leaveUntil: leaveUntil || undefined }
              : { status: 'SUSPENDED', reason: reason.trim() },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-tertiary text-xs sm:text-sm">
        Overriding status for{' '}
        <span className="text-primary font-semibold">
          {admin.user.firstName} {admin.user.lastName}
        </span>{' '}
        - currently <span className="capitalize">{admin.status.replaceAll('_', ' ')}</span>.
      </p>

      <Select
        label="New status"
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'On leave', value: 'ON_LEAVE' },
          { label: 'Suspended', value: 'SUSPENDED' },
        ]}
        selectProps={{
          value: status,
          onChange: (value) => {
            setStatus(value as TAdminStatus);
          },
          disabled: isPending,
        }}
      />

      {needsReason && (
        <Textarea
          label="Reason"
          textAreaProps={{
            value: reason,
            onChange: (e) => {
              setReason(e.target.value);
            },
            placeholder: 'Why is this status changing?',
            disabled: isPending,
          }}
        />
      )}

      {status === 'ON_LEAVE' && (
        <Input
          label="Return date (optional)"
          inputProps={{
            type: 'date',
            value: leaveUntil,
            onChange: (e) => {
              setLeaveUntil(e.target.value);
            },
            disabled: isPending,
            min: new Date().toISOString().split('T')[0],
          }}
        />
      )}

      <Button
        pattern="primary"
        content={status === admin.status ? 'No changes' : 'Save status'}
        buttonProps={{
          disabled: isPending || status === admin.status || (needsReason && !reason.trim()),
          onClick: () => {
            void handleSubmit();
          },
        }}
      />
    </div>
  );
};

const StatusOverrideModal = ({
  admin,
  onClose,
}: {
  admin: IAdminPopulated | null;
  onClose: () => void;
}) => (
  <ModalWrapper
    isOpen={!!admin}
    onClose={onClose}
    header={{ title: 'Override admin status', showCloseIcon: true }}
    className="max-w-md"
  >
    {admin && <StatusOverrideForm key={admin._id} admin={admin} onClose={onClose} />}
  </ModalWrapper>
);

/* -------------------------------------------------------------------------- */
/*                               DEMOTE MODAL                                 */
/* -------------------------------------------------------------------------- */

// Only reachable once `admin.status === 'SUSPENDED'` (task 7.1's guard - see
// `demoteAdminController`) - suspension is what already bulk-reassigns this
// admin's pending work away, so by the time this form is open there
// shouldn't be anything left pointing at them.
const DemoteAdminForm = ({
  admin,
  otherActiveAdmins,
  onClose,
}: {
  admin: IAdminPopulated;
  otherActiveAdmins: IAdminPopulated[];
  onClose: () => void;
}) => {
  const [reassignTo, setReassignTo] = useState('');
  const { mutateAsync, isPending } = useDemoteAdmin();

  const handleSubmit = async () => {
    await mutateAsync(
      { adminId: admin.user._id, reassignTo: reassignTo || undefined },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-tertiary text-xs sm:text-sm">
        Demoting{' '}
        <span className="text-primary font-semibold">
          {admin.user.firstName} {admin.user.lastName}
        </span>{' '}
        back to a regular user. This can&apos;t be undone from here - they&apos;d need to be
        re-promoted (e.g. via a fresh seller/product approval flow) and re-assigned a territory from
        scratch.
      </p>

      {admin.assignedStates.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-primary-yellow text-xs">
            They currently own {admin.assignedStates.length} state
            {admin.assignedStates.length === 1 ? '' : 's'}: {admin.assignedStates.join(', ')}.
            {otherActiveAdmins.length > 0
              ? ' Hand them to another admin now, or leave unassigned (falls back to the SUPER_ADMIN pool).'
              : ' No other ACTIVE admin is available right now - they will fall back to the SUPER_ADMIN pool until reassigned.'}
          </p>

          {otherActiveAdmins.length > 0 && (
            <Select
              label="Reassign vacated states to (optional)"
              options={otherActiveAdmins.map((other) => ({
                label: `${other.user.firstName} ${other.user.lastName}`,
                value: other.user._id,
              }))}
              selectProps={{
                value: reassignTo,
                onChange: (value) => {
                  setReassignTo(String(value));
                },
                placeholder: 'Leave unassigned',
                disabled: isPending,
              }}
            />
          )}
        </div>
      )}

      <Button
        pattern="primary"
        content="Confirm demotion"
        buttonProps={{
          disabled: isPending,
          onClick: () => {
            void handleSubmit();
          },
        }}
        className="bg-primary-red! shadow-none!"
      />
    </div>
  );
};

const DemoteAdminModal = ({
  admin,
  otherActiveAdmins,
  onClose,
}: {
  admin: IAdminPopulated | null;
  otherActiveAdmins: IAdminPopulated[];
  onClose: () => void;
}) => (
  <ModalWrapper
    isOpen={!!admin}
    onClose={onClose}
    header={{ title: 'Demote admin', showCloseIcon: true }}
    className="max-w-md"
  >
    {admin && (
      <DemoteAdminForm
        key={admin._id}
        admin={admin}
        otherActiveAdmins={otherActiveAdmins}
        onClose={onClose}
      />
    )}
  </ModalWrapper>
);

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

const TerritoryManagement = () => {
  const [assigningAdmin, setAssigningAdmin] = useState<IAdminPopulated | null>(null);
  const [overridingAdmin, setOverridingAdmin] = useState<IAdminPopulated | null>(null);
  const [demotingAdmin, setDemotingAdmin] = useState<IAdminPopulated | null>(null);

  const { data: admins, isLoading, isError } = useGetTerritoryMap();

  const columns = useMemo(
    () => [
      toColumn(
        columnHelper.accessor((row) => `${row.user.firstName} ${row.user.lastName}`, {
          id: 'name',
          header: () => 'Admin',
          cell: (info) => (
            <div className="flex flex-col gap-1 text-left">
              <span className="text-primary font-medium">{info.getValue()}</span>
              <span className="text-tertiary text-[11px]">{info.row.original.user.email}</span>
            </div>
          ),
        }),
      ),
      toColumn(
        columnHelper.accessor((row) => row.user.role, {
          id: 'role',
          header: () => 'Role',
          cell: (info) => (
            <span className="capitalize">{info.getValue().replaceAll('_', ' ')}</span>
          ),
        }),
      ),
      toColumn(
        columnHelper.accessor('assignedStates', {
          header: () => 'States',
          cell: (info) => {
            const states = info.getValue();
            return states.length ? (
              <span className="text-left text-xs">{states.join(', ')}</span>
            ) : (
              <span className="text-tertiary text-xs italic">Unassigned</span>
            );
          },
        }),
      ),
      toColumn(
        columnHelper.accessor('priority', {
          header: () => 'Priority',
          cell: (info) => info.getValue(),
        }),
      ),
      toColumn(
        columnHelper.accessor('currentPendingLoad', {
          header: () => 'Load',
          cell: (info) => info.getValue(),
        }),
      ),
      toColumn(
        columnHelper.accessor('status', {
          header: () => 'Status',
          cell: (info) => (
            <Badge
              content={info.getValue().replaceAll('_', ' ').toLowerCase()}
              className={`capitalize ${STATUS_BADGE_CLASSNAME[info.getValue()]}`}
            />
          ),
        }),
      ),
      toColumn(
        columnHelper.display({
          id: 'actions',
          header: () => 'Actions',
          cell: (info) => {
            const admin = info.row.original;
            const canDemote = admin.status === 'SUSPENDED';

            return (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  pattern="secondary"
                  content="Territory"
                  className="w-auto! px-3! py-1.5! text-xs!"
                  buttonProps={{
                    onClick: () => {
                      setAssigningAdmin(admin);
                    },
                  }}
                />
                <Button
                  pattern="outline"
                  content="Status"
                  className="w-auto! px-3! py-1.5! text-xs!"
                  buttonProps={{
                    onClick: () => {
                      setOverridingAdmin(admin);
                    },
                  }}
                />
                <Tooltip title="Suspend this admin first" required={!canDemote}>
                  <Button
                    pattern="outline"
                    content="Demote"
                    className="text-primary-red! border-primary-red/30! w-auto! px-3! py-1.5! text-xs!"
                    buttonProps={{
                      disabled: !canDemote,
                      onClick: () => {
                        setDemotingAdmin(admin);
                      },
                    }}
                  />
                </Tooltip>
              </div>
            );
          },
        }),
      ),
    ],
    [],
  );

  const table = useTable({
    features: APP_TABLE_FEATURES,
    data: admins ?? [],
    columns,
    getRowId: (row) => row._id,
  });

  const rows = table.getRowModel().rows;

  return (
    <PageWrapper>
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
              <ApiStatus status="loading" text="Loading territory map..." />
            ) : (
              <ApiStatus
                className="min-h-0!"
                status={isError ? 'error' : 'empty'}
                title={isError ? 'Failed to load territory map' : 'No admins yet'}
                description={
                  isError
                    ? 'Something went wrong while fetching the territory map. Please try again.'
                    : 'No ADMIN/SUPER_ADMIN users exist yet - promote a user to ADMIN first.'
                }
              />
            )}
          </div>
        )}
      </div>

      <AssignTerritoryModal
        admin={assigningAdmin}
        otherAdmins={(admins ?? []).filter(
          (other) => other.user.role === 'ADMIN' && other._id !== assigningAdmin?._id,
        )}
        onClose={() => {
          setAssigningAdmin(null);
        }}
      />
      <StatusOverrideModal
        admin={overridingAdmin}
        onClose={() => {
          setOverridingAdmin(null);
        }}
      />
      <DemoteAdminModal
        admin={demotingAdmin}
        otherActiveAdmins={(admins ?? []).filter(
          (other) =>
            other.user.role === 'ADMIN' &&
            other.status === 'ACTIVE' &&
            other._id !== demotingAdmin?._id,
        )}
        onClose={() => {
          setDemotingAdmin(null);
        }}
      />
    </PageWrapper>
  );
};

export default TerritoryManagement;
