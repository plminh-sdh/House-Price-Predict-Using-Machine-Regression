import { Spinner } from "react-bootstrap";
import styled from "styled-components";

export const SpinnerLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledSpinner = styled(Spinner)`
  width: 3rem;
  height: 3rem;
  color: ${({ theme }) => theme.spinnerColor.secondaryBgColor};
`;
