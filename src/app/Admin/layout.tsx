
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Pas de Navbar ni Footer sur la page Admin
  return <>{children}</>;
}
