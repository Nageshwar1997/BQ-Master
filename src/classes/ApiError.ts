import type { TFieldErrors, TGlobalErrors } from '@beautinique/frontend-types';

import type { IErrorResponse } from '@/types/api.type';

class ApiError extends Error {
  fieldErrors?: TFieldErrors;
  globalErrors?: TGlobalErrors;

  constructor(params: Pick<IErrorResponse, 'fieldErrors' | 'globalErrors'> & { message: string }) {
    super(params.message);

    this.fieldErrors = params.fieldErrors;
    this.globalErrors = params.globalErrors;
  }
}

export default ApiError;
