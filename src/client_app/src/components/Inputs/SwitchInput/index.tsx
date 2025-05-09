import { memo } from 'react';
import { SwitchButton, SwitchInputWrapper } from './styles';

export type SwitchInputProps = React.HTMLProps<HTMLInputElement> & {
  externalValue: boolean | undefined;
  setExternalValue: (value: boolean | undefined) => void;
  isInvalid?: boolean;
  style?: React.CSSProperties;
};

const SwitchInput = memo(
  ({
    externalValue,
    setExternalValue,
    isInvalid,
    style,
    disabled,
    onBlur,
    onFocus,
  }: SwitchInputProps) => {
    return (
      <SwitchInputWrapper>
        <SwitchButton
          disabled={disabled}
          isInvalid={isInvalid}
          checked={externalValue}
          onChange={() => {
            setExternalValue(!externalValue);
          }}
          onBlur={onBlur}
          onFocus={onFocus}
          style={style}
        />
        <span className="ms-3">{externalValue ? 'Yes' : 'No'}</span>
      </SwitchInputWrapper>
    );
  },
);

export default SwitchInput;
