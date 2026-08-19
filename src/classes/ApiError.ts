import type { TFieldErrors } from '@/types/api.type';

class ApiError extends Error {
  fieldErrors?: TFieldErrors;
  globalErrors?: string[];

  constructor(params: { message: string; fieldErrors?: TFieldErrors; globalErrors?: string[] }) {
    super(params.message);

    this.fieldErrors = params.fieldErrors;
    this.globalErrors = params.globalErrors;
  }
}

export default ApiError;
