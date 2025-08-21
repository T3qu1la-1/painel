import ToolsList from "./tools-list";
import { Users, MapPin } from "lucide-react";

const twitterTools = [
  { name: "Twitter Advanced Search", url: "https://twitter.com/search-advanced", icon: Users },
  { name: "TweetDeck", url: "https://tweetdeck.twitter.com", icon: Users },
  { name: "TweetMap", url: "https://www.omnisci.com/demos/tweetmap", icon: MapPin },
  { name: "OneMillionTweetMap", url: "https://onemilliontweetmap.com", icon: MapPin },
  { name: "Trends24", url: "https://trends24.in", icon: Users },
  { name: "Twitter Audit", url: "https://www.twitteraudit.com", icon: Users },
  { name: "Foller.me", url: "https://foller.me", icon: Users },
  { name: "ExportData", url: "https://www.exportdata.io", icon: Users },
  { name: "Sentiment140", url: "http://www.sentiment140.com", icon: Users },
];

export default function SocialTwitter() {
  return (
    <ToolsList
      title="Twitter/X OSINT"
      description="Ferramentas especializadas para investigação no Twitter/X"
      tools={twitterTools}
    />
  );
}