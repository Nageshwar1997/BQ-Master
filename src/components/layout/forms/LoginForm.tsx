import type { TLoginZodSchema } from '@beautinique/frontend-types';
import { loginZodSchema } from '@beautinique/frontend-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';

import AuthBottomInstructions from '@/components/ui/AuthBottomInstructions';
import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import Input from '@/components/ui/inputs/Input';
import Radio from '@/components/ui/inputs/Radio';
import { ROUTES } from '@/constants/common.constants';
import { LOGIN_INPUT_MAP_DATA, PASSWORD_KEYS } from '@/constants/input.constants';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import { useLogin } from '@/services/user-service/auth.service.query';
import useActionsStore from '@/stores/action.store';
import useUserStore from '@/stores/user.store';
import { setErrorToForm } from '@/utils/form.util';

import BorderGradient from '../containers/BorderGradient';

const LoginForm = () => {
  /* ================= 1. External / Store Hooks ================= */
  const setUser = useUserStore((s) => s.setUser);
  const { queryParams, removeParams } = useQueryParams();
  const { paths, navigate } = usePathParams();

  /* ================= 2. API / Query Hooks ================= */
  const { isPending, mutateAsync } = useLogin();

  /* ================= 3. Form Hooks ================= */
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<TLoginZodSchema>({
    resolver: zodResolver(loginZodSchema),
    defaultValues: { loginMethod: 'email' },
  });

  const selectedMethod = useWatch({ control, name: 'loginMethod', defaultValue: 'email' });

  /* ================= 4. Local State ================= */
  const [showPassword, setShowPassword] = useState<boolean>(false);

  /* ================= 5. Handlers ================= */

  // -------- Handle Login Submit --------
  const handleLogin = async (data: TLoginZodSchema) => {
    await mutateAsync(data, {
      onSuccess: async ({ data: user }) => {
        setUser(user ?? null);

        const { runAllActions } = useActionsStore.getState();
        await runAllActions();

        // The `authenticate` middleware bounces the user here from a private route
        // (?redirect=...) — send them straight back to it instead of Dashboard.
        if (queryParams.redirect?.charAt(0)) {
          void navigate(queryParams.redirect);
          return;
        }

        if (paths.includes(ROUTES.AUTH.BASE)) {
          void navigate(ROUTES.DASHBOARD);
        } else if (queryParams.login) {
          removeParams(['login']);
        }
      },

      onError: ({ fieldErrors }) => {
        setErrorToForm(setError, fieldErrors);
      },
    });
  };

  // -------- Toggle Password Visibility --------
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // -------- Handle Login Method Change (Email / Phone) --------
  const handleLoginMethodChange = (method: TLoginZodSchema['loginMethod']) => {
    if (method === 'phoneNumber') {
      reset({ loginMethod: method, phoneNumber: undefined, password: undefined });
    } else {
      reset({ loginMethod: method, email: undefined, password: undefined });
    }
  };

  /* ================= 6. JSX ================= */
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {/* ================= HEADER ================= */}
      <GradientText
        type="accent"
        text="Login"
        className="mx-auto text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl lg:text-5xl"
      />

      {/* ================= FORM CONTAINER ================= */}
      <BorderGradient className="flex flex-col gap-5 lg:gap-6">
        {/* ================= MAIN FORM ================= */}
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5 sm:space-y-6">
          {/* -------- Login Method Toggle (Radio) -------- */}
          <Controller
            name="loginMethod"
            control={control}
            render={({ field }) => (
              <Radio
                value={field.value}
                onChange={(value) => {
                  handleLoginMethodChange(value as TLoginZodSchema['loginMethod']);
                  field.onChange(value);
                }}
                options={[
                  { label: 'Email', value: 'email' },
                  { label: 'Phone', value: 'phoneNumber' },
                ]}
                className="w-50!"
                error={errors.loginMethod?.message}
              />
            )}
          />

          {/* ================= INPUTS ================= */}
          {LOGIN_INPUT_MAP_DATA.map((input) => {
            const isPassword = PASSWORD_KEYS.includes(input.name);
            const isPhone = input.name === 'phoneNumber';
            const isEmail = input.name === 'email';
            const isEmailSelected = selectedMethod === 'email';

            const name = input.name as keyof Omit<TLoginZodSchema, 'loginMethod'>;

            // -------- Conditional Rendering --------
            if (isPhone && isEmailSelected) return null;
            if (isEmail && !isEmailSelected) return null;

            return (
              <Input
                key={name}
                label={input.label}
                inputProps={{
                  name,
                  type: isPassword ? (showPassword ? 'text' : input.type) : input.type,
                  placeholder: input.placeholder,
                  autoComplete: input.autoComplete,
                  disabled: isPending,
                }}
                icons={
                  isPhone
                    ? {
                        left: (
                          <span className="text-primary/50 border-r-primary/30 items-center border-r py-2 pr-3 text-[13px] leading-0 capitalize">
                            +91
                          </span>
                        ),
                      }
                    : isPassword
                      ? {
                          right: {
                            icon: showPassword ? 'lucide:eye-off' : 'lucide:eye',
                            onClick: togglePasswordVisibility,
                            className: 'cursor-pointer',
                          },
                        }
                      : undefined
                }
                register={register(name)}
                error={errors[name]?.message}
              />
            );
          })}

          <p className="inline-flex w-full justify-end pr-2">
            <GradientText
              text="Forgot Password?"
              type="accent"
              path={`/${ROUTES.AUTH.BASE}/${ROUTES.AUTH.FORGOT_PASSWORD}`}
              className="text-xs font-semibold whitespace-nowrap hover:underline"
            />
          </p>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex gap-4 sm:col-span-2">
            {/* -------- Back Button -------- */}
            <Link to={ROUTES.DASHBOARD} className="w-full">
              <Button pattern="secondary" content="Back" />
            </Link>

            {/* -------- Submit Button -------- */}
            <Button
              pattern="primary"
              buttonProps={{ type: 'submit', disabled: isPending }}
              content="Login"
            />
          </div>
        </form>

        {/* ================= EXTRA INFO ================= */}
        <AuthBottomInstructions />
      </BorderGradient>
    </div>
  );
};

export default LoginForm;
