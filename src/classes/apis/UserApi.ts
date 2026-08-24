import { HEADERS_MAP, USER_ROLE_MAP } from '@beautinique/frontend-constants';
import type {
  TChangePasswordZodSchema,
  TEmailZodSchema,
  TLoginZodSchema,
  TOtpZodSchema,
  TPasswordsZodSchema,
} from '@beautinique/frontend-types';

import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import type {
  IAdmin,
  IAdminPopulated,
  IAssignAdminTerritory,
  IDemoteAdmin,
  IDemoteAdminResponse,
  IUpdateAdminStatus,
  IUser,
} from '@/types/api.type';

import { ApiRequest } from '../ApiRequest';

export class AuthApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.user_service.auth;

  /* ===================== LOGIN API ===================== */

  public login = (data: TLoginZodSchema) => {
    return this.request<IUser>({
      ...this.routes.login.manual,
      data,
      headers: { [HEADERS_MAP.loginRole]: USER_ROLE_MAP.MASTER },
    });
  };

  /* ===================== PASSWORD API ===================== */

  public forgotPasswordSendOtp = (data: TEmailZodSchema) => {
    return this.request<string>({ ...this.routes.password.forgot.sendOtp, data });
  };

  public forgotPasswordResendOtp = (token: string) => {
    return this.request<number>({
      ...this.routes.password.forgot.resendOtp,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public forgotPasswordVerifyOtp = ({ token, ...data }: TOtpZodSchema & { token: string }) => {
    return this.request({
      ...this.routes.password.forgot.verifyOtp,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public forgotPasswordSave = ({ token, ...data }: TPasswordsZodSchema & { token: string }) => {
    return this.request<IUser>({
      ...this.routes.password.forgot.save,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  /* ===================== LOGOUT API ===================== */

  public logout = () => {
    return this.request(this.routes.logout);
  };
}
export class UserApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.user_service.user;

  /* ===================== GET API ===================== */

  public getSessionUser = async () => {
    return this.request<IUser>(this.routes.session);
  };

  public changePassword = (data: TChangePasswordZodSchema) => {
    return this.request<IUser>({ ...this.routes.password.change, data });
  };
}

export class AdminTerritoryApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.user_service.admin.territory;

  /* ===================== MY ADMIN PROFILE (self) ===================== */

  public getMyAdmin = () => {
    return this.request<IAdmin>(this.routes.me);
  };

  /* ===================== TERRITORY MAP (MASTER) ===================== */

  public getTerritoryMap = () => {
    return this.request<IAdminPopulated[]>(this.routes.map);
  };

  /* ===================== STATE ADMINS (MASTER/admin UI) ===================== */

  public getStateAdmins = (state: string) => {
    const { method, url } = this.routes.stateAdmins;
    return this.request<IAdminPopulated[]>({ method, url: url({ state }) });
  };

  /* ===================== ASSIGN TERRITORY (MASTER) ===================== */

  public assignAdminTerritory = ({ adminId, data }: IAssignAdminTerritory) => {
    const { method, url } = this.routes.assign;
    return this.request<IAdmin>({ method, url: url({ adminId }), data });
  };

  /* ===================== UPDATE STATUS (MASTER bypass) ===================== */

  public updateAdminStatus = ({ adminId, data }: IUpdateAdminStatus) => {
    const { method, url } = this.routes.status;
    return this.request<IAdmin>({ method, url: url({ adminId }), data });
  };

  /* ===================== DEMOTE (MASTER only) ===================== */

  public demoteAdmin = ({ adminId, reassignTo }: IDemoteAdmin) => {
    const { method, url } = this.routes.demote;
    return this.request<IDemoteAdminResponse>({
      method,
      url: url({ adminId }),
      ...(reassignTo && { params: { reassignTo } }),
    });
  };
}
