import { TRY_ON_CATEGORIES, TRY_ON_MAP } from '@beautinique/frontend-constants';
import type { TProductTryOnConfigurationZodSchema } from '@beautinique/frontend-types';
import { useMemo } from 'react';
import { Controller, type UseFormReturn, useWatch } from 'react-hook-form';

import Checkbox from '@/components/ui/inputs/Checkbox';
import Select from '@/components/ui/inputs/Select';
import { PRODUCT_TRYON_INPUT_MAP_DATA } from '@/constants/input.constants';

interface Props {
  form: UseFormReturn<TProductTryOnConfigurationZodSchema>;
}

const AddProductTryOnConfigurationFields = ({ form }: Props) => {
  const {
    control,
    formState: { errors },
    register,
    resetField,
  } = form;

  const enabled = useWatch({ control, name: 'enabled' });
  const tryOn = useWatch({ control, name: 'tryOn' });

  const subCategories = useMemo(() => {
    return tryOn?.category ? TRY_ON_MAP[tryOn.category] : [];
  }, [tryOn]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {PRODUCT_TRYON_INPUT_MAP_DATA.map((input) => {
        if (input.type === 'select' && !enabled) return null;
        return input.type === 'select' ? (
          <Controller
            key={input.name}
            name={`tryOn.${input.name}`}
            control={control}
            render={({ field: { onChange, value } }) => {
              const options = input.name === 'subCategory' ? subCategories : TRY_ON_CATEGORIES;
              return (
                <Select
                  label={input.label}
                  error={'tryOn' in errors ? errors.tryOn?.[input.name]?.message : undefined}
                  options={options.map((category) => ({ label: category, value: category }))}
                  selectProps={{
                    value: value ?? '',
                    placeholder: input.placeholder,
                    disabled: input.name === 'subCategory' && !tryOn?.category,
                    onChange: (value) => {
                      if (input.name === 'category') {
                        resetField('tryOn.subCategory');
                      }
                      onChange(value);
                    },
                  }}
                  className="lowercase"
                  optionsClassName="lowercase"
                />
              );
            }}
          />
        ) : (
          <Checkbox
            key={input.name}
            register={register('enabled')}
            error={errors.enabled?.message}
            content="Enable TryOn"
            checkboxProps={{
              name: 'enabled',
              onChange: () => {
                resetField('tryOn');
              },
            }}
            containerClassName="col-span-2"
          />
        );
      })}
    </div>
  );
};

export default AddProductTryOnConfigurationFields;
