import type {
  TEmailZodSchema,
  TOtpZodSchema,
  TPasswordsZodSchema,
} from '@beautinique/frontend-types';
import { emailZodSchema, otpZodSchema, passwordsZodSchema } from '@beautinique/frontend-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import BorderGradient from '@/components/layout/containers/BorderGradient';
import AuthBottomInstructions from '@/components/ui/AuthBottomInstructions';
import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import Input from '@/components/ui/inputs/Input';
import Resend from '@/components/ui/Resend';
import { FORM_DEFAULT_VALUES } from '@/constants/form.constants';
import {
  EMAIL_INPUT_DATA,
  OTP_INPUT_DATA,
  PASSWORDS_INPUT_MAP_DATA,
} from '@/constants/input.constants';
import usePathParams from '@/hooks/usePathParams';
import {
  useForgotPasswordResendOtp,
  useForgotPasswordSave,
  useForgotPasswordSendOtp,
  useForgotPasswordVerifyOtp,
} from '@/services/user-service/auth.service.query';
import useUserStore from '@/stores/user.store';
import { toaster } from '@/utils/common.util';
import { setErrorToForm } from '@/utils/form.util';

const ForgotPassword = () => {
  /* ================= 1. Store Hooks ================= */
  const setUser = useUserStore((s) => s.setUser);

  /* ================= 2. Custom Hooks ================= */
  const { navigate } = usePathParams();

  /* ================= 3. API/Queries Hooks ================= */
  const sendOtp = useForgotPasswordSendOtp();
  const resendOtp = useForgotPasswordResendOtp();
  const verifyOtp = useForgotPasswordVerifyOtp();
  const savePassword = useForgotPasswordSave();

  const token = useMemo(() => sendOtp.data?.data ?? '', [sendOtp.data]);

  const sendCount = useMemo(() => resendOtp.data?.data ?? 1, [resendOtp.data]);

  /* ================= 4. Forms ================= */
  const sendOtpForm = useForm<TEmailZodSchema>({ resolver: zodResolver(emailZodSchema) });

  const verifyOtpForm = useForm<TOtpZodSchema>({ resolver: zodResolver(otpZodSchema) });

  const passwordForm = useForm<TPasswordsZodSchema>({ resolver: zodResolver(passwordsZodSchema) });

  /* ================= 5. Local State ================= */
  const [currentStep, setCurrentStep] = useState<'send' | 'verify' | 'save'>('send');

  const [showPasswords, setShowPasswords] = useState<Record<keyof TPasswordsZodSchema, boolean>>({
    password: false,
    confirmPassword: false,
  });

  /* ================= 7. Handlers ================= */

  const handleSendOtp = async (data: TEmailZodSchema) => {
    await sendOtp.mutateAsync(data, {
      onSuccess: () => {
        setCurrentStep('verify');
      },
      onError: ({ fieldErrors }) => {
        setErrorToForm(sendOtpForm.setError, fieldErrors);
      },
    });
  };

  const handleVerifyOtp = async (data: TOtpZodSchema) => {
    await verifyOtp.mutateAsync(
      { ...data, token },
      {
        onSuccess: () => {
          setCurrentStep('save');
        },
        onError: ({ fieldErrors }) => {
          setErrorToForm(verifyOtpForm.setError, fieldErrors);
        },
      },
    );
  };

  const handleForgotPassword = async (data: TPasswordsZodSchema) => {
    await savePassword.mutateAsync(
      { ...data, token },
      {
        onSuccess: ({ data: user }) => {
          setUser(user ?? null);
        },
        onError: ({ fieldErrors }) => {
          setErrorToForm(passwordForm.setError, fieldErrors);
        },
      },
    );
  };

  const handleResendOtp = async () => {
    if (sendCount >= 3) {
      toaster.error({
        title: 'Resend Failed',
        description: 'You have reached the maximum number of attempts.',
      });

      return;
    }

    if (sendOtp.isPending || verifyOtp.isPending || resendOtp.isPending) return;

    await resendOtp.mutateAsync(token);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'verify':
        verifyOtpForm.reset(FORM_DEFAULT_VALUES.otp);
        setCurrentStep('send');
        break;

      case 'save':
        passwordForm.reset(FORM_DEFAULT_VALUES.register);
        setCurrentStep('send');
        break;

      case 'send':
      default:
        sendOtpForm.reset(FORM_DEFAULT_VALUES.email);
        void navigate(-1);
        break;
    }
  };

  const togglePasswordVisibility = (field: keyof TPasswordsZodSchema) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  /* ================= 8. JSX ================= */

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {/* ================= HEADER ================= */}
      <GradientText
        type="accent"
        text="Forgot Password?"
        className="mx-auto text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl lg:text-5xl"
      />

      {/* ================= FORM CONTAINER ================= */}
      <BorderGradient className="flex flex-col gap-5 py-6 lg:gap-6">
        {/* ================= MAIN FORM ================= */}
        <form
          onSubmit={
            currentStep === 'send'
              ? sendOtpForm.handleSubmit(handleSendOtp)
              : currentStep === 'verify'
                ? verifyOtpForm.handleSubmit(handleVerifyOtp)
                : passwordForm.handleSubmit(handleForgotPassword)
          }
          className="space-y-5 sm:space-y-6"
        >
          {/* ================= STEP: SEND / VERIFY ================= */}
          {(currentStep === 'send' || currentStep === 'verify') && (
            <>
              {/* -------- Email Input -------- */}
              <Input
                key={EMAIL_INPUT_DATA.name}
                label={EMAIL_INPUT_DATA.label}
                inputProps={{
                  name: EMAIL_INPUT_DATA.name,
                  type: EMAIL_INPUT_DATA.type,
                  placeholder: EMAIL_INPUT_DATA.placeholder,
                  autoComplete: EMAIL_INPUT_DATA.autoComplete,
                  disabled: sendOtp.isPending || currentStep === 'verify',
                  readOnly: currentStep === 'verify',
                }}
                register={sendOtpForm.register(EMAIL_INPUT_DATA.name)}
                error={sendOtpForm.formState.errors[EMAIL_INPUT_DATA.name]?.message}
              />

              {/* -------- OTP Section (only in verify step) -------- */}
              {currentStep === 'verify' && (
                <>
                  <Input
                    key={OTP_INPUT_DATA.name}
                    label={OTP_INPUT_DATA.label}
                    inputProps={{
                      name: OTP_INPUT_DATA.name,
                      type: OTP_INPUT_DATA.type,
                      placeholder: OTP_INPUT_DATA.placeholder,
                      autoComplete: OTP_INPUT_DATA.autoComplete,
                      disabled: verifyOtp.isPending || resendOtp.isPending,
                    }}
                    register={verifyOtpForm.register(OTP_INPUT_DATA.name)}
                    error={verifyOtpForm.formState.errors[OTP_INPUT_DATA.name]?.message}
                  />

                  {/* -------- Resend OTP -------- */}
                  <Resend
                    label="Not received OTP?"
                    count={sendCount >= 3 ? 0 : 30}
                    onResend={handleResendOtp}
                  />
                </>
              )}
            </>
          )}

          {/* ================= STEP: REGISTER DETAILS ================= */}
          {currentStep === 'save' &&
            PASSWORDS_INPUT_MAP_DATA.map((input) => {
              return (
                <Input
                  key={input.name}
                  label={input.label}
                  inputProps={{
                    name: input.name,
                    type: showPasswords[input.name] ? 'text' : input.type,
                    placeholder: input.placeholder,
                    autoComplete: input.autoComplete,
                    disabled: savePassword.isPending,
                  }}
                  icons={{
                    right: {
                      icon: showPasswords[input.name] ? 'lucide:eye-off' : 'lucide:eye',
                      onClick: () => {
                        togglePasswordVisibility(input.name);
                      },
                      className: 'cursor-pointer',
                    },
                  }}
                  register={passwordForm.register(input.name)}
                  error={passwordForm.formState.errors[input.name]?.message}
                />
              );
            })}

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex gap-4">
            {/* -------- Back / Cancel Button -------- */}
            <Button
              pattern="secondary"
              buttonProps={{ onClick: handleBack }}
              content={
                currentStep === 'send'
                  ? 'Back'
                  : currentStep === 'verify'
                    ? 'Change Email'
                    : 'Cancel'
              }
            />

            {/* -------- Submit Button -------- */}
            <Button
              pattern="primary"
              buttonProps={{
                type: 'submit',
                disabled:
                  currentStep === 'send'
                    ? sendOtp.isPending
                    : currentStep === 'verify'
                      ? verifyOtp.isPending || resendOtp.isPending
                      : savePassword.isPending,
              }}
              content={
                currentStep === 'send'
                  ? 'Send OTP'
                  : currentStep === 'verify'
                    ? 'Verify OTP'
                    : 'Register'
              }
            />
          </div>
        </form>

        {/* ================= EXTRA INFO ================= */}
        <AuthBottomInstructions />
      </BorderGradient>
    </div>
  );
};

export default ForgotPassword;
