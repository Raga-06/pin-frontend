import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import DesktopSidebar from '../components/layout/DesktopSidebar';
import MobileSidebar from '../components/layout/MobileSidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import UploadModal from '../components/modals/UploadModal';
import { useAuthStore } from '../store/useAuthStore';

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleUpload = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setUploadOpen(true);
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Navbar onMenuClick={() => setMenuOpen(true)} onUpload={handleUpload} />
      <DesktopSidebar onUpload={handleUpload} />
      <MobileSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <MobileBottomNav onUpload={handleUpload} />
      <main className="lg:pl-20">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
          <Outlet context={{ openUpload: handleUpload }} />
        </div>
      </main>
      {isAuthenticated && (
        <UploadModal
          isOpen={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onSuccess={() => window.dispatchEvent(new CustomEvent('pinsphere:refresh-feed'))}
        />
      )}
    </div>
  );
}
