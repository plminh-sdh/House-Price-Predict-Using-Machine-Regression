import styled from "styled-components";
import { Form } from "react-bootstrap";
import { IoCloseSharp } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";

export const InputBox = styled(Form.Control)`
  border-radius: 4px;
  width: 18rem;
  padding-left: 2rem;
  padding-right: 2rem;
`;

export const ClearIcon = styled(IoCloseSharp)`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;

  :hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export const SearchIcon = styled(BiSearch)`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
`;
