
"use client";
import { usePathname } from 'next/navigation';

import Navbar from '../../elements/Navbar';
import Footer from '../../elements/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Cacher Navbar/Footer sur /login et /inscription
  const hideLayout = ['/Connexion', '/Inscription'].includes(pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}