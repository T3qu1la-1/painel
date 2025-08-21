import ToolsList from "./tools-list";
import { Eye } from "lucide-react";

const imageMediaTools = [
  { name: "TinEye", url: "https://tineye.com", icon: Eye },
  { name: "Google Images", url: "https://images.google.com", icon: Eye },
  { name: "Yandex Images", url: "https://yandex.com/images", icon: Eye },
  { name: "Bing Images", url: "https://bing.com/images", icon: Eye },
  { name: "RevEye", url: "https://reveye.com", icon: Eye },
  { name: "Image Identify", url: "https://imageidentify.com", icon: Eye },
  { name: "Karma Decay", url: "http://karmadecay.com", icon: Eye },
  { name: "Photo Forensics", url: "https://29a.ch/photo-forensics", icon: Eye },
];

export default function MediaImages() {
  return (
    <ToolsList
      title="Imagens & Mídia"
      description="Ferramentas para busca reversa e análise de imagens"
      tools={imageMediaTools}
    />
  );
}