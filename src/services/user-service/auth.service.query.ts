import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import { ROUTES } from '@/constants/common.constants';
import usePathParams from '@/hooks/usePathParams';
import useUserStore from '@/stores/user.store';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';

const { login, logout, password } = API_QUERY_KEYS.user_service.auth;

/* ===================== LOGIN QUERIES ===================== */

export const useLogin = () => {
  return useMutation({
    mutationKey: login.manual,
    mutationFn: authApi.login,
    onMutate: () => {
      const toastId = toaster.loading({ title: 'Please wait...', description: 'Logging in...' });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

/* ===================== PASSWORD QUERIES ===================== */

export const useForgotPasswordSendOtp = () => {
  return useMutation({
    mutationKey: password.forgot.sendOtp,
    mutationFn: authApi.forgotPasswordSendOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Sending OTP to your email...',
      });

      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useForgotPasswordResendOtp = () => {
  return useMutation({
    mutationKey: password.forgot.resendOtp,
    mutationFn: authApi.forgotPasswordResendOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Resending OTP to your email...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useForgotPasswordVerifyOtp = () => {
  return useMutation({
    mutationKey: password.forgot.verifyOtp,
    mutationFn: authApi.forgotPasswordVerifyOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Verifying your OTP...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useForgotPasswordSave = () => {
  return useMutation({
    mutationKey: password.forgot.save,
    mutationFn: authApi.forgotPasswordSave,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Saving your password...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

/* ===================== LOGOUT QUERIES ===================== */

export const useLogout = () => {
  const queryClient = useQueryClient();
  const setUser = useUserStore((s) => s.setUser);
  const { navigate } = usePathParams();

  return useMutation({
    mutationKey: logout,
    mutationFn: authApi.logout,
    onMutate: () => {
      const toastId = toaster.loading({ title: 'Please wait...', description: 'Logging out...' });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
      // Drop all cached data so nothing from this session leaks into the next login.
      queryClient.clear();
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
      setUser(null);

      // Every route except /auth requires a session, so a logout always leaves the user
      // stranded on a page they can no longer access — send them to login.
      void navigate(`/${ROUTES.AUTH.BASE}`);
    },
  });
};
