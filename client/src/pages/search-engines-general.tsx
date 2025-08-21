import ToolsList from "./tools-list";
import { Search } from "lucide-react";

const searchEngines = [
  { name: "Google Search", url: "https://www.google.com", icon: Search },
  { name: "Bing", url: "https://www.bing.com", icon: Search },
  { name: "DuckDuckGo", url: "https://duckduckgo.com", icon: Search },
  { name: "Yandex", url: "https://yandex.com", icon: Search },
  { name: "Baidu", url: "https://www.baidu.com", icon: Search },
  { name: "Yahoo! Search", url: "https://www.yahoo.com", icon: Search },
  { name: "Ask", url: "https://www.ask.com", icon: Search },
  { name: "AOL", url: "https://search.aol.com", icon: Search },
  { name: "Brave Search", url: "https://search.brave.com", icon: Search },
  { name: "Wolfram Alpha", url: "https://www.wolframalpha.com", icon: Search },
  { name: "YOU.com", url: "https://you.com", icon: Search },
  { name: "Mojeek", url: "https://www.mojeek.com", icon: Search },
  { name: "Lycos", url: "https://www.lycos.com", icon: Search },
  { name: "Search.com", url: "https://www.search.com", icon: Search },
];

export default function SearchEnginesGeneral() {
  return (
    <ToolsList
      title="Motores de Busca Gerais"
      description="Principais motores de busca para investigações OSINT gerais"
      tools={searchEngines}
    />
  );
}