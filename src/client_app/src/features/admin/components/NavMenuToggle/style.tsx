import { styled } from "styled-components";
import { Tooltip } from "react-bootstrap";

export const TooltipBox = styled(Tooltip)`
  .tooltip-inner {
    background-color: ${({ theme }) => theme.tooltip.background};
    color: ${({ theme }) => theme.tooltip.text};
    min-width: 100px;
    max-width: 100%;
  }

  .tooltip-arrow::before {
    border-left-color: ${({ theme }) => theme.tooltip.background} !important;
    border-bottom-color: ${({ theme }) => theme.tooltip.background} !important;
  }
`;

export const QuestionMarkCircle = styled.img`
  user-drag: none;
  user-select: none;
  -webkit-user-drag: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;
