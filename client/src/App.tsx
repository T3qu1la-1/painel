import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import { MainLayout } from "@/components/layout/MainLayout";
import EmailLookup from "@/pages/email-lookup";
import DomainAnalysis from "@/pages/domain-analysis";
import IPGeolocation from "@/pages/ip-geolocation";
import SocialMedia from "@/pages/social-media";
import PhoneLookup from "@/pages/phone-lookup";
import SearchHistory from "@/pages/search-history";
import Bookmarks from "@/pages/bookmarks";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Admin from "@/pages/admin";

// New OSINT Pages
import EmailBreachCheck from "@/pages/osint/EmailBreachCheck";
import IPGeolocationPage from "@/pages/osint/IPGeolocation";
import UsernameCheckPage from "@/pages/osint/UsernameCheck";
import HashGenerator from "@/pages/tools/HashGenerator";
import Base64Tool from "@/pages/tools/Base64Tool";
import PasswordGenerator from "@/pages/tools/PasswordGenerator";

function AuthProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isApproved, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (!isApproved) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-2">Aguardando Aprovação</h2>
            <p className="text-yellow-200 mb-4">
              Sua conta foi criada com sucesso, mas ainda precisa ser aprovada por um administrador.
            </p>
            <p className="text-gray-400 text-sm">
              Você receberá acesso assim que sua conta for aprovada. Entre em contato com o administrador se necessário.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <Component />
    </MainLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
      {/* Legacy Routes - Manter para compatibilidade */}
      <Route path="/email-lookup" component={() => <AuthProtectedRoute component={EmailLookup} />} />
      <Route path="/domain-analysis" component={() => <AuthProtectedRoute component={DomainAnalysis} />} />
      <Route path="/ip-geolocation" component={() => <AuthProtectedRoute component={IPGeolocation} />} />
      <Route path="/social-media" component={() => <AuthProtectedRoute component={SocialMedia} />} />
      <Route path="/phone-lookup" component={() => <AuthProtectedRoute component={PhoneLookup} />} />
      <Route path="/search-history" component={() => <AuthProtectedRoute component={SearchHistory} />} />
      <Route path="/bookmarks" component={() => <AuthProtectedRoute component={Bookmarks} />} />
      <Route path="/admin" component={() => <AuthProtectedRoute component={Admin} />} />
      
      {/* New OSINT Routes - organized by menu structure */}
      
      {/* OSINT Menu */}
      <Route path="/osint/email" component={() => <AuthProtectedRoute component={EmailBreachCheck} />} />
      <Route path="/osint/domain" component={() => <AuthProtectedRoute component={DomainAnalysis} />} />
      <Route path="/osint/ip" component={() => <AuthProtectedRoute component={IPGeolocationPage} />} />
      <Route path="/osint/phone" component={() => <AuthProtectedRoute component={PhoneLookup} />} />
      <Route path="/osint/social" component={() => <AuthProtectedRoute component={SocialMedia} />} />
      <Route path="/osint/username" component={() => <AuthProtectedRoute component={UsernameCheckPage} />} />
      <Route path="/osint/whois" component={() => <AuthProtectedRoute component={DomainAnalysis} />} />
      
      {/* Tools Menu */}
      <Route path="/tools/hash" component={() => <AuthProtectedRoute component={HashGenerator} />} />
      <Route path="/tools/base64" component={() => <AuthProtectedRoute component={Base64Tool} />} />
      <Route path="/tools/url" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/tools/portscan" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/tools/password" component={() => <AuthProtectedRoute component={PasswordGenerator} />} />
      <Route path="/tools/qrcode" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
      {/* Breach Check Menu */}
      <Route path="/breach/email" component={() => <AuthProtectedRoute component={EmailBreachCheck} />} />
      <Route path="/breach/password" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/breach/domain" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
      {/* Data Menu */}
      <Route path="/data/history" component={() => <AuthProtectedRoute component={SearchHistory} />} />
      <Route path="/data/bookmarks" component={() => <AuthProtectedRoute component={Bookmarks} />} />
      <Route path="/data/export" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
