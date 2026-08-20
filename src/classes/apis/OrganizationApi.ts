import type { IListContactQueriesQuery } from '@beautinique/frontend-types';

import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import type {
  IContactQueriesListResponse,
  ISeller,
  ISellerQueueQuery,
  IUpdateContactQueryStatus,
} from '@/types/api.type';

import { ApiRequest } from '../ApiRequest';

export class ContactApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.organization_service.contact;

  /* ================== GET CONTACT QUERIES LIST ================== */
  public getContactQueries = (params: IListContactQueriesQuery) => {
    return this.request<IContactQueriesListResponse>({ ...this.routes.list, params });
  };

  /* ================== UPDATE CONTACT QUERY STATUS ================== */
  public updateContactQueryStatus = ({ status, ticketId }: IUpdateContactQueryStatus) => {
    const { method, url } = this.routes.updateStatus;
    return this.request({
      method,
      url: url({ ticketId }),
      params: { status },
    });
  };
}

export class SellerApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.organization_service.seller;

  /* ================== GET SELLER QUEUE ("All"/"Unassigned") ================== */
  public getSellerQueue = (params: ISellerQueueQuery) => {
    return this.request<ISeller[]>({ ...this.routes.queue, params });
  };
}
