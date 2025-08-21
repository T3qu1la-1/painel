import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Server, 
  MapPin, 
  Globe, 
  Search,
  Clock,
  Building,
  Wifi,
  AlertTriangle,
  Info
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface IPGeoResult {
  success: boolean;
  data?: {
    ip: string;
    city: string;
    region: string;
    country: string;
    location: string;
    isp: string;
    timezone: string;
    postal: string;
    hostname?: string;
    details: any;
  };
  error?: string;
  source: string;
  timestamp: string;
}

export default function IPGeolocation() {
  const [ipAddress, setIpAddress] = useState("");
  const [result, setResult] = useState<IPGeoResult | null>(null);

  const checkIPMutation = useMutation({
    mutationFn: async (ip: string) => {
      return apiRequest("/api/osint/ip/geolocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip }),
      });
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error: any) => {
      setResult({
        success: false,
        error: error.message || "Erro ao obter geolocalização",
        source: "Error",
        timestamp: new Date().toISOString()
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ipAddress.trim()) {
      checkIPMutation.mutate(ipAddress.trim());
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

  const getMyIP = async () => {
    try {
      setIpAddress("Detectando...");
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      setIpAddress(data.ip);
    } catch (error) {
      setIpAddress("");
      alert("Erro ao detectar IP automaticamente");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Server className="h-8 w-8 text-blue-500" />
          Geolocalização de IP
        </h1>
        <p className="text-gray-400">
          Obtenha informações de localização e provedor de um endereço IP.
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Consultar IP
          </CardTitle>
          <CardDescription>
            Digite um endereço IP para obter informações de geolocalização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="ip">Endereço IP</Label>
              <div className="flex gap-2">
                <Input
                  id="ip"
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="8.8.8.8"
                  required
                  data-testid="input-ip"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={getMyIP}
                  data-testid="button-my-ip"
                >
                  Meu IP
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={checkIPMutation.isPending}
              data-testid="button-check-ip"
            >
              {checkIPMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Consultando...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Obter Localização
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
                <MapPin className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              Informações do IP
            </CardTitle>
            <CardDescription>
              Fonte: {result.source} • {formatDate(result.timestamp)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.success && result.data ? (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Location Info */}
                <Card className="border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Globe className="h-5 w-5 text-green-500" />
                      Localização
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">IP:</span>
                        <Badge variant="outline" className="font-mono">
                          {result.data.ip}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">País:</span>
                        <span className="text-white">{result.data.country || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Região:</span>
                        <span className="text-white">{result.data.region || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Cidade:</span>
                        <span className="text-white">{result.data.city || 'N/A'}</span>
                      </div>
                      {result.data.postal && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">CEP:</span>
                          <span className="text-white">{result.data.postal}</span>
                        </div>
                      )}
                      {result.data.location && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Coordenadas:</span>
                          <span className="text-white font-mono text-sm">
                            {result.data.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Network Info */}
                <Card className="border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wifi className="h-5 w-5 text-blue-500" />
                      Rede
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-2">
                      <div className="flex justify-between items-start">
                        <span className="text-gray-400">ISP:</span>
                        <span className="text-white text-right max-w-[200px] break-words">
                          {result.data.isp || 'N/A'}
                        </span>
                      </div>
                      {result.data.hostname && (
                        <div className="flex justify-between items-start">
                          <span className="text-gray-400">Hostname:</span>
                          <span className="text-white text-right max-w-[200px] break-words font-mono text-sm">
                            {result.data.hostname}
                          </span>
                        </div>
                      )}
                      {result.data.timezone && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Timezone:
                          </span>
                          <span className="text-white">{result.data.timezone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Map Link */}
                {result.data.location && (
                  <Card className="md:col-span-2 border-purple-500/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-purple-400 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Ver no Mapa
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Visualizar localização aproximada no Google Maps
                          </p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const [lat, lng] = result.data!.location.split(',');
                            window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                          }}
                          data-testid="button-view-map"
                        >
                          <Building className="h-4 w-4 mr-2" />
                          Abrir Maps
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
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
                Esta ferramenta utiliza o serviço IPInfo.io para fornecer informações de geolocalização 
                aproximada com base no endereço IP. As informações incluem localização geográfica, 
                provedor de internet (ISP) e outras informações de rede.
              </p>
              <p className="text-gray-400 text-xs">
                ⚠️ A precisão da localização pode variar e não representa necessariamente a localização exata do usuário.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}