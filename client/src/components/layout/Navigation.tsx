import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Search, 
  Users, 
  Globe, 
  Shield, 
  Phone, 
  Mail, 
  Database, 
  Server, 
  Settings, 
  Wrench,
  ChevronDown,
  ChevronRight,
  Bookmark,
  History,
  User,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuItem {
  title: string;
  icon: React.ComponentType<any>;
  path?: string;
  submenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "OSINT",
    icon: Search,
    submenu: [
      { title: "Lookup de Email", icon: Mail, path: "/osint/email" },
      { title: "Análise de Domínio", icon: Globe, path: "/osint/domain" },
      { title: "Geolocalização IP", icon: Server, path: "/osint/ip" },
      { title: "Lookup de Telefone", icon: Phone, path: "/osint/phone" },
      { title: "Mídias Sociais", icon: Users, path: "/osint/social" },
      { title: "Username Check", icon: User, path: "/osint/username" },
      { title: "Whois & DNS", icon: Database, path: "/osint/whois" },
    ]
  },
  {
    title: "Ferramentas",
    icon: Wrench,
    submenu: [
      { title: "Hash Generator", icon: Shield, path: "/tools/hash" },
      { title: "Base64 Encoder/Decoder", icon: Database, path: "/tools/base64" },
      { title: "URL Shortener", icon: Globe, path: "/tools/url" },
      { title: "Port Scanner", icon: Server, path: "/tools/portscan" },
      { title: "Password Generator", icon: Shield, path: "/tools/password" },
      { title: "QR Code Generator", icon: Database, path: "/tools/qrcode" },
    ]
  },
  {
    title: "Breach Check",
    icon: Shield,
    submenu: [
      { title: "Email Breaches", icon: Mail, path: "/breach/email" },
      { title: "Password Check", icon: Shield, path: "/breach/password" },
      { title: "Domain Check", icon: Globe, path: "/breach/domain" },
    ]
  },
  {
    title: "Dados",
    icon: Database,
    submenu: [
      { title: "Histórico de Buscas", icon: History, path: "/data/history" },
      { title: "Bookmarks", icon: Bookmark, path: "/data/bookmarks" },
      { title: "Exportar Dados", icon: Database, path: "/data/export" },
    ]
  }
];

interface NavigationProps {
  onLogout: () => void;
  username?: string;
}

export function Navigation({ onLogout, username }: NavigationProps) {
  const [location] = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setOpenMenus(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isMenuOpen = (title: string) => openMenus.includes(title);
  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-gray-900 border-r border-gray-700 w-64 min-h-screen p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white mb-2">DOLP</h1>
        <p className="text-gray-400 text-sm">Sistema DOLP</p>
      </div>

      {/* User Info */}
      <div className="mb-6 p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-white text-sm">{username || 'Admin'}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Configurações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.submenu ? (
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-between h-auto p-3 text-left text-gray-300 hover:text-white hover:bg-gray-800"
                  onClick={() => toggleMenu(item.title)}
                  data-testid={`menu-${item.title.toLowerCase()}`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </div>
                  {isMenuOpen(item.title) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>

                {isMenuOpen(item.title) && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link key={subItem.path} href={subItem.path || "#"}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-auto p-2 text-sm ${
                            isActive(subItem.path || "")
                              ? "text-blue-400 bg-blue-900/20"
                              : "text-gray-400 hover:text-white hover:bg-gray-800"
                          }`}
                          data-testid={`submenu-${subItem.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <subItem.icon className="h-4 w-4 mr-3" />
                          {subItem.title}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link href={item.path || "#"}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-auto p-3 ${
                    isActive(item.path || "")
                      ? "text-blue-400 bg-blue-900/20"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                  data-testid={`menu-item-${item.title.toLowerCase()}`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.title}
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}