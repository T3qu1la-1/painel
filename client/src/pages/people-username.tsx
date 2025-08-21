import ToolsList from "./tools-list";
import { Users } from "lucide-react";

const usernameCheckTools = [
  { name: "Sherlock", url: "https://github.com/sherlock-project/sherlock", icon: Users },
  { name: "WhatsMyName", url: "https://whatsmyname.app", icon: Users },
  { name: "NameChk", url: "https://namechk.com", icon: Users },
  { name: "Blackbird", url: "https://github.com/p1ngul1n0/blackbird", icon: Users },
  { name: "Maigret", url: "https://github.com/soxoj/maigret", icon: Users },
  { name: "Social Analyzer", url: "https://github.com/qeeqbox/social-analyzer", icon: Users },
  { name: "IDCrawl", url: "https://www.idcrawl.com", icon: Users },
  { name: "CheckUsernames", url: "https://checkusernames.com", icon: Users },
  { name: "Name Checkup", url: "https://namecheckup.com", icon: Users },
  { name: "Instant Username Search", url: "https://instantusername.com", icon: Users },
];

export default function PeopleUsername() {
  return (
    <ToolsList
      title="Username Check"
      description="Ferramentas para verificação de nomes de usuário em múltiplas plataformas"
      tools={usernameCheckTools}
    />
  );
}