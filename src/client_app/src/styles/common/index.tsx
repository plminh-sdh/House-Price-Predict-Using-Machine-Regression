import { IconArrowBigDownFilled } from '@tabler/icons-react';
import { ModalHeader } from 'react-bootstrap';
import styled, { css } from 'styled-components';

export const StyledModalHeader = styled(ModalHeader)`
  background-color: ${({ theme }) => theme.editModal.primaryColor};
  color: ${({ theme }) => theme.editModal.headerTextColor};
`;
export const SortableWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;
interface SortChevronProps {
  $desc: boolean;
  $show: boolean;
}

export const SortChevron = styled(IconArrowBigDownFilled)<SortChevronProps>`
  transition-duration: 0.2s;
  transition-property: transform;
  display: ${({ $show }) => ($show ? 'inline-block' : 'none')};
  ${({ $desc }) =>
    !$desc &&
    css`
      transform: rotate(180deg);
    `};
`;
