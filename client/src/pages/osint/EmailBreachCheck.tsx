import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  Calendar,
  Database,
  Info
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface BreachData {
  name: string;
  domain: string;
  breachDate: string;
  dataClasses: string[];
  description: string;
}

interface EmailBreachResult {
  success: boolean;
  data?: {
    email: string;
    breaches: BreachData[];
    breachCount: number;
    message?: string;
    details?: BreachData[];
  };
  error?: string;
  source: string;
  timestamp: string;
}

export default function EmailBreachCheck() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<EmailBreachResult | null>(null);

  const checkEmailMutation = useMutation({
    mutationFn: async (emailToCheck: string) => {
      return apiRequest("/api/osint/email/breaches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToCheck }),
      });
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error: any) => {
      setResult({
        success: false,
        error: error.message || "Erro ao verificar vazamentos",
        source: "Error",
        timestamp: new Date().toISOString()
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      checkEmailMutation.mutate(email.trim());
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Mail className="h-8 w-8 text-blue-500" />
          Verificação de Vazamentos de Email
        </h1>
        <p className="text-gray-400">
          Verifique se um endereço de email foi comprometido em vazamentos de dados conhecidos.
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Consultar Email
          </CardTitle>
          <CardDescription>
            Digite o endereço de email para verificar vazamentos de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Endereço de Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                required
                data-testid="input-email"
              />
            </div>
            <Button 
              type="submit" 
              disabled={checkEmailMutation.isPending}
              data-testid="button-check-email"
            >
              {checkEmailMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Verificar Vazamentos
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
                result.data?.breachCount === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )
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
            {result.success ? (
              <>
                {result.data?.breachCount === 0 ? (
                  <Alert className="border-green-500/20 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-200">
                      ✅ Nenhum vazamento encontrado para este email!
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert className="border-red-500/20 bg-red-500/10">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <AlertDescription className="text-red-200">
                        ⚠️ Este email foi encontrado em {result.data?.breachCount} vazamento(s) de dados
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Vazamentos Detectados
                      </h3>
                      
                      {result.data?.details?.map((breach, index) => (
                        <Card key={index} className="border-red-500/20">
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              {/* Breach Header */}
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-white text-lg">
                                    {breach.name}
                                  </h4>
                                  <p className="text-gray-400">{breach.domain}</p>
                                </div>
                                <Badge variant="destructive">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(breach.breachDate)}
                                </Badge>
                              </div>

                              {/* Description */}
                              <p className="text-gray-300 text-sm">
                                {breach.description}
                              </p>

                              <Separator />

                              {/* Data Classes */}
                              <div>
                                <p className="text-sm font-medium text-gray-400 mb-2">
                                  Tipos de dados comprometidos:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {breach.dataClasses.map((dataClass, idx) => (
                                    <Badge 
                                      key={idx} 
                                      variant="outline" 
                                      className="text-xs"
                                    >
                                      {dataClass}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
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
                Esta ferramenta verifica se um endereço de email foi comprometido em vazamentos de dados 
                conhecidos usando a base de dados do HaveIBeenPwned, que monitora violações de segurança 
                e vazamentos de dados em todo o mundo.
              </p>
              <p className="text-gray-400 text-xs">
                ⚠️ Esta ferramenta não coleta ou armazena os emails pesquisados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}