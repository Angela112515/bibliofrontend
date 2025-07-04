
"use client";
import { usePathname } from 'next/navigation';
import Navbar from '../../elements/Navbar';
import Footer from '../../elements/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Cacher Navbar/Footer sur /Connexion, /Inscription et /Admin
  const hideLayout = [
    '/Connexion',
    '/Inscription',
    '/Admin'
  ].some((path) => pathname.startsWith(path));

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
