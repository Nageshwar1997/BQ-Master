import type {
  TDraftProductDetailsZodSchema,
  TDraftProductStepBodyZodSchema,
} from '@beautinique/frontend-types';

import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import type {
  IDashboardProductsResponse,
  IGetDashboardProductsQuery,
  IId,
  TApiProductPopulated,
  TCategory,
  TCategoryHierarchy,
  TL1Category,
  TL2Category,
  TL3Category,
} from '@/types/api.type';

import { ApiRequest } from '../ApiRequest';

export class CategoryApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.product_service.category;

  /* ===================== POST API ===================== */

  public addCategory = (data: Omit<TCategory, 'slug' | '_id'>) => {
    return this.request({ ...this.routes.add, data });
  };

  /* ===================== PATCH API ===================== */

  public updateCategory = ({ _id, ...data }: Partial<Omit<TCategory, 'slug'>> & IId) => {
    const { method, url } = this.routes.update;
    return this.request({ method, url: url({ categoryId: _id }), data });
  };

  /* ===================== DELETE API ===================== */

  public deleteCategory = (categoryId: string) => {
    const { method, url } = this.routes.delete;
    return this.request({ method, url: url({ categoryId }) });
  };

  /* ===================== GET API ===================== */

  public getCategoriesByParentLevel = (
    params:
      | Pick<TL1Category, 'level'>
      | Pick<TL2Category, 'level' | 'parent'>
      | Pick<TL3Category, 'level' | 'parent'>,
  ) => {
    return this.request<TCategory[]>({ ...this.routes.get.byParentLevel, params });
  };

  public getCategoriesHierarchy = () => {
    return this.request<TCategoryHierarchy[]>(this.routes.get.byHierarchy);
  };
}

export class ProductApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.product_service.product;

  /* ===================== POST API ===================== */

  public saveDraftProduct = (data: TDraftProductStepBodyZodSchema) => {
    return this.request({ ...this.routes.draft.save, data });
  };

  /* ===================== PATCH API ===================== */

  public publishDraftProduct = () => {
    return this.request(this.routes.draft.publish);
  };

  /* ===================== DELETE API ===================== */

  /* ===================== GET API ===================== */

  public getDraftProduct = () => {
    return this.request<Partial<TDraftProductDetailsZodSchema>>(this.routes.draft.get);
  };

  public getDashboardProducts = (params: IGetDashboardProductsQuery) => {
    return this.request<IDashboardProductsResponse>({
      ...this.routes.get.dashboard.products,
      params,
    });
  };

  public getDashboardProductBySlug = (slug: string) => {
    const { method, url } = this.routes.get.dashboard.bySlug;
    return this.request<TApiProductPopulated>({ method, url: url({ slug }) });
  };
}
