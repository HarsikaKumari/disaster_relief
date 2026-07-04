import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/layouts/sidebar';
import { useState } from 'react';

export const ChatLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      <Sidebar active="Chat" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        <Outlet context={{ setMobileOpen }} />
      </div>
    </div>
  );
};