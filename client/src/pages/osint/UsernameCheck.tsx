import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Search,
  ExternalLink,
  CheckCircle,
  X,
  Clock,
  AlertTriangle,
  Info
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Platform {
  platform: string;
  url: string;
  exists: boolean;
  status: number | string;
}

interface UsernameResult {
  success: boolean;
  data?: {
    username: string;
    totalChecked: number;
    found: number;
    platforms: Platform[];
    foundPlatforms: Array<{
      name: string;
      url: string;
    }>;
  };
  error?: string;
  source: string;
  timestamp: string;
}

export default function UsernameCheck() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState<UsernameResult | null>(null);

  const checkUsernameMutation = useMutation({
    mutationFn: async (usernameToCheck: string) => {
      return apiRequest("/api/osint/username/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameToCheck }),
      });
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error: any) => {
      setResult({
        success: false,
        error: error.message || "Erro ao verificar username",
        source: "Error",
        timestamp: new Date().toISOString()
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      checkUsernameMutation.mutate(username.trim());
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (exists: boolean, status: number | string) => {
    if (status === 'timeout/error') {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    return exists ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <X className="h-4 w-4 text-gray-400" />
    );
  };

  const getStatusBadge = (exists: boolean, status: number | string) => {
    if (status === 'timeout/error') {
      return <Badge variant="secondary">Timeout</Badge>;
    }
    return exists ? (
      <Badge variant="default" className="bg-green-600">Encontrado</Badge>
    ) : (
      <Badge variant="outline">Não encontrado</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <User className="h-8 w-8 text-blue-500" />
          Verificação de Username
        </h1>
        <p className="text-gray-400">
          Verifique a disponibilidade de um username em múltiplas plataformas sociais.
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Consultar Username
          </CardTitle>
          <CardDescription>
            Digite o username para verificar sua presença em redes sociais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="usuario123"
                required
                data-testid="input-username"
              />
            </div>
            <Button 
              type="submit" 
              disabled={checkUsernameMutation.isPending}
              data-testid="button-check-username"
            >
              {checkUsernameMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verificando em todas as plataformas...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Verificar Username
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              Resultado da Verificação
            </CardTitle>
            <CardDescription>
              Fonte: {result.source} • {formatDate(result.timestamp)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.success && result.data ? (
              <>
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {result.data.totalChecked}
                    </div>
                    <div className="text-sm text-gray-400">Plataformas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {result.data.found}
                    </div>
                    <div className="text-sm text-gray-400">Encontrados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-400">
                      {result.data.totalChecked - result.data.found}
                    </div>
                    <div className="text-sm text-gray-400">Não encontrados</div>
                  </div>
                </div>

                {/* Found Platforms */}
                {result.data.found > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">
                      Perfis Encontrados
                    </h3>
                    <div className="grid gap-3">
                      {result.data.foundPlatforms.map((platform, index) => (
                        <Card key={index} className="border-green-500/20">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <div>
                                  <h4 className="font-semibold text-white">
                                    {platform.name}
                                  </h4>
                                  <p className="text-sm text-gray-400 font-mono">
                                    {platform.url}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(platform.url, '_blank')}
                                data-testid={`button-open-${platform.name.toLowerCase()}`}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Abrir
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Platforms */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">
                    Todas as Plataformas Verificadas
                  </h3>
                  <div className="grid gap-2">
                    {result.data.platforms.map((platform, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(platform.exists, platform.status)}
                          <div>
                            <span className="text-white font-medium">
                              {platform.platform}
                            </span>
                            <div className="text-xs text-gray-400 font-mono">
                              {platform.url}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(platform.exists, platform.status)}
                          {platform.exists && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(platform.url, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Alert className="border-red-500/20 bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-200">
                  Erro: {result.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-blue-500/20">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-400">Sobre esta ferramenta</h3>
              <p className="text-gray-300 text-sm">
                Esta ferramenta verifica a existência de um username em múltiplas plataformas sociais, 
                incluindo GitHub, Twitter, Instagram, LinkedIn, Reddit, YouTube, TikTok e Telegram.
              </p>
              <p className="text-gray-400 text-xs">
                ⚠️ Alguns resultados podem ter limitações devido a políticas de bloqueio das plataformas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}