import { Button } from 'react-bootstrap';
import styled from 'styled-components';

export const CustomButton = styled(Button)<{ $maxWidth?: string }>`
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth ?? 'none'};
`;
