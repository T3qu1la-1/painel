import ToolsList from "./tools-list";
import { Mail, Database } from "lucide-react";

const emailTools = [
  { name: "Have I Been Pwned", url: "https://haveibeenpwned.com", icon: Mail },
  { name: "Hunter.io", url: "https://hunter.io", icon: Mail },
  { name: "EmailRep", url: "https://emailrep.io", icon: Mail },
  { name: "DeHashed", url: "https://dehashed.com", icon: Database },
  { name: "LeakCheck", url: "https://leakcheck.net", icon: Database },
  { name: "Snusbase", url: "https://snusbase.com", icon: Database },
  { name: "h8mail", url: "https://github.com/khast3x/h8mail", icon: Mail },
  { name: "Holehe", url: "https://github.com/megadose/holehe", icon: Mail },
  { name: "theHarvester", url: "https://github.com/laramies/theHarvester", icon: Mail },
];

export default function PeopleEmail() {
  return (
    <ToolsList
      title="Email OSINT"
      description="Ferramentas para investigação e análise de endereços de email"
      tools={emailTools}
    />
  );
}