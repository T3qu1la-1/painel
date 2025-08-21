import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Copy,
  Hash,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface HashResult {
  success: boolean;
  data?: {
    original: string;
    hashes: {
      md5: string;
      sha1: string;
      sha256: string;
      sha512: string;
    };
    length: number;
  };
  error?: string;
  source: string;
  timestamp: string;
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<HashResult | null>(null);
  const { toast } = useToast();

  const generateHashesMutation = useMutation({
    mutationFn: async (text: string) => {
      return apiRequest("/api/tools/hash/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text }),
      });
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error: any) => {
      setResult({
        success: false,
        error: error.message || "Erro ao gerar hashes",
        source: "Error",
        timestamp: new Date().toISOString()
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      generateHashesMutation.mutate(input);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado!",
        description: `Hash ${label} copiado para a área de transferência`,
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

  const hashAlgorithms = [
    { 
      key: 'md5', 
      name: 'MD5', 
      description: 'Message Digest Algorithm 5 (128 bits)',
      color: 'bg-red-600'
    },
    { 
      key: 'sha1', 
      name: 'SHA-1', 
      description: 'Secure Hash Algorithm 1 (160 bits)',
      color: 'bg-orange-600'
    },
    { 
      key: 'sha256', 
      name: 'SHA-256', 
      description: 'Secure Hash Algorithm 256 (256 bits)',
      color: 'bg-green-600'
    },
    { 
      key: 'sha512', 
      name: 'SHA-512', 
      description: 'Secure Hash Algorithm 512 (512 bits)',
      color: 'bg-blue-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-500" />
          Gerador de Hash
        </h1>
        <p className="text-gray-400">
          Gere hashes criptográficos MD5, SHA-1, SHA-256 e SHA-512 para qualquer texto.
        </p>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Entrada de Dados
          </CardTitle>
          <CardDescription>
            Digite o texto para gerar os hashes criptográficos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="input">Texto de Entrada</Label>
              <Textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite o texto aqui..."
                rows={4}
                required
                data-testid="textarea-input"
              />
              <p className="text-sm text-gray-400 mt-1">
                Caracteres: {input.length}
              </p>
            </div>
            <Button 
              type="submit" 
              disabled={generateHashesMutation.isPending}
              data-testid="button-generate-hashes"
            >
              {generateHashesMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Gerar Hashes
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
              Resultado dos Hashes
            </CardTitle>
            <CardDescription>
              Fonte: {result.source} • {formatDate(result.timestamp)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.success && result.data ? (
              <>
                {/* Input Summary */}
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Entrada Original</h3>
                  <p className="text-gray-300 break-all font-mono text-sm">
                    {result.data.original}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {result.data.length} caracteres
                  </Badge>
                </div>

                {/* Hash Results */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Hashes Gerados
                  </h3>
                  
                  {hashAlgorithms.map((algo) => {
                    const hashValue = result.data!.hashes[algo.key as keyof typeof result.data.hashes];
                    return (
                      <Card key={algo.key} className="border-gray-600">
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-white flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${algo.color}`}></div>
                                  {algo.name}
                                </h4>
                                <p className="text-sm text-gray-400">
                                  {algo.description}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(hashValue, algo.name)}
                                data-testid={`button-copy-${algo.key}`}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar
                              </Button>
                            </div>
                            
                            <div className="p-3 bg-gray-900 rounded border">
                              <code className="text-sm text-green-400 break-all font-mono">
                                {hashValue}
                              </code>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
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
              <h3 className="font-semibold text-blue-400">Sobre os Algoritmos de Hash</h3>
              <div className="text-gray-300 text-sm space-y-2">
                <p>
                  <strong>MD5:</strong> Rápido mas considerado inseguro para segurança. 
                  Útil para verificação de integridade simples.
                </p>
                <p>
                  <strong>SHA-1:</strong> Mais seguro que MD5, mas ainda considerado fraco. 
                  Não recomendado para novas aplicações.
                </p>
                <p>
                  <strong>SHA-256:</strong> Padrão moderno, muito seguro. 
                  Usado em Bitcoin e muitas aplicações criptográficas.
                </p>
                <p>
                  <strong>SHA-512:</strong> Versão mais forte do SHA-2. 
                  Oferece segurança máxima para aplicações críticas.
                </p>
              </div>
              <p className="text-gray-400 text-xs">
                ⚠️ Todos os hashes são gerados localmente e não são armazenados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}