import { ExternalLink, Shield, Activity, Database, AlertTriangle, Eye, Zap, Search } from "lucide-react";

interface Tool {
  name: string;
  url: string;
  description: string;
  category: string;
  verified: boolean;
  free: boolean;
}

const threatIntelTools: Tool[] = [
  {
    name: "VirusTotal",
    url: "https://www.virustotal.com",
    description: "Analisa arquivos e URLs com mais de 70 engines antivírus",
    category: "File & URL Analysis",
    verified: true,
    free: true
  },
  {
    name: "OTX AlienVault",
    url: "https://otx.alienvault.com",
    description: "Plataforma de threat intelligence colaborativa da AT&T",
    category: "Threat Intelligence",
    verified: true,
    free: true
  },
  {
    name: "Hybrid Analysis",
    url: "https://www.hybrid-analysis.com",
    description: "Sandboxing e análise de malware gratuita",
    category: "Malware Analysis",
    verified: true,
    free: true
  },
  {
    name: "Malware Bazaar",
    url: "https://bazaar.abuse.ch",
    description: "Base de dados de samples de malware da Abuse.ch",
    category: "Malware Analysis",
    verified: true,
    free: true
  },
  {
    name: "URLVoid",
    url: "https://www.urlvoid.com",
    description: "Verifica reputação de URLs com múltiplos scanners",
    category: "URL Reputation",
    verified: true,
    free: true
  },
  {
    name: "PhishTank",
    url: "https://www.phishtank.com",
    description: "Base de dados colaborativa de sites de phishing",
    category: "Phishing Detection",
    verified: true,
    free: true
  },
  {
    name: "Abuse.ch",
    url: "https://abuse.ch",
    description: "Rastreia malware, botnets e indicações de comprometimento",
    category: "Threat Intelligence",
    verified: true,
    free: true
  },
  {
    name: "Shodan",
    url: "https://www.shodan.io",
    description: "Motor de busca para dispositivos conectados à internet",
    category: "Network Intelligence",
    verified: true,
    free: false
  },
  {
    name: "Censys",
    url: "https://censys.io",
    description: "Motor de busca para hosts e certificados na internet",
    category: "Network Intelligence",
    verified: true,
    free: false
  },
  {
    name: "Greynoise",
    url: "https://www.greynoise.io",
    description: "Classifica tráfego de internet como benigno ou malicioso",
    category: "Network Intelligence",
    verified: true,
    free: false
  },
  {
    name: "IPQualityScore",
    url: "https://www.ipqualityscore.com",
    description: "API para detecção de fraude e scoring de reputação IP",
    category: "IP Reputation",
    verified: true,
    free: false
  },
  {
    name: "ThreatMiner",
    url: "https://www.threatminer.org",
    description: "Motor de busca para artifacts relacionados a APT e malware",
    category: "Threat Intelligence",
    verified: true,
    free: true
  }
];

const categories = Array.from(new Set(threatIntelTools.map(tool => tool.category)));

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "File & URL Analysis": return Search;
    case "Threat Intelligence": return Shield;
    case "Malware Analysis": return AlertTriangle;
    case "URL Reputation": return Eye;
    case "Phishing Detection": return Shield;
    case "Network Intelligence": return Database;
    case "IP Reputation": return Activity;
    default: return Shield;
  }
};

const getCategoryColor = (category: string) => {
  const colors = [
    "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700",
    "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700",
    "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700",
    "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700",
    "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700",
    "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700",
    "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700"
  ];
  return colors[Math.abs(category.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length];
};

export default function ThreatIntelligence() {
  const freeTools = threatIntelTools.filter(t => t.free);
  const paidTools = threatIntelTools.filter(t => !t.free);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Threat Intelligence
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Ferramentas especializadas para análise de ameaças, malware e intelligence de segurança
          </p>
          
          {/* Stats Overview */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                    {freeTools.length}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Gratuitas</div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center">
                <Database className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                    {paidTools.length}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Premium</div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-purple-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                    {categories.length}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Categorias</div>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-red-800 dark:text-red-300">
                    24/7
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">Monitoramento</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools by Category */}
        {categories.map((category) => {
          const categoryTools = threatIntelTools.filter(tool => tool.category === category);
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
                {categoryTools.map((tool) => (
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
                            <span className={`text-xs px-2 py-1 rounded ${tool.free ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'}`}>
                              {tool.free ? 'GRATUITO' : 'PREMIUM'}
                            </span>
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
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Security Best Practices */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-8 border border-red-200 dark:border-red-700">
          <h3 className="text-xl font-semibold text-red-900 dark:text-red-300 mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2" />
            Melhores Práticas em Threat Intelligence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
              <Shield className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">IOCs Validation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Sempre validar Indicators of Compromise com múltiplas fontes antes de tomar ações
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
              <Database className="w-8 h-8 text-green-500 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Context Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Analisar o contexto completo da ameaça, incluindo TTPs e atribuição
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
              <Activity className="w-8 h-8 text-purple-500 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Continuous Monitoring</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Implementar monitoramento contínuo para detectar evolução de ameaças
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}