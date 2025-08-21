import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Copy,
  ArrowUpDown,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Base64Result {
  success: boolean;
  data?: {
    original: string;
    encoded?: string;
    decoded?: string;
    operation: 'encode' | 'decode';
  };
  error?: string;
  source: string;
  timestamp: string;
}

export default function Base64Tool() {
  const [encodeInput, setEncodeInput] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [encodeResult, setEncodeResult] = useState<Base64Result | null>(null);
  const [decodeResult, setDecodeResult] = useState<Base64Result | null>(null);
  const { toast } = useToast();

  const encodeMutation = useMutation({
    mutationFn: async (text: string) => {
      return apiRequest("/api/tools/base64/encode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text }),
      });
    },
    onSuccess: (data) => {
      setEncodeResult(data);
    },
    onError: (error: any) => {
      setEncodeResult({
        success: false,
        error: error.message || "Erro ao codificar",
        source: "Error",
        timestamp: new Date().toISOString()
      });
    },
  });

  const decodeMutation = useMutation({
    mutationFn: async (text: string) => {
      return apiRequest("/api/tools/base64/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text }),
      });
    },
    onSuccess: (data) => {
      setDecodeResult(data);
    },
    onError: (error: any) => {
      setDecodeResult({
        success: false,
        error: error.message || "Erro ao decodificar",
        source: "Error",
        timestamp: new Date().toISOString()
      });
    },
  });

  const handleEncode = (e: React.FormEvent) => {
    e.preventDefault();
    if (encodeInput.trim()) {
      encodeMutation.mutate(encodeInput);
    }
  };

  const handleDecode = (e: React.FormEvent) => {
    e.preventDefault();
    if (decodeInput.trim()) {
      decodeMutation.mutate(decodeInput);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado!",
        description: `${label} copiado para a área de transferência`,
        duration: 2000,
      });
    }).catch(() => {
      toast({
        title: "Erro",
        description: "Falha ao copiar para a área de transferência",
        variant: "destructive",
      });
    });
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

  const ResultCard = ({ result, title }: { result: Base64Result; title: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {result.success ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
          {title}
        </CardTitle>
        <CardDescription>
          Fonte: {result.source} • {formatDate(result.timestamp)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {result.success && result.data ? (
          <>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-400">Entrada Original</Label>
                <div className="p-3 bg-gray-800 rounded border mt-1">
                  <code className="text-sm text-gray-300 break-all">
                    {result.data.original}
                  </code>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-sm font-medium text-gray-400">
                    Resultado ({result.data.operation === 'encode' ? 'Codificado' : 'Decodificado'})
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(
                      result.data!.encoded || result.data!.decoded || '', 
                      'Resultado'
                    )}
                    data-testid={`button-copy-${result.data.operation}`}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <div className="p-3 bg-gray-900 rounded border">
                  <code className="text-sm text-green-400 break-all">
                    {result.data.encoded || result.data.decoded}
                  </code>
                </div>
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
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Database className="h-8 w-8 text-blue-500" />
          Codificador/Decodificador Base64
        </h1>
        <p className="text-gray-400">
          Codifique e decodifique texto usando Base64 encoding.
        </p>
      </div>

      {/* Tool Tabs */}
      <Tabs defaultValue="encode" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Codificar</TabsTrigger>
          <TabsTrigger value="decode">Decodificar</TabsTrigger>
        </TabsList>

        {/* Encode Tab */}
        <TabsContent value="encode" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Codificar para Base64
              </CardTitle>
              <CardDescription>
                Digite o texto para codificar em Base64
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEncode} className="space-y-4">
                <div>
                  <Label htmlFor="encode-input">Texto de Entrada</Label>
                  <Textarea
                    id="encode-input"
                    value={encodeInput}
                    onChange={(e) => setEncodeInput(e.target.value)}
                    placeholder="Digite o texto aqui..."
                    rows={4}
                    required
                    data-testid="textarea-encode-input"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Caracteres: {encodeInput.length}
                  </p>
                </div>
                <Button 
                  type="submit" 
                  disabled={encodeMutation.isPending}
                  data-testid="button-encode"
                >
                  {encodeMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Codificando...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Codificar
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {encodeResult && (
            <ResultCard result={encodeResult} title="Resultado da Codificação" />
          )}
        </TabsContent>

        {/* Decode Tab */}
        <TabsContent value="decode" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Decodificar Base64
              </CardTitle>
              <CardDescription>
                Digite o código Base64 para decodificar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDecode} className="space-y-4">
                <div>
                  <Label htmlFor="decode-input">Código Base64</Label>
                  <Textarea
                    id="decode-input"
                    value={decodeInput}
                    onChange={(e) => setDecodeInput(e.target.value)}
                    placeholder="Cole o código Base64 aqui..."
                    rows={4}
                    required
                    data-testid="textarea-decode-input"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Caracteres: {decodeInput.length}
                  </p>
                </div>
                <Button 
                  type="submit" 
                  disabled={decodeMutation.isPending}
                  data-testid="button-decode"
                >
                  {decodeMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Decodificando...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Decodificar
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {decodeResult && (
            <ResultCard result={decodeResult} title="Resultado da Decodificação" />
          )}
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="border-blue-500/20">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-400">Sobre Base64</h3>
              <p className="text-gray-300 text-sm">
                Base64 é um esquema de codificação que converte dados binários em texto ASCII. 
                É comumente usado para transmitir dados pela internet, embeder imagens em HTML/CSS, 
                e em muitos protocolos de rede. Não é uma forma de criptografia - apenas codificação.
              </p>
              <div className="text-gray-400 text-xs space-y-1">
                <p>✓ Use para codificar dados binários em texto</p>
                <p>✓ Útil para APIs e transmissão de dados</p>
                <p>⚠️ Não é seguro para dados sensíveis (não é criptografia)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}