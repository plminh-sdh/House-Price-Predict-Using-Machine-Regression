import ComboboxInput, { ComboboxInputProps } from '../ComboboxInput';
import DateInput, { DateInputProps } from '../DateInput';
import DigitOnlyInput, { DigitOnlyInputProps } from '../DigitOnlyInput';
import DropdownInput, { DropDownInputProps } from '../DropdownInput';
import MultiSelectionDropDown, {
  MultiSelectionDropDownProps,
} from '../MultiSelectionDropDown';
import HalfDateInput, {
  HalfDateInputProps,
} from '../NumberInput/HalfDateInput';
import PositiveIntegerInput, {
  PositiveIntegerInputProps,
} from '../NumberInput/PositiveIntegerInput';
import RadioBooleanInput, {
  RadioBooleanInputProps,
} from '../RadioBooleanInput';
import RadioListInput, { RadioListInputProps } from '../RadioListInput';
import SwitchInput, { SwitchInputProps } from '../SwitchInput';
import TextInput, { TextInputProps } from '../TextInput';
import withReactHookForm from './withReactHookForm';

const TextInputRHF = withReactHookForm<TextInputProps>(TextInput);
const DigitOnlyInputRHF =
  withReactHookForm<DigitOnlyInputProps>(DigitOnlyInput);

const PositiveIntegerInputRHF =
  withReactHookForm<PositiveIntegerInputProps>(PositiveIntegerInput);
const HalfDateInputRHF = withReactHookForm<HalfDateInputProps>(HalfDateInput);

const DropDownInputRHF = withReactHookForm<DropDownInputProps>(DropdownInput);
const MultiSelectionDropDownRHF =
  withReactHookForm<MultiSelectionDropDownProps>(MultiSelectionDropDown);
const ComboboxInputRHF = withReactHookForm<ComboboxInputProps>(ComboboxInput);

const DateInputRHF = withReactHookForm<DateInputProps>(DateInput);

const RadioListInputRHF = withReactHookForm<RadioListInputProps>(
  RadioListInput,
  false,
);

const RadioBooleanInputRHF = withReactHookForm<RadioBooleanInputProps>(
  RadioBooleanInput,
  false,
);

const SwitchInputRHF = withReactHookForm<SwitchInputProps>(SwitchInput);

export {
  TextInputRHF,
  DigitOnlyInputRHF,
  PositiveIntegerInputRHF,
  HalfDateInputRHF,
  DropDownInputRHF,
  MultiSelectionDropDownRHF,
  ComboboxInputRHF,
  DateInputRHF,
  RadioListInputRHF,
  SwitchInputRHF,
  RadioBooleanInputRHF,
};
