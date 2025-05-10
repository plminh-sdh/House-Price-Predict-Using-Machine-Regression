import { Card, Dropdown, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';
import sessionService from '@auth/services/session.service';
import NavMenuToggle from '@admin/components/NavMenuToggle';
import { adminPaths } from '@admin/enums/admin-paths';
import { useMemo } from 'react';
import { AdminActions } from '@/enums/actions';
import { Logo } from './styles';
import { clientPaths } from '../../enums/client-paths';

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  const navigate = useNavigate();

  const currentUser = sessionService.getCurrentUser();
  const isAdmin = useMemo(() => {
    if (!currentUser) return false;
    const userActions = new Set(currentUser.actions);
    return Object.keys(AdminActions).every((str) => userActions.has(str));
  }, [currentUser]);

  return (
    <div className="page">
      <div className="page-wrapper">
        <Navbar
          bg="primary"
          className="py-3 d-flex align-items-center justify-content-space-between px-3"
        >
          <h1 className="text-white m-0 text-center">House Price Predictor</h1>

          <Dropdown className="ms-auto d-flex align-items-center">
            <Dropdown.Toggle as={NavMenuToggle} />
            <Dropdown.Menu align="end" className="dropdown-menu-arrow p-0">
              <Card>
                <Card.Header className="p-2">
                  {currentUser?.fullName ?? 'User'}
                </Card.Header>
                <Card.Body className="p-0">
                  {isAdmin && (
                    <Dropdown.Item
                      eventKey="1"
                      className="ps-3"
                      onClick={() => navigate(adminPaths.userAdmin)}
                    >
                      Configuration
                    </Dropdown.Item>
                  )}

                  <Dropdown.Item
                    eventKey="2"
                    className="ps-3"
                    onClick={() => {
                      sessionService.logOut().then(() => navigate('/login'));
                    }}
                  >
                    Log out
                  </Dropdown.Item>
                </Card.Body>
              </Card>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar>
        {children}
      </div>
    </div>
  );
}

export default Layout;
