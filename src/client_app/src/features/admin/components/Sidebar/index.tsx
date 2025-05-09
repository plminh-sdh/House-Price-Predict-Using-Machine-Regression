import {
  IconChevronRight,
  IconChevronLeft,
  IconUsers,
  IconUsersGroup,
  IconList,
} from '@tabler/icons-react';
import SidebarLink from '@admin/components/SidebarLink';
import { useState } from 'react';
import { SidebarWrapper, Logo } from './styles';
import { SidebarItem } from '@admin/models/sidebar-item';
import { Link } from 'react-router';
import { adminPaths } from '@admin/enums/admin-paths';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarWrapper
      $isCollapsed={collapsed}
      className="navbar navbar-vertical navbar-expand-sm navbar-dark overflow-auto"
    >
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-testid="sidebar-toggle"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-brand navbar-brand-autodark d-flex justify-content-between p-3">
          {collapsed ? (
            <>
              <IconChevronRight
                data-testid="sidebar-IconChevronRight"
                size={32}
                onClick={() => setCollapsed(false)}
                role="button"
                style={{
                  height: 32,
                }}
              />
            </>
          ) : (
            <>
              <Link to="/">
                <h1 className="text-white m-0 text-center">Admin</h1>
              </Link>

              <IconChevronLeft
                data-testid="sidebar-IconChevronLeft"
                size={27}
                onClick={() => setCollapsed(true)}
                role="button"
              />
            </>
          )}
        </div>
        <div className="collapse navbar-collapse" id="sidebar-menu">
          <ul className="navbar-nav">
            {sidebarItems.map((item) => (
              <SidebarLink item={item} key={item.title} collapsed={collapsed} />
            ))}
          </ul>
        </div>
      </div>
    </SidebarWrapper>
  );
}

export default Sidebar;

const sidebarItems: SidebarItem[] = [
  {
    title: 'Project Admin',
    path: adminPaths.projectAdmin,
    icon: <IconList />,
  },
  {
    title: 'User Admin',
    path: adminPaths.userAdmin,
    icon: <IconUsers />,
  },
  {
    title: 'User Groups',
    path: adminPaths.userGroups,
    icon: <IconUsersGroup />,
  },
];
