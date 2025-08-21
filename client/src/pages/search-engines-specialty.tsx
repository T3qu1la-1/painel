import ToolsList from "./tools-list";
import { Database, Shield, Smartphone } from "lucide-react";

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

export default function SearchEnginesSpecialty() {
  return (
    <ToolsList
      title="Motores de Busca Especializados"
      description="Ferramentas especializadas para busca em infraestrutura, IoT e segurança"
      tools={specialtySearchEngines}
    />
  );
}