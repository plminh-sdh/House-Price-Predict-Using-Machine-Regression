import React, { memo, useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { CustomMenu } from './CustomMenu';
import CustomMenuWithSearch from './CustomMenuWithSearch';
import { CustomToggle } from './CustomToggle';
import { Input } from './styles';
import Option from '@/models/option';

export type ComboboxInputProps = React.HTMLProps<HTMLSelectElement> & {
  externalValue?: string;
  setExternalValue: (value?: any) => void;
  maxLength?: number;
  options: Option[];
  isInvalid?: boolean;
  withSearch?: boolean;
  hideEmptyOption?: boolean;
  disabled?: boolean;
  onBlur?: (e: any) => void;
  onFocus?: (e: any) => void;
  name?: string;
  placeholder?: string;
};

const ComboboxInput = ({
  externalValue,
  setExternalValue,
  disabled,
  options,
  isInvalid = undefined,
  withSearch,
  onBlur,
  onFocus,
  name,
  placeholder,
  maxLength,
  hideEmptyOption,
}: ComboboxInputProps) => {
  const wrapperRef = useRef<any | null>(null);
  const [isFocused, setIsFocused] = useState<boolean | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  // Sync the input value with the external value
  useEffect(() => {
    const found = options.find(
      (o) => o.value.toString() === externalValue?.toString(),
    );
    setInputValue(found?.displayValue || externalValue || '');
  }, [externalValue, options]);

  useEffect(() => {
    const handleFocus = (event: any) => {
      if (wrapperRef.current?.contains(event.target)) {
        onFocus?.(event);
      } else {
        setIsFocused((prev) => {
          if (prev === null) return null;
          onBlur?.(event);
          return false;
        });
      }
    };

    document.addEventListener('mousedown', handleFocus);
    return () => {
      document.removeEventListener('mousedown', handleFocus);
    };
  }, [onBlur, onFocus]);

  return (
    <Dropdown ref={wrapperRef} className="p-0">
      <Dropdown.Toggle
        name={name}
        as={CustomToggle}
        disabled={disabled}
        $isInvalid={isInvalid}
        $isDisabled={disabled}
      >
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setExternalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder ?? 'Select or type'}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete="off"
        />
      </Dropdown.Toggle>

      <Dropdown.Menu
        as={!withSearch ? CustomMenu : CustomMenuWithSearch}
        {...(withSearch && { maxLength })}
        style={{
          width: wrapperRef.current?.offsetWidth || 'auto',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        {!hideEmptyOption && (
          <Dropdown.Item
            onClick={() => {
              setExternalValue(null);
              setInputValue('');
            }}
          >
            {!placeholder ? 'Select' : placeholder}
          </Dropdown.Item>
        )}
        {options.map((o) => (
          <Dropdown.Item
            key={o.value}
            onClick={() => {
              setExternalValue(o.value);
              setInputValue(o.displayValue);
            }}
            active={externalValue === o.value}
          >
            {o.displayValue}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default memo(ComboboxInput);
