import React, { useEffect, useRef, useState } from 'react';
import { CalendarIcon, DateInputWrapper, DisplayValue, Input } from './styles';
import { toddMMyyyy } from "@/helpers/format-date";

export type DateInputProps = React.HTMLProps<HTMLInputElement> & {
  externalValue: string | null;
  setExternalValue: (value: string | null) => void;
  isInvalid?: boolean;
  isPaddedRight?: boolean;
  disableManualInput?: boolean;
  marginLeft?: string;
  shadowBorder?: boolean | undefined;
  onChange?: (value: string) => void;
};

const DateInput = ({
  externalValue,
  setExternalValue,
  disabled,
  isInvalid = undefined,
  isPaddedRight = false,
  onBlur,
  onFocus,
  name,
  disableManualInput,
  max,
  min,
  marginLeft,
  shadowBorder = true,
  onChange,
}: DateInputProps) => {
  const [dateFormatted, setDateFormatted] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (selectedDate === '') {
      setExternalValue(null);
      setDateFormatted(null);
    } else {
      const formattedDate = toddMMyyyy(selectedDate);
      setExternalValue(selectedDate);
      setDateFormatted(formattedDate);
    }
    if (onChange) {
      onChange(toddMMyyyy(selectedDate) ?? '');
    }
  };

  useEffect(() => {
    if (externalValue) {
      const formattedDate = toddMMyyyy(externalValue);
      setDateFormatted(formattedDate);
    } else {
      setDateFormatted(null);
    }
  }, [externalValue]);

  const handleClickToShowDatePicker = (e: any) => {
    e.stopPropagation();
    if (dateInputRef.current) {
      if (dateInputRef.current.showPicker) {
        try {
          dateInputRef.current.showPicker();
        } catch (e) {
          dateInputRef.current.click();
        }
      } else {
        dateInputRef.current.click();
      }
    }
  };

  return (
    <DateInputWrapper>
      <Input
        ref={dateInputRef}
        name={name}
        data-testid={`test-${name}`}
        type="date"
        onChange={handleDateChange}
        value={externalValue ?? ''}
        disabled={disabled}
        isInvalid={isInvalid}
        $isPaddedRight={isPaddedRight}
        onClick={handleClickToShowDatePicker}
        onKeyDown={(e: any) => disableManualInput && e.preventDefault()}
        onFocus={onFocus}
        onBlur={onBlur}
        max={max}
        min={min}
        style={{
          backgroundImage: isInvalid ? 'none' : undefined,
          marginLeft: marginLeft,
        }}
        $shadowBorder={shadowBorder === false && isInvalid === false}
      />
      <CalendarIcon />
      <DisplayValue onClick={handleClickToShowDatePicker}>
        {dateFormatted ?? ''}
      </DisplayValue>
    </DateInputWrapper>
  );
};

export default DateInput;
