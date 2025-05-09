import { FormControl } from "react-bootstrap";
import styled from "styled-components";
type Props = {
  $isPaddedRight: boolean;
  $shadowBorder: boolean;
};
export const Input = styled(FormControl)<Props>`
  padding: 0.375rem 0.75rem !important;
  ${({ $isPaddedRight }) =>
    $isPaddedRight &&
    `
    padding-right: 3rem !important;
  `}
  &::-webkit-calendar-picker-indicator {
    opacity: 0.5;
  }

  height: 40px;

  /* Hide default calendar icon in Firefox */
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;

  /* Hide default calendar icon in Chrome */
  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    cursor: default;
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    top: 2;
    left: 2;
    z-index: 5;
    background-color: white;
  }

  /* Hide clear button in Edge */
  &::-ms-clear {
    display: none;
  }

  /* Hide default placeholder */
  position: relative;

  /* For Chrome/Opera/Safari */
  &::-webkit-datetime-edit-text,
  &::-webkit-datetime-edit-month-field,
  &::-webkit-datetime-edit-day-field,
  &::-webkit-datetime-edit-year-field,
  // for Safari - fix value showing up
  &::-webkit-date-and-time-value {
    display: none;
  }

  /* For Firefox */
  &::placeholder {
    opacity: 0;
  }

  /* hide the fields when input has value or is focused */
  &:focus::-webkit-datetime-edit-text,
  &:focus::-webkit-datetime-edit-month-field,
  &:focus::-webkit-datetime-edit-day-field,
  &:focus::-webkit-datetime-edit-year-field,
  &:focus::-webkit-date-and-time-value,
  &:not(:placeholder-shown)::-webkit-datetime-edit-text,
  &:not(:placeholder-shown)::-webkit-datetime-edit-month-field,
  &:not(:placeholder-shown)::-webkit-datetime-edit-day-field,
  &:not(:placeholder-shown)::-webkit-datetime-edit-year-field,
  &:not(:placeholder-shown)::-webkit-date-and-time-value {
    opacity: 0;
  }

  ${({ $shadowBorder }) =>
    $shadowBorder &&
    `border: none;
     box-shadow: none;
     &: focus{box-shadow: 0 0 1px rgba(24, 36, 51, 0.06) inset, 0 0 0 0.25rem rgba(60, 83, 60, 0.25),}
    `}
`;

export const CalendarIcon = styled.div`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none; /* Allows clicks to pass through to the input */
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  z-index: 2;
`;

export const DateInputWrapper = styled.div`
  position: relative;
  padding: 0;
  z-index: 9;
`;

export const DisplayValue = styled.div`
  z-index: 10;
  position: absolute;
  top: 12px;
  left: 0.5rem;
`;
