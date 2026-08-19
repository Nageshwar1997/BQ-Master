import { Icon } from '@iconify/react';

import type { TApiStatus } from '@/types/component.type';

import Divider from '../ui/Divider';
import GradientText from '../ui/GradientText';
import LoadingRings from './loaders/LoadingRings';

const ApiDescription = ({ status, ...props }: TApiStatus) => {
  const title = 'title' in props && props.title;
  const description = 'description' in props && props.description;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="bg-primary/5 grid size-8 place-items-center rounded-full p-2 md:size-10">
        <Icon
          icon={
            status === 'error'
              ? 'solar:danger-triangle-linear'
              : status === 'success'
                ? 'solar:check-circle-linear'
                : 'solar:folder-error-linear'
          }
          className="text-silver-jet size-full shrink-0"
        />
      </div>

      <GradientText
        type="silver"
        className="text-sm text-shadow-sm sm:text-base md:text-lg"
        text={typeof title === 'string' ? title : ''}
      >
        {title && typeof title !== 'string' ? title : undefined}
      </GradientText>
      {description && (
        <div className="text-silver-jet text-center text-xs leading-6 font-normal sm:text-sm">
          {description}
        </div>
      )}
      {'divider' in props && <Divider className="mt-1" />}
    </div>
  );
};

const ApiStatus = ({ className = '', ...props }: TApiStatus) => {
  return (
    <div
      className={`m-auto flex h-full min-h-60 w-full flex-col items-center justify-center gap-2 p-4 ${className}`}
    >
      {props.status === 'loading' ? (
        <LoadingRings text={'text' in props && props.text ? props.text : 'Loading....'} />
      ) : (
        <ApiDescription {...props} />
      )}
    </div>
  );
};
export default ApiStatus;
