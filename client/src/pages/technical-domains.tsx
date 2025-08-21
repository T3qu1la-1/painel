import ToolsList from "./tools-list";
import { Network, Globe } from "lucide-react";

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

export default function TechnicalDomains() {
  return (
    <ToolsList
      title="Domínios & DNS"
      description="Ferramentas para análise de domínios, subdomínios e DNS"
      tools={domainDNSTools}
    />
  );
}