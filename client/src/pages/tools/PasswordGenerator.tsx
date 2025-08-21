import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Shield, 
  Copy,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Key
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PasswordResult {
  success: boolean;
  data?: {
    password: string;
    length: number;
    strength: 'Weak' | 'Medium' | 'Strong';
    config: {
      length: number;
      includeUppercase: boolean;
      includeLowercase: boolean;
      includeNumbers: boolean;
      includeSymbols: boolean;
    };
  };
  error?: string;
  source: string;
  timestamp: string;
}

export default function PasswordGenerator() {
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [result, setResult] = useState<PasswordResult | null>(null);
  const { toast } = useToast();

  const generatePasswordMutation = useMutation({
    mutationFn: async (config: any) => {
      return apiRequest("/api/tools/password/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error: any) => {
      setResult({
        success: false,
        error: error.message || "Erro ao gerar senha",
        source: "Error",
        timestamp: new Date().toISOString()
      });
    },
  });

  const handleGenerate = () => {
    const config = {
      length: length[0],
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols
    };

    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast({
        title: "Configuração inválida",
        description: "Selecione pelo menos um tipo de caractere",
        variant: "destructive",
      });
      return;
    }

    generatePasswordMutation.mutate(config);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado!",
        description: "Senha copiada para a área de transferência",
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

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Strong': return 'bg-green-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Weak': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStrengthDescription = (strength: string) => {
    switch (strength) {
      case 'Strong': return 'Senha forte - recomendada para uso';
      case 'Medium': return 'Senha média - aceitável mas pode ser melhorada';
      case 'Weak': return 'Senha fraca - considere aumentar o comprimento';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Key className="h-8 w-8 text-blue-500" />
          Gerador de Senhas
        </h1>
        <p className="text-gray-400">
          Gere senhas seguras e personalizáveis para suas contas.
        </p>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Configurações da Senha
          </CardTitle>
          <CardDescription>
            Customize os parâmetros para gerar sua senha ideal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Length Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Comprimento da Senha</Label>
              <Badge variant="outline" className="font-mono">
                {length[0]} caracteres
              </Badge>
            </div>
            <Slider
              value={length}
              onValueChange={setLength}
              max={64}
              min={4}
              step={1}
              className="w-full"
              data-testid="slider-length"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          {/* Character Types */}
          <div className="space-y-4">
            <Label>Tipos de Caracteres</Label>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
                  data-testid="checkbox-uppercase"
                />
                <Label htmlFor="uppercase" className="text-sm">
                  Maiúsculas (A-Z)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={includeLowercase}
                  onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
                  data-testid="checkbox-lowercase"
                />
                <Label htmlFor="lowercase" className="text-sm">
                  Minúsculas (a-z)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
                  data-testid="checkbox-numbers"
                />
                <Label htmlFor="numbers" className="text-sm">
                  Números (0-9)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
                  data-testid="checkbox-symbols"
                />
                <Label htmlFor="symbols" className="text-sm">
                  Símbolos (!@#$%...)
                </Label>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate}
            disabled={generatePasswordMutation.isPending}
            className="w-full"
            data-testid="button-generate-password"
          >
            {generatePasswordMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Gerando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Gerar Nova Senha
              </>
            )}
          </Button>
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
              Senha Gerada
            </CardTitle>
            <CardDescription>
              Fonte: {result.source} • {formatDate(result.timestamp)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.success && result.data ? (
              <>
                {/* Generated Password */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-400">
                      Senha Gerada
                    </Label>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`${getStrengthColor(result.data.strength)} text-white`}
                      >
                        {result.data.strength}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(result.data!.password)}
                        data-testid="button-copy-password"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-900 rounded border">
                    <code className="text-lg text-green-400 break-all font-mono">
                      {result.data.password}
                    </code>
                  </div>
                  
                  <p className="text-sm text-gray-400">
                    {getStrengthDescription(result.data.strength)}
                  </p>
                </div>

                {/* Configuration Summary */}
                <div className="p-4 bg-gray-800 rounded-lg space-y-2">
                  <h4 className="font-semibold text-white">Configuração Utilizada</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Comprimento:</span>
                      <span className="text-white">{result.data.config.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Maiúsculas:</span>
                      <span className="text-white">
                        {result.data.config.includeUppercase ? 'Sim' : 'Não'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Minúsculas:</span>
                      <span className="text-white">
                        {result.data.config.includeLowercase ? 'Sim' : 'Não'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Números:</span>
                      <span className="text-white">
                        {result.data.config.includeNumbers ? 'Sim' : 'Não'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Símbolos:</span>
                      <span className="text-white">
                        {result.data.config.includeSymbols ? 'Sim' : 'Não'}
                      </span>
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
      )}

      {/* Info Card */}
      <Card className="border-blue-500/20">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-400">Dicas de Segurança</h3>
              <div className="text-gray-300 text-sm space-y-1">
                <p>✓ Use senhas de pelo menos 12 caracteres</p>
                <p>✓ Inclua uma mistura de letras, números e símbolos</p>
                <p>✓ Use senhas únicas para cada conta</p>
                <p>✓ Considere usar um gerenciador de senhas</p>
                <p>✓ Nunca compartilhe suas senhas</p>
              </div>
              <p className="text-gray-400 text-xs">
                ⚠️ As senhas são geradas localmente e não são armazenadas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}