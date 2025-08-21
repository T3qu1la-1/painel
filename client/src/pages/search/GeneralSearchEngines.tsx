import { ExternalLink, Search, Shield, Globe, Eye, Zap, Activity } from "lucide-react";

interface SearchEngine {
  name: string;
  url: string;
  description: string;
  category: string;
  privacy: "high" | "medium" | "low";
  country?: string;
  verified: boolean;
}

const searchEngines: SearchEngine[] = [
  {
    name: "Google Search",
    url: "https://www.google.com",
    description: "O motor de busca mais popular do mundo com indexação abrangente",
    category: "General Search",
    privacy: "low",
    verified: true
  },
  {
    name: "Bing",
    url: "https://www.bing.com",
    description: "Motor de busca da Microsoft com recursos avançados",
    category: "General Search",
    privacy: "low",
    verified: true
  },
  {
    name: "DuckDuckGo",
    url: "https://duckduckgo.com",
    description: "Motor de busca focado em privacidade que não rastreia usuários",
    category: "Privacy-Focused",
    privacy: "high",
    verified: true
  },
  {
    name: "Startpage",
    url: "https://www.startpage.com",
    description: "Resultados do Google sem rastreamento",
    category: "Privacy-Focused",
    privacy: "high",
    verified: true
  },
  {
    name: "Searx",
    url: "https://searx.space",
    description: "Motor de busca de código aberto e auto-hospedado",
    category: "Open Source",
    privacy: "high",
    verified: true
  },
  {
    name: "Yandex",
    url: "https://yandex.com",
    description: "Motor de busca russo com forte presença no Leste Europeu",
    category: "Regional",
    privacy: "low",
    country: "Russia",
    verified: true
  },
  {
    name: "Baidu",
    url: "https://www.baidu.com",
    description: "Principal motor de busca chinês",
    category: "Regional",
    privacy: "low",
    country: "China",
    verified: true
  },
  {
    name: "Brave Search",
    url: "https://search.brave.com",
    description: "Motor de busca independente focado em privacidade",
    category: "Privacy-Focused",
    privacy: "high",
    verified: true
  },
  {
    name: "Wolfram Alpha",
    url: "https://www.wolframalpha.com",
    description: "Motor de busca computacional para consultas factuais",
    category: "Specialized",
    privacy: "medium",
    verified: true
  },
  {
    name: "YOU.com",
    url: "https://you.com",
    description: "Motor de busca AI-powered com recursos personalizados",
    category: "AI-Powered",
    privacy: "medium",
    verified: true
  },
  {
    name: "Mojeek",
    url: "https://www.mojeek.com",
    description: "Motor de busca independente com seu próprio crawler",
    category: "Independent",
    privacy: "high",
    verified: true
  },
  {
    name: "Swisscows",
    url: "https://swisscows.com",
    description: "Motor de busca suíço focado em privacidade e família",
    category: "Privacy-Focused",
    privacy: "high",
    country: "Switzerland",
    verified: true
  },
  {
    name: "Naver",
    url: "https://www.naver.com",
    description: "Principal motor de busca da Coreia do Sul",
    category: "Regional",
    privacy: "medium",
    country: "South Korea",
    verified: true
  },
  {
    name: "Yahoo! Search",
    url: "https://search.yahoo.com",
    description: "Motor de busca tradicional com portal de notícias",
    category: "General Search",
    privacy: "low",
    verified: true
  }
];

const categories = Array.from(new Set(searchEngines.map(engine => engine.category)));

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "General Search": return Search;
    case "Privacy-Focused": return Shield;
    case "Regional": return Globe;
    case "Open Source": return Eye;
    case "Specialized": return Activity;
    case "AI-Powered": return Zap;
    case "Independent": return Shield;
    default: return Search;
  }
};

const getPrivacyColor = (privacy: string) => {
  switch (privacy) {
    case "high": return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
    case "medium": return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
    case "low": return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
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
    "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700"
  ];
  return colors[Math.abs(category.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length];
};

export default function GeneralSearchEngines() {
  const privacyStats = {
    high: searchEngines.filter(e => e.privacy === "high").length,
    medium: searchEngines.filter(e => e.privacy === "medium").length,
    low: searchEngines.filter(e => e.privacy === "low").length
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Motores de Busca Gerais
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Coleção abrangente de motores de busca para pesquisa OSINT e investigação
          </p>
          
          {/* Privacy Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                    {privacyStats.high}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Alta Privacidade</div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-yellow-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
                    {privacyStats.medium}
                  </div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">Média Privacidade</div>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-red-800 dark:text-red-300">
                    {privacyStats.low}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">Baixa Privacidade</div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                    {categories.length}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Categorias</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Engines by Category */}
        {categories.map((category) => {
          const categoryEngines = searchEngines.filter(engine => engine.category === category);
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
                  {categoryEngines.length} engines
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryEngines.map((engine) => (
                  <a
                    key={engine.name}
                    href={engine.url}
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
                            {engine.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded ${getPrivacyColor(engine.privacy)}`}>
                              {engine.privacy.toUpperCase()} PRIVACY
                            </span>
                            {engine.country && (
                              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                                {engine.country}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {engine.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {category}
                      </span>
                      <div className="flex items-center">
                        <Zap className="w-3 h-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600 dark:text-green-400">
                          Ativo
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* OSINT Tips */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-700">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-6 flex items-center">
            <Search className="w-6 h-6 mr-2" />
            Dicas para OSINT com Motores de Busca
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
              <Shield className="w-8 h-8 text-green-500 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Use Múltiplos Engines</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Diferentes engines podem retornar resultados distintos. Compare Google, Bing e DuckDuckGo.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
              <Globe className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Engines Regionais</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use Yandex para conteúdo russo, Baidu para chinês e Naver para coreano.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
              <Eye className="w-8 h-8 text-purple-500 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Privacidade</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Para investigações sensíveis, use DuckDuckGo ou Startpage para evitar rastreamento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}