import type { FieldErrors, FieldValues, Path, UseFormSetError } from 'react-hook-form';

import type { TFieldErrors } from '@/types/api.type';
import type { IFileInput } from '@/types/input.type';

export const setErrorToForm = <T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors?: TFieldErrors,
) => {
  if (!errors || Object.keys(errors).length === 0) return;

  // field errors
  Object.entries(errors).forEach(([field, messages]) => {
    setError(field as Path<T>, {
      type: 'server',
      message: messages.join('\n'),
    });
  });
};

export const toErrorMessageArray = <T extends FieldValues>(
  fieldErrors?: FieldErrors<T>,
): IFileInput['errors'] => {
  if (!fieldErrors) return undefined;

  if (
    typeof fieldErrors === 'object' &&
    'message' in fieldErrors &&
    typeof fieldErrors.message === 'string'
  ) {
    return [fieldErrors.message];
  }

  const extractMessage = (error: unknown) => {
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return error.message;
    }

    return undefined;
  };

  // fieldErrors for array fields is a sparse array (only invalid indexes are set),
  // so mapping the array directly keeps each error at its real index.
  // Object.values/Object.entries would skip the unset (hole) indexes and collapse positions.
  if (Array.isArray(fieldErrors)) {
    return fieldErrors.map(extractMessage);
  }

  return Object.values(fieldErrors).map(extractMessage);
};
