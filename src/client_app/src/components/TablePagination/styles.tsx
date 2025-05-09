import styled from "styled-components";
import { Pagination } from "react-bootstrap";

export const PrevBtn = styled(Pagination.Prev)`
  .page-link {
    margin-left: 0;
  }
`;

export const NextBtn = styled(Pagination.Next)`
  && {
    .page-link {
      margin-left: 0;
    }
  }
`;

export const PageItemBtn = styled(Pagination.Item)`
  && {
    .page-link {
      margin-left: 0;
    }
  }
`;

export const EllipsisBtn = styled(Pagination.Ellipsis)`
  && {
    .page-link {
      margin-left: 0;
    }
  }
`;
