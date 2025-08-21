import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
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

// New OSINT Category Pages
import EmailOSINT from "@/pages/people/EmailOSINT";
import UsernameCheck from "@/pages/people/UsernameCheck";
import TwitterOSINT from "@/pages/social/TwitterOSINT";
import DomainsAndDNS from "@/pages/technical/DomainsAndDNS";
import ThreatIntelligence from "@/pages/technical/ThreatIntelligence";
import GeneralSearchEngines from "@/pages/search/GeneralSearchEngines";

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

  return <Component />;
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
      
      {/* New Hierarchical OSINT Routes */}
      
      {/* People Investigation */}
      <Route path="/people/email" component={() => <AuthProtectedRoute component={EmailOSINT} />} />
      <Route path="/people/phone" component={() => <AuthProtectedRoute component={PhoneLookup} />} />
      <Route path="/people/username" component={() => <AuthProtectedRoute component={UsernameCheck} />} />
      <Route path="/people/general" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
      {/* Social Media */}
      <Route path="/social/twitter" component={() => <AuthProtectedRoute component={TwitterOSINT} />} />
      <Route path="/social/facebook" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/social/instagram" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/social/linkedin" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/social/reddit" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/social/telegram" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/social/github" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
      {/* Technical Analysis */}
      <Route path="/technical/domains" component={() => <AuthProtectedRoute component={DomainsAndDNS} />} />
      <Route path="/technical/ip" component={() => <AuthProtectedRoute component={IPGeolocation} />} />
      <Route path="/technical/threat" component={() => <AuthProtectedRoute component={ThreatIntelligence} />} />
      <Route path="/technical/code" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/technical/advanced" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
      {/* Search Engines */}
      <Route path="/search-engines/general" component={() => <AuthProtectedRoute component={GeneralSearchEngines} />} />
      <Route path="/search-engines/specialty" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/search-engines/private" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/search-engines/national" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
      {/* Media & Content */}
      <Route path="/media/images" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/media/documents" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/media/monitoring" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/media/factcheck" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
      {/* Special Tools */}
      <Route path="/special/darkweb" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/special/maritime" component={() => <AuthProtectedRoute component={Dashboard} />} />
      <Route path="/special/gaming" component={() => <AuthProtectedRoute component={Dashboard} />} />
      
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
