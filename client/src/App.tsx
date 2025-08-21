import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import { MainLayout } from "@/components/layout/MainLayout";
import SearchHistory from "@/pages/search-history";
import Bookmarks from "@/pages/bookmarks";
import Login from "@/pages/login";
import Register from "@/pages/register";
import SearchEnginesGeneral from "@/pages/search-engines-general";
import SearchEnginesSpecialty from "@/pages/search-engines-specialty";
import PeopleEmail from "@/pages/people-email";
import PeoplePhone from "@/pages/people-phone";
import PeopleUsername from "@/pages/people-username";
import SocialTwitter from "@/pages/social-twitter";
import TechnicalDomains from "@/pages/technical-domains";
import TechnicalIP from "@/pages/technical-ip";
import MediaImages from "@/pages/media-images";

import AdminPanel from "@/pages/AdminPanel";

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
      
      {/* Motores de Busca */}
      <Route path="/search-engines/general" component={() => <AuthProtectedRoute component={SearchEnginesGeneral} />} />
      <Route path="/search-engines/specialty" component={() => <AuthProtectedRoute component={SearchEnginesSpecialty} />} />
      <Route path="/search-engines/private" component={() => <AuthProtectedRoute component={SearchEnginesGeneral} />} />
      <Route path="/search-engines/national" component={() => <AuthProtectedRoute component={SearchEnginesGeneral} />} />
      
      {/* Investigação Pessoas */}
      <Route path="/people/email" component={() => <AuthProtectedRoute component={PeopleEmail} />} />
      <Route path="/people/phone" component={() => <AuthProtectedRoute component={PeoplePhone} />} />
      <Route path="/people/username" component={() => <AuthProtectedRoute component={PeopleUsername} />} />
      <Route path="/people/general" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
      {/* Redes Sociais */}
      <Route path="/social/twitter" component={() => <AuthProtectedRoute component={SocialTwitter} />} />
      <Route path="/social/facebook" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/social/instagram" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/social/linkedin" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/social/reddit" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/social/telegram" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/social/github" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
      {/* Análise Técnica */}
      <Route path="/technical/domains" component={() => <AuthProtectedRoute component={TechnicalDomains} />} />
      <Route path="/technical/ip" component={() => <AuthProtectedRoute component={TechnicalIP} />} />
      <Route path="/technical/threat" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/technical/code" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/technical/advanced" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
      {/* Mídia & Conteúdo */}
      <Route path="/media/images" component={() => <AuthProtectedRoute component={MediaImages} />} />
      <Route path="/media/documents" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/media/monitoring" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/media/factcheck" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
      {/* Ferramentas Especiais */}
      <Route path="/special/darkweb" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/special/maritime" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/special/gaming" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
      {/* Histórico & Favoritos */}
      <Route path="/search-history" component={() => <AuthProtectedRoute component={SearchHistory} />} />
      <Route path="/bookmarks" component={() => <AuthProtectedRoute component={Bookmarks} />} />
      
      {/* Admin */}
      <Route path="/admin" component={() => <AuthProtectedRoute component={AdminPanel} />} />
      
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
