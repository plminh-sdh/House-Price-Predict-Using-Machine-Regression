import styled from 'styled-components';

export const SidebarWrapper = styled.div<{ $isCollapsed: boolean }>`
  width: ${(props) => (props.$isCollapsed ? '80px' : '250px')};
  transition: width 0.3s;
  background-color: #f6f6f2;
  height: 100vh;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1030;

  .navbar-brand {
    background-color: #1e293b;
  }

  .navbar-nav {
    background-color: #1e293b;
  }

  a {
    color: white;
  }

  a:hover {
    color: #38bdf8;
  }
`;
