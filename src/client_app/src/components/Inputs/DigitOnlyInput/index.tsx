import React, { memo } from 'react';
import { Input } from './styles';

export type DigitOnlyInputProps = React.HTMLProps<HTMLInputElement> & {
  externalValue: string | null | undefined;
  setExternalValue: (value: string | null | undefined) => void;
  isInvalid?: boolean;
};

const DigitOnlyInput = memo(
  React.forwardRef<HTMLInputElement, DigitOnlyInputProps>(
    (
      {
        externalValue,
        setExternalValue,
        isInvalid = false,
        readOnly,
        disabled,
        onBlur,
        onFocus,
        name,
        placeholder,
        maxLength,
        className,
      }: DigitOnlyInputProps,
      ref,
    ) => {
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Allow only digits, discard non-digits
        if (/^\d*$/.test(value)) {
          setExternalValue(value);
        }
      };

      return (
        <Input
          className={className}
          name={name}
          ref={ref}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          readOnly={readOnly}
          type="text"
          onChange={handleChange}
          isInvalid={isInvalid}
          value={externalValue ?? ''}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      );
    },
  ),
);

export default DigitOnlyInput;
