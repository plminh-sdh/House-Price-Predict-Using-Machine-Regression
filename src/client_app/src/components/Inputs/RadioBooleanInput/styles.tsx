import { Form } from 'react-bootstrap';
import styled from 'styled-components';

export const RadioButton = styled(Form.Check).attrs({
  type: 'radio',
})`
  display: flex;
  align-items: center;
  height: 2.225rem;
  margin-bottom: 0;

  .form-check-input {
    margin-right: 0.5rem;
  }

  ${({ $variant }) =>
    $variant === 'vertical' &&
    `
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  .form-check-input {
    float: none;
    margin: 0;
  }
    `}
`;

export const RadioButtonGroupWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  padding: 0;
`;
