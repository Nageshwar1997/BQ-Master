import type { TProductBasicInfoZodSchema } from '@beautinique/frontend-types';
import { Controller, type UseFormReturn, useWatch } from 'react-hook-form';

import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import {
  PRODUCT_BASIC_INFO_INPUT_MAP_DATA,
  PRODUCT_CATEGORIES_SELECT_MAP_DATA,
} from '@/constants/input.constants';
import type { TCategory } from '@/types/api.type';

interface Props {
  form: UseFormReturn<TProductBasicInfoZodSchema>;
  categories: Record<'L1' | 'L2' | 'L3', TCategory[]>;
}

const AddProductBasicInfoFields = ({ form, categories }: Props) => {
  const l1Category = useWatch({ control: form.control, name: 'l1Category' });
  const l2Category = useWatch({ control: form.control, name: 'l2Category' });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {PRODUCT_BASIC_INFO_INPUT_MAP_DATA.map((input) => (
        <Input
          key={input.name}
          label={input.label}
          register={form.register(input.name, {
            ...(input.type === 'number' && { valueAsNumber: true }),
          })}
          error={form.formState.errors[input.name]?.message}
          inputProps={{ type: input.type, placeholder: input.placeholder, name: input.name }}
        />
      ))}
      <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
        {PRODUCT_CATEGORIES_SELECT_MAP_DATA.map((select) => {
          const { label, name, placeholder } = select;
          const isL1 = name === 'l1Category';
          const isL2 = name === 'l2Category';
          const isL3 = name === 'l3Category';
          const cats = isL1 ? categories.L1 : isL2 ? categories.L2 : isL3 ? categories.L3 : [];

          const options = cats.map((cat) => ({ label: cat.name, value: cat._id }));
          return (
            <Controller
              key={name}
              name={name}
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <Select
                  label={label}
                  error={
                    form.formState.errors[name]?.message ??
                    form.formState.errors[name]?.name?.message ??
                    form.formState.errors[name]?._id?.message
                  }
                  options={options}
                  position="top"
                  selectProps={{
                    value: value._id,
                    placeholder,
                    disabled: isL2 ? !l1Category : isL3 ? !l2Category : !options.length,
                    onChange: (value) => {
                      const catName = options.find((cat) => cat.value === value)?.label;

                      if (!catName) return;

                      if (isL1) {
                        form.resetField('l2Category');
                        form.resetField('l3Category');
                      }
                      if (isL2) {
                        form.resetField('l3Category');
                      }
                      onChange({ _id: value, name: catName });
                    },
                  }}
                />
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AddProductBasicInfoFields;
