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

// Motores de Busca Gerais  
const searchEngines = [
  { name: "Google Search", url: "https://www.google.com", icon: Search },
  { name: "Bing", url: "https://www.bing.com", icon: Search },
  { name: "DuckDuckGo", url: "https://duckduckgo.com", icon: Shield },
  { name: "Yandex", url: "https://yandex.com", icon: Search },
  { name: "Baidu", url: "https://www.baidu.com", icon: Search },
  { name: "Yahoo! Search", url: "https://www.yahoo.com", icon: Search },
  { name: "Ask", url: "https://www.ask.com", icon: Search },
  { name: "AOL", url: "https://search.aol.com", icon: Search },
  { name: "Brave Search", url: "https://search.brave.com", icon: Shield },
  { name: "Wolfram Alpha", url: "https://www.wolframalpha.com", icon: Search },
  { name: "YOU.com", url: "https://you.com", icon: Search },
  { name: "Mojeek", url: "https://www.mojeek.com", icon: Shield },
  { name: "Lycos", url: "https://www.lycos.com", icon: Search },
  { name: "Search.com", url: "https://www.search.com", icon: Search },
];

// Motores de Busca Especializados
const specialtySearchEngines = [
  { name: "Shodan", url: "https://www.shodan.io", icon: Database },
  { name: "Censys", url: "https://censys.io", icon: Database },
  { name: "Criminal IP", url: "https://www.criminalip.io", icon: Shield },
  { name: "Fofa", url: "https://fofa.so", icon: Database },
  { name: "Netlas.io", url: "https://netlas.io", icon: Database },
  { name: "BinaryEdge", url: "https://www.binaryedge.io", icon: Database },
  { name: "GrayhatWarfare", url: "https://grayhatwarfare.com", icon: Database },
  { name: "Intelligence X", url: "https://intelx.io", icon: Database },
  { name: "ODIN", url: "https://odin.osint.info", icon: Shield },
  { name: "BeVigil", url: "https://bevigil.com", icon: Smartphone },
];

// Verificação de Username
const usernameCheckTools = [
  { name: "Sherlock", url: "https://github.com/sherlock-project/sherlock", icon: Users },
  { name: "WhatsMyName", url: "https://whatsmyname.app", icon: Users },
  { name: "NameChk", url: "https://namechk.com", icon: Users },
  { name: "Blackbird", url: "https://github.com/p1ngul1n0/blackbird", icon: Users },
  { name: "Maigret", url: "https://github.com/soxoj/maigret", icon: Users },
  { name: "Social Analyzer", url: "https://github.com/qeeqbox/social-analyzer", icon: Users },
  { name: "IDCrawl", url: "https://www.idcrawl.com", icon: Users },
  { name: "CheckUsernames", url: "https://checkusernames.com", icon: Users },
  { name: "Name Checkup", url: "https://namecheckup.com", icon: Users },
  { name: "Instant Username Search", url: "https://instantusername.com", icon: Users },
];

// Twitter/X OSINT
const twitterTools = [
  { name: "Twitter Advanced Search", url: "https://twitter.com/search-advanced", icon: Users },
  { name: "TweetDeck", url: "https://tweetdeck.twitter.com", icon: Users },
  { name: "TweetMap", url: "https://www.omnisci.com/demos/tweetmap", icon: MapPin },
  { name: "OneMillionTweetMap", url: "https://onemilliontweetmap.com", icon: MapPin },
  { name: "Trends24", url: "https://trends24.in", icon: Users },
  { name: "Twitter Audit", url: "https://www.twitteraudit.com", icon: Users },
  { name: "Foller.me", url: "https://foller.me", icon: Users },
  { name: "ExportData", url: "https://www.exportdata.io", icon: Users },
  { name: "Sentiment140", url: "http://www.sentiment140.com", icon: Users },
];

// Facebook OSINT
const facebookTools = [
  { name: "Facebook Search", url: "https://www.facebook.com/search/top", icon: Users },
  { name: "Facebook Friend List Scraper", url: "https://github.com/davidtavarez/facebook-scraper", icon: Users },
  { name: "Find my Facebook ID", url: "https://findmyfbid.com", icon: Users },
  { name: "Lookup-ID.com", url: "https://lookup-id.com", icon: Users },
  { name: "Fanpage Karma", url: "https://www.fanpagekarma.com", icon: Users },
];

// Instagram OSINT
const instagramTools = [
  { name: "Osintgram", url: "https://github.com/Datalux/Osintgram", icon: Users },
  { name: "Iconosquare", url: "https://pro.iconosquare.com", icon: Users },
  { name: "Sterra", url: "https://github.com/novitae/sterraxcyl", icon: Users },
  { name: "Toutatis", url: "https://github.com/megadose/toutatis", icon: Users },
  { name: "Instagram Monitor", url: "https://github.com/misiektoja/instagram_monitor", icon: Users },
];

// Reddit OSINT
const redditTools = [
  { name: "Reddit User Analyser", url: "https://reddit-user-analyser.netlify.app", icon: Users },
  { name: "RedditMetis", url: "https://redditmetis.com", icon: Users },
  { name: "Reddit Comment Search", url: "https://redditcommentsearch.com", icon: Search },
  { name: "Reddit Comment Lookup", url: "https://www.redditcomments.com", icon: Search },
  { name: "Pushshift", url: "https://pushshift.io", icon: Database },
  { name: "Pullpush", url: "https://pullpush.io", icon: Database },
];

// LinkedIn OSINT
const linkedinTools = [
  { name: "The-Endorser", url: "https://github.com/eth0izzle/the-endorser", icon: Users },
  { name: "LinkedInDumper", url: "https://github.com/l4rm4nd/LinkedInDumper", icon: Users },
  { name: "CrossLinked", url: "https://github.com/m8r0wn/crosslinked", icon: Users },
  { name: "LinkedIn2Username", url: "https://github.com/initstring/linkedin2username", icon: Users },
];

// Telegram OSINT
const telegramTools = [
  { name: "Telegram Nearby Map", url: "https://github.com/tejado/telegram-nearby-map", icon: MapPin },
  { name: "Telegram History Dump", url: "https://github.com/tvdstaaij/telegram-history-dump", icon: Database },
  { name: "TelegramDB", url: "https://telegramdb.org", icon: Database },
  { name: "Lyzem.com", url: "https://lyzem.com", icon: Users },
  { name: "Combot", url: "https://combot.org", icon: Users },
  { name: "Tlgrm.eu", url: "https://tlgrm.eu", icon: Search },
  { name: "TGStat", url: "https://tgstat.ru", icon: Database },
];

// GitHub OSINT
const githubTools = [
  { name: "GitRecon", url: "https://github.com/GONZOsint/gitrecon", icon: Users },
  { name: "Glit", url: "https://github.com/shadawck/glit", icon: Mail },
  { name: "TruffleHog", url: "https://github.com/trufflesecurity/truffleHog", icon: Shield },
  { name: "GitGuardian", url: "https://gitguardian.com", icon: Shield },
  { name: "Zen", url: "https://github.com/s0md3v/Zen", icon: Users },
];

// Email OSINT
const emailTools = [
  { name: "Have I Been Pwned", url: "https://haveibeenpwned.com", icon: Mail },
  { name: "Hunter.io", url: "https://hunter.io", icon: Mail },
  { name: "EmailRep", url: "https://emailrep.io", icon: Mail },
  { name: "DeHashed", url: "https://dehashed.com", icon: Database },
  { name: "LeakCheck", url: "https://leakcheck.net", icon: Database },
  { name: "Snusbase", url: "https://snusbase.com", icon: Database },
  { name: "h8mail", url: "https://github.com/khast3x/h8mail", icon: Mail },
  { name: "Holehe", url: "https://github.com/megadose/holehe", icon: Mail },
  { name: "theHarvester", url: "https://github.com/laramies/theHarvester", icon: Mail },
];

// Telefone OSINT  
const phoneTools = [
  { name: "Phoneinfoga", url: "https://github.com/sundowndev/phoneinfoga", icon: Smartphone },
  { name: "TrueCaller", url: "https://www.truecaller.com", icon: Smartphone },
  { name: "WhoCalled", url: "https://whocalled.us", icon: Smartphone },
  { name: "Reverse Phone Lookup", url: "https://www.reversephonelookup.com", icon: Smartphone },
  { name: "NumberGuru", url: "https://www.numberguru.com", icon: Smartphone },
  { name: "CallerIDTest", url: "https://calleridtest.com", icon: Smartphone },
  { name: "Sync.me", url: "https://sync.me", icon: Smartphone },
];

// Investigação de Pessoas
const peopleInvestigationTools = [
  { name: "PeekYou", url: "https://www.peekyou.com", icon: Users },
  { name: "Pipl", url: "https://pipl.com", icon: Users },
  { name: "ThatsThem", url: "https://thatsthem.com", icon: Users },
  { name: "BeenVerified", url: "https://www.beenverified.com", icon: Users },
  { name: "Spokeo", url: "https://www.spokeo.com", icon: Users },
  { name: "Radaris", url: "https://radaris.com", icon: Users },
  { name: "FamilyTreeNow", url: "https://www.familytreenow.com", icon: Users },
  { name: "WhitePages", url: "https://www.whitepages.com", icon: Users },
  { name: "411", url: "https://www.411.com", icon: Users },
];

// Análise de Domínios & DNS
const domainDNSTools = [
  { name: "DNS Dumpster", url: "https://dnsdumpster.com", icon: Network },
  { name: "CRT.sh", url: "https://crt.sh", icon: Globe },
  { name: "Amass", url: "https://github.com/OWASP/Amass", icon: Network },
  { name: "Subfinder", url: "https://github.com/projectdiscovery/subfinder", icon: Network },
  { name: "AQUATONE", url: "https://github.com/michenriksen/aquatone", icon: Network },
  { name: "Sublist3r", url: "https://github.com/aboul3la/Sublist3r", icon: Network },
  { name: "Knock", url: "https://github.com/guelfoweb/knock", icon: Network },
  { name: "Fierce", url: "https://github.com/mschwager/fierce", icon: Network },
];

// Pastebins
const pastebinTools = [
  { name: "Pastebin", url: "https://pastebin.com", icon: Database },
  { name: "GitHub Gist", url: "https://gist.github.com", icon: Database },
  { name: "Hastebin", url: "https://hastebin.com", icon: Database },
  { name: "Dpaste", url: "https://dpaste.org", icon: Database },
  { name: "0bin", url: "https://0bin.net", icon: Database },
  { name: "Ghostbin", url: "https://ghostbin.co", icon: Database },
  { name: "ControlC", url: "https://controlc.com", icon: Database },
  { name: "Rentry", url: "https://rentry.co", icon: Database },
];

// Busca de Código
const codeSearchTools = [
  { name: "SourceGraph", url: "https://sourcegraph.com", icon: Search },
  { name: "grep.app", url: "https://grep.app", icon: Search },
  { name: "SearchCode", url: "https://searchcode.com", icon: Search },
  { name: "PublicWWW", url: "https://publicwww.com", icon: Search },
  { name: "NerdyData", url: "https://nerdydata.com", icon: Search },
  { name: "Code Finder", url: "https://codefinder.org", icon: Search },
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

// Ferramentas OSINT Avançadas
const advancedOSINTTools = [
  { name: "SpiderFoot", url: "https://www.spiderfoot.net", icon: Network },
  { name: "Maltego", url: "https://www.maltego.com", icon: Network },
  { name: "Recon-ng", url: "https://github.com/lanmaster53/recon-ng", icon: Network },
  { name: "sn0int", url: "https://github.com/kpcyrd/sn0int", icon: Network },
  { name: "LinkScope", url: "https://github.com/AccentuSoft/LinkScope_Client", icon: Network },
  { name: "Hunchly", url: "https://www.hunchly.com", icon: Network },
  { name: "Photon", url: "https://github.com/s0md3v/Photon", icon: Network },
  { name: "OSINT Framework", url: "https://osintframework.com", icon: Network },
];

// Web Monitoring
const webMonitoringTools = [
  { name: "Google Alerts", url: "https://www.google.com/alerts", icon: Search },
  { name: "Mention", url: "https://mention.com", icon: Search },
  { name: "Talkwalker", url: "https://www.talkwalker.com", icon: Search },
  { name: "ChangeDetection.io", url: "https://changedetection.io", icon: Search },
  { name: "Visualping", url: "https://visualping.io", icon: Search },
  { name: "FollowThatPage", url: "https://www.followthatpage.com", icon: Search },
];

// Dark Web
const darkWebTools = [
  { name: "Ahmia", url: "https://ahmia.fi", icon: Eye },
  { name: "DuckDuckGo Onion", url: "https://3g2upl4pq6kufc4m.onion", icon: Shield },
  { name: "OnionScan", url: "https://onionscan.org", icon: Network },
  { name: "Tor66", url: "http://tor66sewebgixwhcqfnp5inzp5x5uohhdy3kvtnyfxc2e5mxiuh34iid.onion", icon: Eye },
  { name: "DarkSearch", url: "https://darksearch.io", icon: Eye },
  { name: "Onion.live", url: "https://onion.live", icon: Eye },
];

// Maritime OSINT
const maritimeTools = [
  { name: "VesselFinder", url: "https://www.vesselfinder.com", icon: MapPin },
  { name: "MarineTraffic", url: "https://www.marinetraffic.com", icon: MapPin },
  { name: "FleetMon", url: "https://www.fleetmon.com", icon: MapPin },
  { name: "ShipSpotting", url: "https://www.shipspotting.com", icon: MapPin },
];

// Fact Checking
const factCheckingTools = [
  { name: "Snopes", url: "https://www.snopes.com", icon: Shield },
  { name: "FactCheck.org", url: "https://www.factcheck.org", icon: Shield },
  { name: "PolitiFact", url: "https://www.politifact.com", icon: Shield },
  { name: "Full Fact", url: "https://fullfact.org", icon: Shield },
  { name: "Check", url: "https://meedan.com/check", icon: Shield },
  { name: "Captain Fact", url: "https://captainfact.io", icon: Shield },
];

// Gaming Platform OSINT
const gamingPlatformTools = [
  { name: "Steam Monitor", url: "https://github.com/misiektoja/steam_monitor", icon: Users },
  { name: "PSN Monitor", url: "https://github.com/misiektoja/psn_monitor", icon: Users },
  { name: "Xbox Monitor", url: "https://github.com/misiektoja/xbox_monitor", icon: Users },
];

// Todas as categorias organizadas com centenas de ferramentas OSINT
const ferramentasUteis = [
  { category: "🔍 Motores de Busca Gerais", tools: searchEngines },
  { category: "🔍 Motores Especializados", tools: specialtySearchEngines },
  { category: "👤 Verificação Username", tools: usernameCheckTools },
  { category: "📧 Email OSINT", tools: emailTools },
  { category: "📱 Telefone OSINT", tools: phoneTools },
  { category: "🐦 Twitter/X", tools: twitterTools },
  { category: "👥 Facebook", tools: facebookTools },
  { category: "📷 Instagram", tools: instagramTools },
  { category: "🤖 Reddit", tools: redditTools },
  { category: "💼 LinkedIn", tools: linkedinTools },
  { category: "📱 Telegram", tools: telegramTools },
  { category: "🐙 GitHub", tools: githubTools },
  { category: "🧑 Investigação Pessoas", tools: peopleInvestigationTools },
  { category: "🌐 Domínios & DNS", tools: domainDNSTools },
  { category: "📋 Pastebins", tools: pastebinTools },
  { category: "💻 Busca de Código", tools: codeSearchTools },
  { category: "📄 Documentos & Arquivos", tools: fileDocumentTools },
  { category: "🗺️ Geolocalização", tools: geoTools },
  { category: "🖼️ Imagens & Mídia", tools: imageMediaTools },
  { category: "🛡️ Threat Intelligence", tools: threatIntelTools },
  { category: "⚙️ OSINT Avançado", tools: advancedOSINTTools },
  { category: "👁️ Web Monitoring", tools: webMonitoringTools },
  { category: "🕶️ Dark Web", tools: darkWebTools },
  { category: "⚓ Maritime OSINT", tools: maritimeTools },
  { category: "✅ Fact Checking", tools: factCheckingTools },
  { category: "🎮 Gaming Platforms", tools: gamingPlatformTools },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-80 bg-gray-800 text-white flex flex-col h-full">
      {/* Logo/Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">OSINT Panel</h1>
        <p className="text-sm text-gray-400">Intelligence Gathering Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4">
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
                        isActive ? "osint-nav-item-active" : "osint-nav-item-inactive hover:bg-gray-700"
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

          {/* Ferramentas Úteis Section com centenas de ferramentas do awesome-osint */}
          <div className="space-y-4 border-t border-gray-700 pt-4 mt-4">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                FERRAMENTAS ÚTEIS
                <span className="text-xs text-gray-500 ml-2">(500+ Tools)</span>
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
        </div>
      </nav>

      {/* User Profile */}
      <div className="flex-shrink-0 p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-300" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">OSINT Investigator</p>
            <p className="text-xs text-gray-400">Professional Edition</p>
          </div>
        </div>
      </div>
    </aside>
  );
}