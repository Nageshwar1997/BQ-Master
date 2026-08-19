import type { IRadio } from '@/types/input.type';

import { InputError } from './children';

const Radio = ({
  value,
  onChange,
  options,
  className = '',
  containerClassName = '',
  error,
}: IRadio) => {
  const index = options.findIndex((opt) => opt.value === value);
  const translatePercent = `${String(index * 100)}%`;

  return (
    <div className={`flex max-w-full min-w-0 flex-col gap-1.5 ${containerClassName}`}>
      <div
        className={`border-battleship-davys-gray mx-auto flex w-full items-center justify-center gap-4 overflow-hidden rounded-full border ${className}`}
      >
        <div className="bg-smoke-eerie shadow-primary-btn hover:shadow-primary-btn-hover relative flex h-9 w-full items-center justify-between rounded-full transition-shadow duration-300">
          {/* Toggle Background */}
          <div
            className="bg-accent-duo absolute h-full transform rounded-full shadow-lg transition-transform duration-300 ease-in-out"
            style={{
              width: `${String(100 / options.length)}%`,
              transform: `translateX(${translatePercent})`,
            }}
          />

          {options.map((option) => (
            <label
              key={option.value}
              className={`relative z-1 inline-block flex-1 cursor-pointer text-center text-sm ${
                value === option.value
                  ? 'font-semibold text-white/90'
                  : 'text-primary/50 font-medium'
              }`}
            >
              <input
                type="radio"
                name="radio"
                value={option.value}
                checked={value === option.value}
                onChange={() => {
                  onChange(option.value);
                }}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
      <InputError error={error} />
    </div>
  );
};

export default Radio;
