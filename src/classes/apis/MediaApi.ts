import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import type { TFormDataProgress } from '@/types/common.type';

import { ApiRequest } from '../ApiRequest';

export class MediaApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.media_service;

  /* ===================== POST API ===================== */

  public uploadSingle = (props: TFormDataProgress) => {
    return this.request<string>({ ...this.routes.upload.single, ...props });
  };

  public uploadMultiple = (props: TFormDataProgress) => {
    return this.request<string[]>({ ...this.routes.upload.multiple, ...props });
  };
}
