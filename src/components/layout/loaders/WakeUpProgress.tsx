import { Icon } from '@iconify/react';

import { type TWakeUpPhase, WAKE_UP_SERVICES } from '@/hooks/useWakeUp';

type TStepState = 'pending' | 'active' | 'done';

const STEP_ICON: Record<TStepState, { icon: string; className: string }> = {
  pending: { icon: 'solar:clock-circle-linear', className: 'text-primary/30' },
  active: { icon: 'solar:refresh-linear', className: 'text-primary animate-spin' },
  done: { icon: 'solar:check-circle-linear', className: 'text-primary-green' },
};

const StepRow = ({ state, label }: { state: TStepState; label: string }) => (
  <div className="flex items-center gap-2.5">
    <Icon
      icon={STEP_ICON[state].icon}
      className={`size-4 shrink-0 ${STEP_ICON[state].className}`}
    />
    <span className={`text-sm ${state === 'pending' ? 'text-primary/40' : 'text-primary'}`}>
      {label}
    </span>
  </div>
);

interface IWakeUpProgressProps {
  phase: TWakeUpPhase;
  awakeServices: string[];
}

/**
 * Boot-time wake-up status shown on the loading screen: the gateway wakes first, then every
 * service wakes in parallel (see `useWakeUp`). Services tick off individually as they respond.
 */
const WakeUpProgress = ({ phase, awakeServices }: IWakeUpProgressProps) => {
  const gatewayState: TStepState = phase === 'gateway' ? 'active' : 'done';
  const servicesState: TStepState =
    phase === 'gateway' ? 'pending' : phase === 'services' ? 'active' : 'done';

  const servicesLabel = {
    pending: 'Services - waiting for the gateway',
    active: `Waking up services (${String(awakeServices.length)}/${String(WAKE_UP_SERVICES.length)})`,
    done: 'Services are awake',
  }[servicesState];

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-primary/20 relative z-10 mt-6 flex w-full max-w-xs flex-col gap-2.5 rounded-xl border px-5 py-4 backdrop-blur-2xl"
    >
      <StepRow
        state={gatewayState}
        label={gatewayState === 'active' ? 'Waking up the gateway' : 'Gateway is awake'}
      />
      <StepRow state={servicesState} label={servicesLabel} />

      {servicesState === 'active' && (
        <ul className="flex flex-wrap gap-1.5 pl-6.5">
          {WAKE_UP_SERVICES.map((service) => {
            const isAwake = awakeServices.includes(service);

            return (
              <li
                key={service}
                className={`rounded-full border px-2 py-0.5 text-[11px] capitalize transition-colors ${
                  isAwake
                    ? 'border-primary-green/40 text-primary-green'
                    : 'border-primary/20 text-primary/50'
                }`}
              >
                {service}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default WakeUpProgress;
