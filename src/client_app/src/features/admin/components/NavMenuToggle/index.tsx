import sessionService from '@auth/services/session.service';
import { forwardRef } from 'react';

const NavMenuToggle = forwardRef<any, any>(({ onClick }, ref) => {
  const currentUser = sessionService.getCurrentUser();

  return (
    <div className="d-flex">
      <div
        className="d-flex lh-1 cursor-pointer text-white"
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {currentUser?.fullName}
      </div>
    </div>
  );
});

export default NavMenuToggle;
