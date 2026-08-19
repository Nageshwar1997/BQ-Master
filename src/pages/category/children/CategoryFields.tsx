import { CATEGORY_LEVELS_MAP } from '@beautinique/frontend-constants';
import type {
  TCategoryZodSchema,
  TL1CategoryZodSchema,
  TL2CategoryZodSchema,
  TL3CategoryZodSchema,
} from '@beautinique/frontend-types';
import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFormRegister,
  type UseFormResetField,
} from 'react-hook-form';

import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import Tooltip from '@/components/ui/Tooltip';
import { EMPTY_ARRAY } from '@/constants/common.constants';
import type { TCategory } from '@/types/api.type';

interface TCommonFields {
  register: UseFormRegister<TCategoryZodSchema>;
  errors: FieldErrors<TCategoryZodSchema>;
  control: Control<TCategoryZodSchema>;
  level: TCategoryZodSchema['level'];
  resetField: UseFormResetField<TCategoryZodSchema>;
  isLevelDisabled: boolean;
}

type TLevel1Fields = TCommonFields & Pick<TL1CategoryZodSchema, 'level'>;

type TLevel2Fields = TCommonFields &
  Pick<TL2CategoryZodSchema, 'mainCategory' | 'level'> & {
    level1Cats: TCategory[] | undefined;
  };

type TLevel3Fields = TCommonFields &
  Pick<TL3CategoryZodSchema, 'mainCategory' | 'subCategory' | 'level'> & {
    level1Cats: TCategory[] | undefined;
    level2Cats: TCategory[] | undefined;
  };

const CommonFields = ({
  register,
  errors,
  control,
  level,
  resetField,
  isLevelDisabled,
}: TCommonFields) => (
  <>
    <Input
      label="Category name"
      register={register('name')}
      error={errors.name?.message}
      inputProps={{ name: 'name', placeholder: 'Enter category name' }}
    />

    <Tooltip title="Cannot change category level" required={isLevelDisabled}>
      <Controller
        name="level"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label="Category level"
            options={['Main', 'Sub', 'Product'].map((name, i) => ({
              value: i + CATEGORY_LEVELS_MAP.L1,
              label: `L${String(i + CATEGORY_LEVELS_MAP.L1)} - ${name} category`,
              disabled: i + 1 === level,
            }))}
            error={errors.level?.message}
            selectProps={{
              value,
              placeholder: 'Select category level',
              disabled: isLevelDisabled,
              onChange: (value) => {
                onChange(value);

                resetField('mainCategory');
                resetField('subCategory');
                resetField('description');
              },
            }}
            containerClassName="w-full"
          />
        )}
      />
    </Tooltip>
  </>
);

/* -------------------------------------------------------------------------- */
/*                              LEVEL 1 FIELDS                                */
/* -------------------------------------------------------------------------- */

export const Level1Fields = ({
  register,
  errors,
  control,
  level,
  resetField,
  isLevelDisabled,
}: TLevel1Fields) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CommonFields
        register={register}
        errors={errors}
        control={control}
        level={level}
        resetField={resetField}
        isLevelDisabled={isLevelDisabled}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              LEVEL 2 FIELDS                                */
/* -------------------------------------------------------------------------- */

export const Level2Fields = ({
  register,
  errors,
  control,
  level,
  resetField,
  level1Cats = EMPTY_ARRAY,
  mainCategory,
  isLevelDisabled,
}: TLevel2Fields) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CommonFields
        register={register}
        errors={errors}
        control={control}
        level={level}
        resetField={resetField}
        isLevelDisabled={isLevelDisabled}
      />
      <Controller
        name="mainCategory"
        control={control}
        render={({ field: { onChange } }) => (
          <Select
            label="Main category"
            options={level1Cats.map((cat: TCategory) => ({ label: cat.name, value: cat._id }))}
            error={'mainCategory' in errors ? errors.mainCategory?.message : undefined}
            selectProps={{
              value: mainCategory,
              placeholder: 'Select main category',
              onChange: onChange,
              disabled: isLevelDisabled,
            }}
          />
        )}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              LEVEL 3 FIELDS                                */
/* -------------------------------------------------------------------------- */

export const Level3Fields = ({
  register,
  errors,
  control,
  level,
  resetField,
  level1Cats = EMPTY_ARRAY,
  level2Cats = EMPTY_ARRAY,
  mainCategory,
  subCategory,
  isLevelDisabled,
}: TLevel3Fields) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CommonFields
        register={register}
        errors={errors}
        control={control}
        level={level}
        resetField={resetField}
        isLevelDisabled={isLevelDisabled}
      />

      <Controller
        name="mainCategory"
        control={control}
        render={({ field: { onChange } }) => (
          <Select
            label="Main category"
            options={level1Cats.map((cat: TCategory) => ({ label: cat.name, value: cat._id }))}
            error={'mainCategory' in errors ? errors.mainCategory?.message : undefined}
            selectProps={{
              value: mainCategory,
              placeholder: 'Select main category',
              onChange: (value) => {
                onChange(value);

                resetField('subCategory');
              },
              disabled: isLevelDisabled,
            }}
          />
        )}
      />

      <Controller
        name="subCategory"
        control={control}
        render={({ field: { onChange } }) => (
          <Select
            label="Sub-category"
            options={level2Cats.map((cat) => ({ label: cat.name, value: cat._id }))}
            error={'subCategory' in errors ? errors.subCategory?.message : undefined}
            selectProps={{
              value: subCategory,
              placeholder: 'Select sub-category',
              disabled: !mainCategory || isLevelDisabled,
              onChange,
            }}
          />
        )}
      />
      <Input
        label="Short description"
        register={register('description')}
        error={'description' in errors ? errors.description?.message : undefined}
        containerClassName="sm:col-span-2"
        inputProps={{
          name: 'description',
          placeholder: 'Short description for this product category',
        }}
      />
    </div>
  );
};
