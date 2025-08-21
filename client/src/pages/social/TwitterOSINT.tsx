import { ExternalLink, Users, MapPin, Activity, Search, BarChart3, Eye, Zap } from "lucide-react";

interface Tool {
  name: string;
  url: string;
  description: string;
  category: string;
  verified: boolean;
  features?: string[];
}

const twitterTools: Tool[] = [
  {
    name: "Twitter Advanced Search",
    url: "https://twitter.com/search-advanced",
    description: "Ferramenta oficial do Twitter para buscas avançadas com filtros detalhados",
    category: "Search & Discovery",
    verified: true,
    features: ["Busca por data", "Localização", "Idioma", "Sentimento"]
  },
  {
    name: "TweetDeck",
    url: "https://tweetdeck.twitter.com",
    description: "Dashboard oficial para monitoramento em tempo real do Twitter",
    category: "Monitoring",
    verified: true,
    features: ["Múltiplas colunas", "Tempo real", "Filtros", "Agendamento"]
  },
  {
    name: "TweetMap",
    url: "https://www.omnisci.com/demos/tweetmap",
    description: "Visualização de tweets em mapa mundial em tempo real",
    category: "Geolocation",
    verified: true,
    features: ["Mapa mundial", "Tempo real", "Filtros de localização"]
  },
  {
    name: "OneMillionTweetMap",
    url: "https://onemilliontweetmap.com",
    description: "Mapa interativo mostrando localização de tweets geotagged",
    category: "Geolocation",
    verified: true,
    features: ["Geolocalização", "Mapa interativo", "Histórico"]
  },
  {
    name: "Trends24",
    url: "https://trends24.in",
    description: "Trending topics do Twitter por país e cidade",
    category: "Analytics",
    verified: true,
    features: ["Trends por país", "Histórico", "Comparações"]
  },
  {
    name: "Twitter Audit",
    url: "https://www.twitteraudit.com",
    description: "Analisa followers de uma conta para detectar bots e contas falsas",
    category: "Analytics",
    verified: true,
    features: ["Detecção de bots", "Análise de followers", "Relatórios"]
  },
  {
    name: "Foller.me",
    url: "https://foller.me",
    description: "Análise detalhada de perfis do Twitter com estatísticas avançadas",
    category: "Profile Analysis",
    verified: true,
    features: ["Estatísticas detalhadas", "Análise de conteúdo", "Comparações"]
  },
  {
    name: "ExportData",
    url: "https://www.exportdata.io",
    description: "Exporta dados do Twitter incluindo tweets, followers e analytics",
    category: "Data Export",
    verified: true,
    features: ["Export tweets", "Export followers", "Formatos múltiplos"]
  },
  {
    name: "Sentiment140",
    url: "http://www.sentiment140.com",
    description: "Análise de sentimento de tweets usando machine learning",
    category: "Analytics",
    verified: true,
    features: ["Análise de sentimento", "Machine learning", "API"]
  }
];

const categories = Array.from(new Set(twitterTools.map(tool => tool.category)));

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Search & Discovery": return Search;
    case "Monitoring": return Eye;
    case "Geolocation": return MapPin;
    case "Analytics": return BarChart3;
    case "Profile Analysis": return Users;
    case "Data Export": return Activity;
    default: return Users;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Search & Discovery": return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700";
    case "Monitoring": return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700";
    case "Geolocation": return "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700";
    case "Analytics": return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700";
    case "Profile Analysis": return "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700";
    case "Data Export": return "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700";
    default: return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700";
  }
};

export default function TwitterOSINT() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Twitter/X OSINT
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Ferramentas especializadas para investigação e análise no Twitter/X
          </p>
          
          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const count = twitterTools.filter(t => t.category === category).length;
              const CategoryIcon = getCategoryIcon(category);
              const colors = [
                "text-blue-600", "text-green-600", "text-purple-600", 
                "text-orange-600", "text-indigo-600", "text-teal-600"
              ];
              
              return (
                <div key={category} className="text-center">
                  <div className={`w-12 h-12 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center mx-auto mb-2`}>
                    <CategoryIcon className={`w-6 h-6 ${colors[index % colors.length]}`} />
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{count}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{category.replace(" & ", "\n& ")}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tools by Category */}
        {categories.map((category) => {
          const categoryTools = twitterTools.filter(tool => tool.category === category);
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
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {tool.name}
                          </h3>
                          {tool.url.includes('twitter.com') && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                              Oficial
                            </span>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    {tool.features && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {tool.features.slice(0, 3).map((feature, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
                            >
                              {feature}
                            </span>
                          ))}
                          {tool.features.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                              +{tool.features.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
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
        
        {/* Best Practices Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-700">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2" />
            Melhores Práticas para OSINT no Twitter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">🔍 Busca Avançada</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use operadores como "from:", "to:", "since:", "until:" para buscar com precisão
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">📊 Análise de Contas</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Verifique padrões de postagem, followers e engagement para identificar contas suspeitas
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">🗺️ Geolocalização</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use ferramentas de mapa para rastrear tweets geotagged e identificar localização
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}