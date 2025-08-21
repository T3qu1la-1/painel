import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home,
  Mail,
  Globe,
  MapPin,
  Users,
  Phone,
  History,
  Bookmark,
  Download,
  Search,
  User,
  ExternalLink,
  Shield,
  Eye,
  Database,
  Network,
  Smartphone
} from "lucide-react";

const osintItems = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Email Lookup", path: "/email-lookup", icon: Mail },
  { name: "Domain Analysis", path: "/domain-analysis", icon: Globe },
  { name: "IP Geolocation", path: "/ip-geolocation", icon: MapPin },
  { name: "Social Media", path: "/social-media", icon: Users },
  { name: "Phone Lookup", path: "/phone-lookup", icon: Phone },
  { name: "Search History", path: "/search-history", icon: History },
  { name: "Bookmarks", path: "/bookmarks", icon: Bookmark },
];

// Motores de Busca
const searchEngines = [
  { name: "Google", url: "https://google.com", icon: Search },
  { name: "Bing", url: "https://bing.com", icon: Search },
  { name: "DuckDuckGo", url: "https://duckduckgo.com", icon: Shield },
  { name: "Yandex", url: "https://yandex.com", icon: Search },
  { name: "Baidu", url: "https://baidu.com", icon: Search },
  { name: "Startpage", url: "https://startpage.com", icon: Shield },
  { name: "Wolfram Alpha", url: "https://wolframalpha.com", icon: Search },
];

// Análise de Domínios e Redes
const domainNetworkTools = [
  { name: "Shodan", url: "https://shodan.io", icon: Database },
  { name: "Censys", url: "https://censys.io", icon: Database },
  { name: "Fofa", url: "https://fofa.so", icon: Database },
  { name: "Criminal IP", url: "https://criminalip.io", icon: Shield },
  { name: "VirusTotal", url: "https://virustotal.com", icon: Shield },
  { name: "AbuseIPDB", url: "https://abuseipdb.com", icon: Shield },
  { name: "DNSdumpster", url: "https://dnsdumpster.com", icon: Network },
  { name: "CRT.sh", url: "https://crt.sh", icon: Globe },
  { name: "Netlas", url: "https://netlas.io", icon: Database },
  { name: "BinaryEdge", url: "https://binaryedge.io", icon: Database },
];

// Redes Sociais
const socialMediaTools = [
  { name: "Sherlock", url: "https://sherlock-project.github.io/Sherlock", icon: Users },
  { name: "Whatsmyname", url: "https://whatsmyname.app", icon: Users },
  { name: "Social Searcher", url: "https://socialsearcher.com", icon: Users },
  { name: "Namechk", url: "https://namechk.com", icon: Users },
  { name: "IDCrawl", url: "https://idcrawl.com", icon: Users },
  { name: "Pipl", url: "https://pipl.com", icon: Users },
  { name: "ThatsThem", url: "https://thatsthem.com", icon: Users },
];

// Email e Telefone
const contactTools = [
  { name: "Have I Been Pwned", url: "https://haveibeenpwned.com", icon: Mail },
  { name: "Hunter.io", url: "https://hunter.io", icon: Mail },
  { name: "EmailRep", url: "https://emailrep.io", icon: Mail },
  { name: "Phoneinfoga", url: "https://phoneinfoga.crvx.fr", icon: Smartphone },
  { name: "TrueCaller", url: "https://truecaller.com", icon: Smartphone },
  { name: "Sync.me", url: "https://sync.me", icon: Smartphone },
];

// Documentos e Arquivos
const fileDocumentTools = [
  { name: "Internet Archive", url: "https://archive.org", icon: History },
  { name: "Wayback Machine", url: "https://web.archive.org", icon: History },
  { name: "LibGen", url: "https://libgen.rs", icon: Database },
  { name: "Scribd", url: "https://scribd.com", icon: Database },
  { name: "DocDroid", url: "https://docdroid.net", icon: Database },
  { name: "PDF Search", url: "https://pdfsearch.org", icon: Database },
];

// Geolocalização
const geoTools = [
  { name: "Google Earth", url: "https://earth.google.com", icon: MapPin },
  { name: "Bing Maps", url: "https://bing.com/maps", icon: MapPin },
  { name: "OpenStreetMap", url: "https://openstreetmap.org", icon: MapPin },
  { name: "Wikimapia", url: "https://wikimapia.org", icon: MapPin },
  { name: "Yandex Maps", url: "https://yandex.com/maps", icon: MapPin },
  { name: "What3Words", url: "https://what3words.com", icon: MapPin },
];

// Imagens e Mídia  
const imageMediaTools = [
  { name: "TinEye", url: "https://tineye.com", icon: Eye },
  { name: "Google Images", url: "https://images.google.com", icon: Eye },
  { name: "Yandex Images", url: "https://yandex.com/images", icon: Eye },
  { name: "Bing Images", url: "https://bing.com/images", icon: Eye },
  { name: "RevEye", url: "https://reveye.com", icon: Eye },
  { name: "Image Identify", url: "https://imageidentify.com", icon: Eye },
];

// Threat Intelligence
const threatIntelTools = [
  { name: "OTX AlienVault", url: "https://otx.alienvault.com", icon: Shield },
  { name: "VirusTotal", url: "https://virustotal.com", icon: Shield },
  { name: "Hybrid Analysis", url: "https://hybrid-analysis.com", icon: Shield },
  { name: "Malware Bazaar", url: "https://bazaar.abuse.ch", icon: Shield },
  { name: "URLVoid", url: "https://urlvoid.com", icon: Shield },
  { name: "PhishTank", url: "https://phishtank.org", icon: Shield },
];

// Ferramentas Técnicas
const technicalTools = [
  { name: "OSINT Framework", url: "https://osintframework.com", icon: Network },
  { name: "Maltego", url: "https://maltego.com", icon: Network },
  { name: "SpiderFoot", url: "https://spiderfoot.net", icon: Network },
  { name: "Recon-ng", url: "https://github.com/lanmaster53/recon-ng", icon: Network },
  { name: "theHarvester", url: "https://github.com/laramies/theHarvester", icon: Network },
  { name: "Amass", url: "https://github.com/OWASP/Amass", icon: Network },
];

// Dados Vazados e Breaches
const breachTools = [
  { name: "DeHashed", url: "https://dehashed.com", icon: Database },
  { name: "IntelX", url: "https://intelx.io", icon: Database },
  { name: "LeakCheck", url: "https://leakcheck.net", icon: Database },
  { name: "Snusbase", url: "https://snusbase.com", icon: Database },
];

// Dark Web
const darkWebTools = [
  { name: "Ahmia", url: "https://ahmia.fi", icon: Eye },
  { name: "DuckDuckGo Onion", url: "https://3g2upl4pq6kufc4m.onion", icon: Shield },
  { name: "OnionScan", url: "https://onionscan.org", icon: Network },
];

// Todas as categorias organizadas
const ferramentasUteis = [
  { category: "🔍 Motores de Busca", tools: searchEngines },
  { category: "🌐 Domínios & Redes", tools: domainNetworkTools },  
  { category: "👥 Redes Sociais", tools: socialMediaTools },
  { category: "📧 Email & Telefone", tools: contactTools },
  { category: "📄 Documentos & Arquivos", tools: fileDocumentTools },
  { category: "🗺️ Geolocalização", tools: geoTools },
  { category: "🖼️ Imagens & Mídia", tools: imageMediaTools },
  { category: "🛡️ Threat Intelligence", tools: threatIntelTools },
  { category: "⚙️ Ferramentas Técnicas", tools: technicalTools },
  { category: "💾 Dados Vazados", tools: breachTools },
  { category: "🕶️ Dark Web", tools: darkWebTools },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-gray-900 border-r border-gray-700">
        {/* Logo/Brand */}
        <div className="flex items-center h-16 px-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Search className="text-white" size={16} />
            </div>
            <span className="text-lg font-semibold text-gray-50">OSINT Panel</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-4">
          {/* OSINT Section */}
          <div className="space-y-2">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                OSINT
              </h3>
            </div>
            <div className="space-y-1">
              {osintItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <Link key={item.path} href={item.path}>
                    <div 
                      className={cn(
                        "osint-nav-item cursor-pointer",
                        isActive ? "osint-nav-item-active" : "osint-nav-item-inactive"
                      )}
                      data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Ferramentas Úteis Section */}
          <div className="space-y-4 border-t border-gray-700 pt-4">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                FERRAMENTAS ÚTEIS
              </h3>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto space-y-3">
              {ferramentasUteis.map((category) => (
                <div key={category.category} className="space-y-1">
                  <div className="px-3 py-1">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {category.category}
                    </h4>
                  </div>
                  <div className="space-y-1">
                    {category.tools.map((tool) => {
                      const Icon = tool.icon;
                      
                      return (
                        <a 
                          key={tool.name} 
                          href={tool.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <div 
                            className="osint-nav-item cursor-pointer osint-nav-item-inactive hover:bg-gray-700 transition-colors text-sm py-2"
                            data-testid={`external-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{tool.name}</span>
                            <ExternalLink className="w-3 h-3 ml-auto text-gray-500 flex-shrink-0" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="text-gray-300" size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-50" data-testid="user-name">Investigator</p>
              <p className="text-xs text-gray-400" data-testid="user-role">OSINT Analyst</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
