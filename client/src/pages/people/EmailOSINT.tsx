import { ExternalLink, Mail, Database, Search, Shield, Users, Activity } from "lucide-react";

interface Tool {
  name: string;
  url: string;
  description: string;
  category: string;
  verified: boolean;
}

const emailTools: Tool[] = [
  {
    name: "Have I Been Pwned",
    url: "https://haveibeenpwned.com",
    description: "Verifica se um email foi comprometido em vazamentos de dados",
    category: "Breach Check",
    verified: true
  },
  {
    name: "Hunter.io",
    url: "https://hunter.io",
    description: "Encontra endereços de email associados a um domínio",
    category: "Email Discovery",
    verified: true
  },
  {
    name: "EmailRep",
    url: "https://emailrep.io",
    description: "Reputação e análise de endereços de email",
    category: "Email Analysis",
    verified: true
  },
  {
    name: "DeHashed",
    url: "https://dehashed.com",
    description: "Base de dados de credenciais vazadas (pago)",
    category: "Breach Database",
    verified: true
  },
  {
    name: "LeakCheck",
    url: "https://leakcheck.net",
    description: "Verificação de vazamentos de dados",
    category: "Breach Check",
    verified: true
  },
  {
    name: "Snusbase",
    url: "https://snusbase.com",
    description: "Base de dados de breaches (pago)",
    category: "Breach Database",
    verified: true
  },
  {
    name: "Holehe",
    url: "https://github.com/megadose/holehe",
    description: "Verifica se um email está registrado em vários sites",
    category: "Email Discovery", 
    verified: true
  },
  {
    name: "Email2phonenumber",
    url: "https://github.com/martinvigo/email2phonenumber",
    description: "Encontra números de telefone associados a emails",
    category: "OSINT Tools",
    verified: true
  },
  {
    name: "theHarvester",
    url: "https://github.com/laramies/theHarvester",
    description: "Coleta emails, subdomínios e informações de fontes públicas",
    category: "OSINT Tools",
    verified: true
  },
  {
    name: "h8mail",
    url: "https://github.com/khast3x/h8mail",
    description: "Busca por credenciais vazadas usando múltiplas fontes",
    category: "OSINT Tools",
    verified: true
  }
];

const categories = Array.from(new Set(emailTools.map(tool => tool.category)));

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Breach Check": return Shield;
    case "Breach Database": return Database;
    case "Email Discovery": return Search;
    case "Email Analysis": return Activity;
    case "OSINT Tools": return Users;
    default: return Mail;
  }
};

export default function EmailOSINT() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Mail className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Email OSINT
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Ferramentas especializadas para investigação e análise de endereços de email
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <Database className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  {emailTools.filter(t => t.category.includes("Database")).length} Databases
                </span>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800 dark:text-green-300">
                  {emailTools.filter(t => t.category.includes("Check")).length} Breach Checkers
                </span>
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                  {emailTools.filter(t => t.category.includes("OSINT")).length} OSINT Tools
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tools by Category */}
        {categories.map((category) => {
          const categoryTools = emailTools.filter(tool => tool.category === category);
          const CategoryIcon = getCategoryIcon(category);
          
          return (
            <div key={category} className="mb-8">
              <div className="flex items-center mb-4">
                <CategoryIcon className="w-6 h-6 text-gray-700 dark:text-gray-300 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {category}
                </h2>
                <span className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                  {categoryTools.length}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {tool.name}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {tool.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                        {tool.category}
                      </span>
                      {tool.verified && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded flex items-center">
                          <Shield className="w-3 h-3 mr-1" />
                          Verificado
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}