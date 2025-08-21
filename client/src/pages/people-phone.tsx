import ToolsList from "./tools-list";
import { Smartphone } from "lucide-react";

const phoneTools = [
  { name: "Phoneinfoga", url: "https://github.com/sundowndev/phoneinfoga", icon: Smartphone },
  { name: "TrueCaller", url: "https://www.truecaller.com", icon: Smartphone },
  { name: "WhoCalled", url: "https://whocalled.us", icon: Smartphone },
  { name: "Reverse Phone Lookup", url: "https://www.reversephonelookup.com", icon: Smartphone },
  { name: "NumberGuru", url: "https://www.numberguru.com", icon: Smartphone },
  { name: "CallerIDTest", url: "https://calleridtest.com", icon: Smartphone },
  { name: "Sync.me", url: "https://sync.me", icon: Smartphone },
];

export default function PeoplePhone() {
  return (
    <ToolsList
      title="Telefone OSINT"
      description="Ferramentas para investigação e análise de números de telefone"
      tools={phoneTools}
    />
  );
}