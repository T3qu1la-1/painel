import ToolsList from "./tools-list";
import { MapPin } from "lucide-react";

const geoTools = [
  { name: "Google Earth", url: "https://earth.google.com", icon: MapPin },
  { name: "Bing Maps", url: "https://bing.com/maps", icon: MapPin },
  { name: "OpenStreetMap", url: "https://openstreetmap.org", icon: MapPin },
  { name: "Wikimapia", url: "https://wikimapia.org", icon: MapPin },
  { name: "Yandex Maps", url: "https://yandex.com/maps", icon: MapPin },
  { name: "What3Words", url: "https://what3words.com", icon: MapPin },
  { name: "IPinfo", url: "https://ipinfo.io", icon: MapPin },
  { name: "MaxMind", url: "https://www.maxmind.com", icon: MapPin },
  { name: "IP2Location", url: "https://www.ip2location.com", icon: MapPin },
];

export default function TechnicalIP() {
  return (
    <ToolsList
      title="IP & Geolocalização"
      description="Ferramentas para análise de IPs e geolocalização"
      tools={geoTools}
    />
  );
}