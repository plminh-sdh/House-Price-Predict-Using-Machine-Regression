import { Form } from 'react-bootstrap';
import styled from 'styled-components';

export const SwitchInputWrapper = styled(Form.Check).attrs(() => ({
  type: 'switch',
}))`
  display: flex;
  align-items: center;
  height: 2.225rem;
  margin-bottom: 0;
`;

export const SwitchButton = styled(Form.Check.Input).attrs(() => ({
  type: 'checkbox',
}))``;
