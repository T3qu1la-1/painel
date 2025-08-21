import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  login: z.string().min(1, "Login é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: data.login, // Usar o campo login como username
          password: data.password
        }),
      });
      return response;
    },
    onSuccess: (data) => {
      // Store JWT token and user data
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao Painel OSINT",
      });
      
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen dolp-bg-animated dolp-matrix-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 dolp-fade-in">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-3 dolp-slide-in">
            <Shield className="h-10 w-10 text-blue-500 dolp-glow dolp-float" />
            <h1 className="text-4xl font-bold text-white dolp-text-glow">DOLP</h1>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400 text-lg">DOLP - Painel da Equipe</p>
            <p className="dolp-subtitle">Sistema DOLP de Inteligência</p>
          </div>
          

        </div>

        <Card className="dolp-card dolp-scan-effect">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white flex items-center space-x-2 dolp-slide-in">
              <Lock className="h-5 w-5 dolp-pulse" />
              <span>Entrar</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Acesse sua conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Login Field */}
              <div className="space-y-2">
                <Label htmlFor="login" className="text-white">
                  Email ou Nome de usuário
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="login"
                    {...register("login")}
                    className="pl-10 dolp-input text-white placeholder-gray-400"
                    placeholder="Digite seu email ou nome de usuário"
                    data-testid="input-login"
                  />
                </div>
                {errors.login && (
                  <p className="text-sm text-red-400">{errors.login.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="pl-10 pr-10 dolp-input text-white placeholder-gray-400"
                    placeholder="Digite sua senha"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full dolp-button text-white font-semibold"
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="dolp-loading"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-gray-400">
                  Não tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => setLocation("/register")}
                    className="text-blue-400 hover:text-blue-300 underline"
                    data-testid="link-register"
                  >
                    Criar conta
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Alert */}
        <Alert className="bg-blue-900/20 border-blue-500/20">
          <Shield className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <strong>Administradores:</strong> Use suas credenciais especiais para aprovação de usuários.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}