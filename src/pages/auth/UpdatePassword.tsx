import type { TChangePasswordZodSchema } from '@beautinique/frontend-types';
import { changePasswordZodSchema } from '@beautinique/frontend-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import BorderGradient from '@/components/layout/containers/BorderGradient';
import AuthBottomInstructions from '@/components/ui/AuthBottomInstructions';
import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import Input from '@/components/ui/inputs/Input';
import { FORM_DEFAULT_VALUES } from '@/constants/form.constants';
import { CHANGE_PASSWORD_INPUT_MAP_DATA } from '@/constants/input.constants';
import usePathParams from '@/hooks/usePathParams';
import { useChangePassword } from '@/services/user-service/user.service.query';
import useUserStore from '@/stores/user.store';
import { setErrorToForm } from '@/utils/form.util';

const UpdatePassword = () => {
  /* ================= 1. Store Hooks ================= */
  const setUser = useUserStore((s) => s.setUser);

  /* ================= 2. Custom Hooks ================= */
  const { navigate } = usePathParams();

  /* ================= 3. API/Queries Hooks ================= */

  const changePassword = useChangePassword();

  /* ================= 4. Forms ================= */

  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    setError,
  } = useForm<TChangePasswordZodSchema>({
    resolver: zodResolver(changePasswordZodSchema),
    defaultValues: FORM_DEFAULT_VALUES.changePassword,
  });

  /* ================= 5. Local State ================= */
  const [showPasswords, setShowPasswords] = useState<
    Record<keyof TChangePasswordZodSchema, boolean>
  >({
    password: false,
    confirmPassword: false,
    currentPassword: false,
  });

  /* ================= 6. Handlers ================= */

  const handleChangePassword = async (data: TChangePasswordZodSchema) => {
    await changePassword.mutateAsync(
      { ...data },
      {
        onSuccess: ({ data: user }) => {
          if (user) {
            setUser(user);
            void navigate(-1);
          }
        },
        onError: ({ fieldErrors }) => {
          setErrorToForm(setError, fieldErrors);
        },
      },
    );
  };

  const togglePasswordVisibility = (field: keyof TChangePasswordZodSchema) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  /* ================= 7. JSX ================= */

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {/* ================= HEADER ================= */}
      <GradientText
        type="accent"
        text="Change Password"
        className="mx-auto text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl lg:text-5xl"
      />

      {/* ================= FORM CONTAINER ================= */}
      <BorderGradient className="flex flex-col gap-5 py-6 lg:gap-6">
        {/* ================= MAIN FORM ================= */}
        <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-5 sm:space-y-6">
          {/* ================= STEP: CHANGE PASSWORD ================= */}
          {CHANGE_PASSWORD_INPUT_MAP_DATA.map((input) => {
            return (
              <Input
                key={input.name}
                label={input.label}
                inputProps={{
                  name: input.name,
                  type: showPasswords[input.name] ? 'text' : input.type,
                  placeholder: input.placeholder,
                  autoComplete: input.autoComplete,
                  disabled: changePassword.isPending,
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
                register={register(input.name)}
                error={errors[input.name]?.message}
              />
            );
          })}

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex gap-4">
            {/* -------- Back / Cancel Button -------- */}
            <Button
              pattern="secondary"
              buttonProps={{ onClick: () => navigate(-1) }}
              content="Cancel"
            />

            {/* -------- Submit Button -------- */}
            <Button
              pattern="primary"
              buttonProps={{ type: 'submit', disabled: changePassword.isPending || !isDirty }}
              content="Submit"
            />
          </div>
        </form>

        {/* ================= EXTRA INFO ================= */}
        <AuthBottomInstructions />
      </BorderGradient>
    </div>
  );
};

export default UpdatePassword;
