import { Icon } from '@iconify/react';
import { useMemo } from 'react';

import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import { TOAST_TYPE } from '@/constants/common.constants';
import useQueryParams from '@/hooks/useQueryParams';
import type { TConfirmModal } from '@/types/component.type';

import { ModalWrapper } from './ModalWrapper';

const cardConfig = (type: TConfirmModal['type']) => {
  switch (type) {
    case TOAST_TYPE.success:
      return { icon: 'solar:check-circle-linear', rgb: 'var(--primary-green-rgb)' };
    case TOAST_TYPE.error:
      return { icon: 'solar:danger-triangle-linear', rgb: 'var(--primary-red-rgb)' };
    case TOAST_TYPE.warning:
      return { icon: 'solar:danger-triangle-linear', rgb: 'var(--primary-yellow-rgb)' };
    case TOAST_TYPE.default:
    case TOAST_TYPE.custom:
    default:
      return { icon: 'solar:info-circle-outline', rgb: 'var(--primary-rgb)' };
  }
};

export const ConfirmModal = ({
  type,
  buttons,
  children,
  description,
  modalProps,
  title,
}: TConfirmModal) => {
  const { queryParams, removeParams } = useQueryParams();

  const config = useMemo(() => cardConfig(type), [type]);

  return (
    <ModalWrapper
      {...modalProps}
      isOpen={modalProps?.isOpen ?? !!queryParams.confirm}
      onClose={() => {
        modalProps?.onClose();
        removeParams('confirm');
      }}
      className={`max-w-sm border-2 ${modalProps?.className ?? ''}`}
      containerProps={{
        ...modalProps?.containerProps,
        className: `p-6! ${modalProps?.containerProps?.className ?? ''}`,
        onClick: (e) => (e.stopPropagation(), modalProps?.containerProps?.onClick?.(e)),
      }}
      style={{
        ...modalProps?.style,
        borderColor: `rgba(${config.rgb}, 0.4)`,
        boxShadow: `0 10px 10px 0px rgba(${config.rgb}, 0.1)`,
      }}
    >
      <div className="grid w-full place-items-center gap-6">
        {type === TOAST_TYPE.custom ? (
          children
        ) : (
          <>
            <div
              className="grid size-10 shrink-0 place-items-center rounded-full border p-2 md:size-12 lg:size-14"
              style={{
                borderColor: `rgba(${config.rgb}, 0.8)`,
                background: `radial-gradient(circle, rgba(${config.rgb}, 0.25) 25%, rgba(${config.rgb}, 0.5) 50%, rgba(${config.rgb}, 0.75) 75%, rgba(${config.rgb}, 1) 100%)`,
                boxShadow: `0 0 0 1px rgba(${config.rgb}, 0.08), 0 0 12px rgba(${config.rgb}, 0.18), 0 8px 24px rgba(${config.rgb}, 0.22)`,
              }}
            >
              <Icon icon={config.icon} className="size-full" />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <GradientText
                text={title}
                type="silver"
                className="block font-semibold text-shadow-lg md:text-lg lg:text-xl"
              />
              {description && (
                <p className="text-tertiary text-xs font-light lg:text-sm">{description}</p>
              )}
            </div>
          </>
        )}
        {buttons && (
          <div className="flex w-full items-center justify-center gap-4">
            {buttons.left && (
              <Button
                pattern="secondary"
                {...buttons.left}
                className={`max-h-10 rounded-md! ${buttons.left.className ?? ''}`}
                buttonProps={{
                  ...buttons.left.buttonProps,
                  onClick: (e) => {
                    buttons.left?.buttonProps?.onClick?.(e);
                    modalProps?.onClose();
                    removeParams('confirm');
                  },
                }}
              />
            )}
            {buttons.right && (
              <Button
                pattern="primary"
                {...buttons.right}
                className={`max-h-10 rounded-md! ${buttons.right.className ?? ''}`}
                buttonProps={{
                  ...buttons.right.buttonProps,
                  onClick: (e) => {
                    if (buttons.right?.buttonProps?.onClick) {
                      buttons.right.buttonProps.onClick(e);
                    } else {
                      modalProps?.onClose();
                    }
                  },
                }}
              />
            )}
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};

export default ConfirmModal;
