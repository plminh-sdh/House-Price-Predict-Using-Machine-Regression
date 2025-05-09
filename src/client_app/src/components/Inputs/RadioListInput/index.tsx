import { memo, useMemo } from 'react';
import { RadioButton, RadioButtonGroupWrapper } from './styles';
import Option from '@/models/option';

export type RadioListInputProps = React.HTMLProps<HTMLInputElement> & {
  name: string;
  externalValue: string | null;
  setExternalValue: (value: string | null) => void;
  options: Option[];
  disabledOptions?: Option[];
  isInvalid?: boolean;
  variant?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
};

const RadioListInput = memo(
  ({
    name,
    externalValue,
    setExternalValue,
    disabled,
    options,
    isInvalid = undefined,
    onBlur,
    onFocus,
    disabledOptions = [],
    variant,
    style,
  }: RadioListInputProps) => {
    const disabledValues = useMemo(
      () => disabledOptions?.map((o) => o.value),
      [disabledOptions],
    );

    return (
      <RadioButtonGroupWrapper>
        {options.map((o) => {
          const isChecked = externalValue === o.value;
          return (
            <RadioButton
              label={o.displayValue}
              key={o.value}
              value={o.value}
              id={`option-${name}-${o.value}`}
              onChange={() => {
                setExternalValue(o.value);
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

export default RadioListInput;
