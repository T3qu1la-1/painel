import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import EmailLookup from "@/pages/email-lookup";
import DomainAnalysis from "@/pages/domain-analysis";
import IPGeolocation from "@/pages/ip-geolocation";
import SocialMedia from "@/pages/social-media";
import PhoneLookup from "@/pages/phone-lookup";
import SearchHistory from "@/pages/search-history";
import Bookmarks from "@/pages/bookmarks";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/email-lookup" component={EmailLookup} />
      <Route path="/domain-analysis" component={DomainAnalysis} />
      <Route path="/ip-geolocation" component={IPGeolocation} />
      <Route path="/social-media" component={SocialMedia} />
      <Route path="/phone-lookup" component={PhoneLookup} />
      <Route path="/search-history" component={SearchHistory} />
      <Route path="/bookmarks" component={Bookmarks} />
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
