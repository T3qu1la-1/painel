import { ExternalLink, User, Users, Search, Github, Code, Activity } from "lucide-react";

interface Tool {
  name: string;
  url: string;
  description: string;
  category: string;
  verified: boolean;
  platforms?: number;
}

const usernameTools: Tool[] = [
  {
    name: "Sherlock",
    url: "https://github.com/sherlock-project/sherlock",
    description: "Busca usernames em 600+ plataformas de redes sociais",
    category: "Multi-Platform",
    verified: true,
    platforms: 600
  },
  {
    name: "WhatsMyName",
    url: "https://whatsmyname.app",
    description: "Interface web para busca de usernames em múltiplas plataformas",
    category: "Web Interface",
    verified: true,
    platforms: 500
  },
  {
    name: "Blackbird",
    url: "https://github.com/p1ngul1n0/blackbird",
    description: "Ferramenta rápida para busca de usernames em redes sociais",
    category: "Multi-Platform",
    verified: true,
    platforms: 400
  },
  {
    name: "NameChk",
    url: "https://namechk.com",
    description: "Verifica disponibilidade de usernames e domínios",
    category: "Web Interface",
    verified: true
  },
  {
    name: "Maigret",
    url: "https://github.com/soxoj/maigret",
    description: "OSINT username checker com análise de perfis",
    category: "Advanced OSINT",
    verified: true,
    platforms: 300
  },
  {
    name: "Social Analyzer",
    url: "https://github.com/qeeqbox/social-analyzer",
    description: "API e interface para análise de perfis sociais",
    category: "Advanced OSINT",
    verified: true
  },
  {
    name: "IDCrawl",
    url: "https://www.idcrawl.com",
    description: "Busca pessoas em redes sociais e registros públicos",
    category: "Web Interface",
    verified: true
  },
  {
    name: "CheckUsernames",
    url: "https://checkusernames.com",
    description: "Verifica disponibilidade de usernames rapidamente",
    category: "Web Interface",
    verified: true
  },
  {
    name: "Name Checkup",
    url: "https://namecheckup.com",
    description: "Verifica usernames e disponibilidade de domínios",
    category: "Web Interface", 
    verified: true
  },
  {
    name: "Instant Username Search",
    url: "https://instantusername.com",
    description: "Busca instantânea de usernames em principais plataformas",
    category: "Web Interface",
    verified: true
  }
];

const categories = Array.from(new Set(usernameTools.map(tool => tool.category)));

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Multi-Platform": return Users;
    case "Web Interface": return Search;
    case "Advanced OSINT": return Activity;
    default: return User;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Multi-Platform": return "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700";
    case "Web Interface": return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700";
    case "Advanced OSINT": return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700";
    default: return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700";
  }
};

export default function UsernameCheck() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <User className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Username Check
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Ferramentas para verificação e busca de usernames em múltiplas plataformas
          </p>
          
          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-purple-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                    {usernameTools.filter(t => t.category === "Multi-Platform").length}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Multi-Platform</div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center">
                <Search className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                    {usernameTools.filter(t => t.category === "Web Interface").length}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Web Tools</div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                    {usernameTools.filter(t => t.category === "Advanced OSINT").length}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Advanced</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Github className="w-5 h-5 text-gray-600 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-300">
                    600+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Max Platforms</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools by Category */}
        {categories.map((category) => {
          const categoryTools = usernameTools.filter(tool => tool.category === category);
          const CategoryIcon = getCategoryIcon(category);
          const categoryColor = getCategoryColor(category);
          
          return (
            <div key={category} className="mb-8">
              <div className="flex items-center mb-6">
                <CategoryIcon className="w-6 h-6 text-gray-700 dark:text-gray-300 mr-2" />
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
                    className={`block p-6 rounded-lg border-2 ${categoryColor} hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm mr-3">
                          {tool.url.includes('github.com') ? (
                            <Github className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          ) : (
                            <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {tool.name}
                        </h3>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      {tool.platforms && (
                        <span className="text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded shadow-sm">
                          {tool.platforms}+ plataformas
                        </span>
                      )}
                      
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded flex items-center">
                        ✓ Verificado
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Tips Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Dicas de Uso
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300">
            <div>
              <strong>Para ferramentas CLI:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Sherlock e Blackbird são ideais para busca massiva</li>
                <li>Maigret oferece análise mais detalhada dos perfis</li>
              </ul>
            </div>
            <div>
              <strong>Para uso web:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>WhatsMyName oferece interface amigável</li>
                <li>NameChk é ótimo para verificação rápida</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}