import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Tool {
  name: string;
  url: string;
  icon: any;
}

interface ToolsListProps {
  title: string;
  description: string;
  tools: Tool[];
}

export default function ToolsList({ title, description, tools }: ToolsListProps) {
  const openTool = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-gray-400">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Card 
              key={index}
              className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
              onClick={() => openTool(tool.url)}
              data-testid={`tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-3">
                  <Icon className="w-5 h-5 text-blue-400" />
                  <span className="flex-1">{tool.name}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-sm">
                  {tool.url.replace('https://', '').replace('http://', '')}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}