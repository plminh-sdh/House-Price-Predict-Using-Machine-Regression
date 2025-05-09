import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import SelectedItem from './SelectedItem';
import Option from '@/models/option';
import { CustomToggle } from './CustomToggle';
import Menu from './Menu';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';
import MenuWithAction from './MenuWithAction';

export type MultiSelectionDropDownProps = React.HTMLProps<HTMLSelectElement> & {
  externalValue: string[] | null;
  setExternalValue: (value: string[] | null) => void;
  options: Option[];
  isInvalid?: boolean;
  disabled?: boolean;
  name?: string;
  placeholder?: string;
  onBlur?: (e: any) => void;
  onFocus?: (e: any) => void;
  withAction?: {
    label: string;
    action: (value: string) => void;
  };
};

const MultiSelectionDropDown = ({
  externalValue,
  setExternalValue,
  options,
  name,
  placeholder,
  isInvalid,
  disabled = false,
  withAction,
  onBlur,
  onFocus,
}: MultiSelectionDropDownProps) => {
  const [search, setSearch] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const wrapperRef = useRef<any | null>(null);
  const [isFocused, setIsFocused] = useState<boolean | null>(null);

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

  useEffect(() => {
    setSearch('');
    setFilteredOptions(options);
  }, [options]);

  const removeItem = (key: string) => {
    if (externalValue) {
      const remains = externalValue.filter((i) => String(i) !== key.toString());
      setExternalValue([...remains]);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredArray = options.filter((option) =>
      option.displayValue.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredOptions(filteredArray);
  };

  const optionsArray = _.sortBy(filteredOptions, 'displayValue');

  return (
    <Dropdown
      ref={wrapperRef}
      className="p-0"
      autoClose="outside"
      data-testid="multi-selection-dropdown"
    >
      <Dropdown.Toggle
        name={name}
        as={CustomToggle}
        disabled={disabled}
        $isInvalid={isInvalid}
        $isDisabled={disabled}
      >
        <div className="d-flex flex-wrap gap-1">
          {externalValue && externalValue.length !== 0 ? (
            externalValue.map((selectedItem) => (
              <SelectedItem
                key={selectedItem}
                value={selectedItem}
                displayValue={
                  options.find((option) => option.value == selectedItem)
                    ?.displayValue ?? ''
                }
                removeItem={removeItem}
              />
            ))
          ) : (
            <span className="text-secondary">{placeholder || 'Select'}</span>
          )}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu
        as={withAction ? MenuWithAction : Menu}
        search={search}
        handleSearch={handleSearch}
        actionLabel={withAction?.label}
        buttonAction={withAction?.action}
        options={options}
      >
        {optionsArray.map((opt) => {
          const isChecked =
            !!externalValue &&
            externalValue.some((v) => String(v) === opt.value.toString());

          const toggleValue = () => {
            if (externalValue) {
              const newValue = isChecked
                ? externalValue.filter(
                    (v) => String(v) !== opt.value.toString(),
                  )
                : [...externalValue, opt.value.toString()];
              setExternalValue(newValue);
            } else {
              setExternalValue([opt.value.toString()]);
            }
          };

          return (
            <Dropdown.Item key={opt.value} onClick={toggleValue}>
              <FormCheckInput
                type="checkbox"
                className="small-checkbox cursor-pointer"
                checked={isChecked}
                onClick={(e) => e.stopPropagation()}
                onChange={toggleValue}
              />
              <FormCheckLabel className="ms-2">
                {opt.displayValue}
              </FormCheckLabel>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MultiSelectionDropDown;
