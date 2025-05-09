import { memo, useMemo } from 'react';
import { RadioButton, RadioButtonGroupWrapper } from './styles';
import Option from '@/models/option';

export type RadioBooleanInputProps = React.HTMLProps<HTMLInputElement> & {
  name: string;
  externalValue: boolean | null;
  setExternalValue: (value: boolean | null) => void;
  disabledOptions?: Option[];
  isInvalid?: boolean;
  variant?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
};

const RadioBooleanInput = memo(
  ({
    name,
    externalValue,
    setExternalValue,
    disabled,
    isInvalid = undefined,
    onBlur,
    onFocus,
    disabledOptions = [],
    variant,
    style,
  }: RadioBooleanInputProps) => {
    const booleanOptions: Option[] = [
      { value: 'true', displayValue: 'Yes' },
      { value: 'false', displayValue: 'No' },
    ];

    const disabledValues = useMemo(
      () => disabledOptions?.map((o) => o.value),
      [disabledOptions],
    );

    function stringToBoolean(value: string): boolean {
      return value.toLowerCase() === 'true';
    }

    return (
      <RadioButtonGroupWrapper>
        {booleanOptions.map((o) => {
          const isChecked =
            stringToBoolean(String(externalValue)) === stringToBoolean(o.value);
          return (
            <RadioButton
              label={o.displayValue}
              key={o.value}
              value={o.value}
              id={`option-${name}-${o.value}`}
              onChange={() => {
                setExternalValue(stringToBoolean(o.value));
              }}
              checked={isChecked}
              disabled={disabled ?? disabledValues?.includes(o.value)}
              isInvalid={isInvalid}
              onBlur={onBlur}
              onFocus={onFocus}
              $variant={variant}
              style={style}
            />
          );
        })}
      </RadioButtonGroupWrapper>
    );
  },
);

export default RadioBooleanInput;
