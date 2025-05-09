import { Dropdown, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router";
import sessionService from "@auth/services/session.service";
import NavMenuToggle from "@admin/components/NavMenuToggle";
import Sidebar from "@admin/components/Sidebar";

type Props = {
  children: any;
};

function AdminLayout({ children }: Props) {
  const navigate = useNavigate();
  return (
    <div className="page">
      <Sidebar />
      <div className="page-wrapper">
        <Navbar bg="primary" className="py-3 d-flex justify-content-end pe-5">
          <Dropdown className="ms-auto d-flex align-items-center">
            <Dropdown.Toggle as={NavMenuToggle} />
            <Dropdown.Menu align="end" className="dropdown-menu-arrow">
              <Dropdown.Item
                eventKey="1"
                onClick={() => {
                  sessionService.logOut()
                    .then(_ => navigate("/login"))
                }}
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar>
        {children}
      </div>
    </div >
  );
}

export default AdminLayout;
