import { SidebarItem } from "@admin/models/sidebar-item";
import { NavItem, NavLink } from "react-bootstrap";
import { Link, useLocation } from "react-router";

type Props = {
  item: SidebarItem;
  collapsed: boolean;
};
function SidebarLink({ item, collapsed }: Props) {
  const { pathname } = useLocation();
  return (
    <NavItem
      className={item.path === pathname ? "active" : ""}
      data-testid="sidebar-link"
    >
      <NavLink as={Link} to={item.path} className="py-4 ">
        {collapsed && (
          <span className="nav-link-icon d-md-none d-lg-inline-block m-0 justify-self-center flex-grow-1">
            {item.icon}
          </span>
        )}

        {!collapsed && <span className="nav-link-title">{item.title}</span>}
      </NavLink>
    </NavItem>
  );
}

export default SidebarLink;
