import { ExternalLink, Globe, Network, Database, Shield, Search, Activity, Code, Terminal } from "lucide-react";

interface Tool {
  name: string;
  url: string;
  description: string;
  category: string;
  verified: boolean;
  type: "web" | "cli" | "api";
}

const domainTools: Tool[] = [
  {
    name: "DNS Dumpster",
    url: "https://dnsdumpster.com",
    description: "Ferramenta web gratuita para reconnaissance de DNS",
    category: "DNS Enumeration",
    verified: true,
    type: "web"
  },
  {
    name: "CRT.sh",
    url: "https://crt.sh",
    description: "Base de dados de certificados SSL para descoberta de subdomínios",
    category: "Certificate Search",
    verified: true,
    type: "web"
  },
  {
    name: "Amass",
    url: "https://github.com/OWASP/Amass",
    description: "Ferramenta OWASP para mapeamento de superfície de ataque",
    category: "Subdomain Enumeration",
    verified: true,
    type: "cli"
  },
  {
    name: "Subfinder",
    url: "https://github.com/projectdiscovery/subfinder",
    description: "Ferramenta rápida de descoberta de subdomínios passiva",
    category: "Subdomain Enumeration", 
    verified: true,
    type: "cli"
  },
  {
    name: "AQUATONE",
    url: "https://github.com/michenriksen/aquatone",
    description: "Ferramenta para reconnaissance visual de websites",
    category: "Web Reconnaissance",
    verified: true,
    type: "cli"
  },
  {
    name: "Sublist3r",
    url: "https://github.com/aboul3la/Sublist3r",
    description: "Enumera subdomínios usando múltiplas fontes OSINT",
    category: "Subdomain Enumeration",
    verified: true,
    type: "cli"
  },
  {
    name: "Knock",
    url: "https://github.com/guelfoweb/knock",
    description: "Enumera subdomínios em um domínio alvo",
    category: "Subdomain Enumeration",
    verified: true,
    type: "cli"
  },
  {
    name: "Fierce",
    url: "https://github.com/mschwager/fierce",
    description: "Scanner de DNS para localizar hosts não contíguos IP",
    category: "DNS Scanning",
    verified: true,
    type: "cli"
  },
  {
    name: "dnsrecon",
    url: "https://github.com/darkoperator/dnsrecon",
    description: "Ferramenta de reconnaissance DNS completa",
    category: "DNS Scanning",
    verified: true,
    type: "cli"
  },
  {
    name: "DNSEnum",
    url: "https://github.com/fwaeytens/dnsenum",
    description: "Script Perl para enumeração de informações DNS",
    category: "DNS Scanning",
    verified: true,
    type: "cli"
  },
  {
    name: "SecurityTrails",
    url: "https://securitytrails.com",
    description: "API e web interface para historical DNS data",
    category: "DNS Intelligence",
    verified: true,
    type: "web"
  },
  {
    name: "VirusTotal",
    url: "https://www.virustotal.com",
    description: "Análise de domínios e URLs com múltiplos engines",
    category: "Domain Analysis",
    verified: true,
    type: "web"
  }
];

const categories = Array.from(new Set(domainTools.map(tool => tool.category)));

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "DNS Enumeration": return Network;
    case "Certificate Search": return Shield;
    case "Subdomain Enumeration": return Search;
    case "Web Reconnaissance": return Globe;
    case "DNS Scanning": return Activity;
    case "DNS Intelligence": return Database;
    case "Domain Analysis": return Globe;
    default: return Network;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "web": return Globe;
    case "cli": return Terminal;
    case "api": return Code;
    default: return Globe;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "web": return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
    case "cli": return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
    case "api": return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300";
    default: return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300";
  }
};

const getCategoryColor = (category: string) => {
  const colors = [
    "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700",
    "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700",
    "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700",
    "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700",
    "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700",
    "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700",
    "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
  ];
  return colors[Math.abs(category.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length];
};

export default function DomainsAndDNS() {
  const webTools = domainTools.filter(t => t.type === "web");
  const cliTools = domainTools.filter(t => t.type === "cli");
  const apiTools = domainTools.filter(t => t.type === "api");
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <Network className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Domains & DNS OSINT
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Ferramentas para análise de domínios, DNS reconnaissance e descoberta de subdomínios
          </p>
          
          {/* Tool Type Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                    {webTools.length}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Web Tools</div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center">
                <Terminal className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                    {cliTools.length}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">CLI Tools</div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="flex items-center">
                <Database className="w-5 h-5 text-purple-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                    {categories.length}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Categorias</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools by Category */}
        {categories.map((category) => {
          const categoryTools = domainTools.filter(tool => tool.category === category);
          const CategoryIcon = getCategoryIcon(category);
          const categoryColor = getCategoryColor(category);
          
          return (
            <div key={category} className="mb-10">
              <div className="flex items-center mb-6">
                <CategoryIcon className="w-6 h-6 text-gray-700 dark:text-gray-300 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {category}
                </h2>
                <span className="ml-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                  {categoryTools.length} ferramentas
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => {
                  const TypeIcon = getTypeIcon(tool.type);
                  const typeColor = getTypeColor(tool.type);
                  
                  return (
                    <a
                      key={tool.name}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block p-6 rounded-xl border-2 ${categoryColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm mr-4 group-hover:shadow-md transition-shadow">
                            <CategoryIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {tool.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded flex items-center ${typeColor}`}>
                                <TypeIcon className="w-3 h-3 mr-1" />
                                {tool.type.toUpperCase()}
                              </span>
                              {tool.url.includes('github.com') && (
                                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                                  Open Source
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {tool.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {category}
                        </span>
                        <div className="flex items-center">
                          <Shield className="w-3 h-3 text-green-500 mr-1" />
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Verificado
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {/* Usage Guide */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-700">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-2" />
            Guia de Uso para DNS OSINT
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
              <Globe className="w-8 h-8 text-green-500 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Web Tools</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Ideais para começar. Não requerem instalação.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• DNS Dumpster: Reconhecimento visual</li>
                <li>• CRT.sh: Busca por certificados</li>
                <li>• VirusTotal: Análise completa</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
              <Terminal className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">CLI Tools</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Para investigações avançadas e automação.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Amass: Mais completo (OWASP)</li>
                <li>• Subfinder: Mais rápido</li>
                <li>• Sublist3r: Mais simples</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
              <Activity className="w-8 h-8 text-purple-500 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Workflow</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Ordem recomendada de investigação:
              </p>
              <ol className="text-xs text-gray-500 dark:text-gray-400 space-y-1 list-decimal list-inside">
                <li>Enumeração passiva (CRT.sh)</li>
                <li>DNS enumeration (Amass)</li>
                <li>Verificação visual (AQUATONE)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}