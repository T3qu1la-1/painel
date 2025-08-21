import { Navigation } from "./Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { logout, user } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Navigation onLogout={handleLogout} username={user?.username} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}