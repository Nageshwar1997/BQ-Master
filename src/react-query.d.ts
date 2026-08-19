import '@tanstack/react-query';

import type ApiError from './classes/ApiError';
import type ApiSuccess from './classes/ApiSuccess';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
    defaultData: ApiSuccess;
  }
}
