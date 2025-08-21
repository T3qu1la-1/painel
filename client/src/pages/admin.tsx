import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  Activity,
  Calendar,
  Mail,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface PendingUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

interface SystemUser {
  id: string;
  email: string;
  username: string;
  role: string;
  isApproved: boolean;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("pending");

  // Check if user is admin
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Alert className="max-w-md bg-red-900/20 border-red-500/20">
          <XCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            Acesso negado. Apenas administradores podem acessar esta área.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Get pending users
  const { data: pendingUsers = [], isLoading: loadingPending } = useQuery({
    queryKey: ["/api/admin/users/pending"],
    queryFn: () => apiRequest("/api/admin/users/pending"),
  });

  // Get all users
  const { data: allUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: () => apiRequest("/api/admin/users"),
  });

  // Get system stats
  const { data: systemStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => apiRequest("/api/admin/stats"),
  });

  // Approve user mutation
  const approveUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await apiRequest(`/api/admin/users/${userId}/approve`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Usuário aprovado!",
        description: "O usuário pode agora acessar o sistema.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao aprovar usuário",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleApproveUser = (userId: string) => {
    approveUserMutation.mutate(userId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-gray-400">Gerenciamento de usuários e sistema</p>
          </div>
        </div>

        {/* Stats Cards */}
        {systemStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">Usuários Ativos</p>
                    <p className="text-2xl font-bold">{systemStats.activeUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">Buscas Hoje</p>
                    <p className="text-2xl font-bold">{systemStats.todaySearches}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-4 w-4 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Bookmarks</p>
                    <p className="text-2xl font-bold">{systemStats.totalBookmarks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">Pendentes</p>
                    <p className="text-2xl font-bold">{pendingUsers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="pending" className="data-[state=active]:bg-gray-700">
              Usuários Pendentes ({pendingUsers.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gray-700">
              Todos os Usuários
            </TabsTrigger>
          </TabsList>

          {/* Pending Users Tab */}
          <TabsContent value="pending" className="space-y-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-blue-400" />
                  <span>Usuários Aguardando Aprovação</span>
                </CardTitle>
                <CardDescription>
                  Aprove novos usuários para permitir acesso ao sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPending ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Carregando usuários...</p>
                  </div>
                ) : pendingUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhum usuário pendente de aprovação</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.map((pendingUser: PendingUser) => (
                      <div
                        key={pendingUser.id}
                        className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-gray-600 rounded-full p-2">
                            <Users className="h-5 w-5 text-gray-300" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{pendingUser.username}</h3>
                            <div className="flex items-center space-x-1 text-sm text-gray-400">
                              <Mail className="h-3 w-3" />
                              <span>{pendingUser.email}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>Registrado em {format(new Date(pendingUser.createdAt), "dd/MM/yyyy 'às' HH:mm")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-yellow-900/20 text-yellow-400 border-yellow-500/20">
                            Pendente
                          </Badge>
                          <Button
                            onClick={() => handleApproveUser(pendingUser.id)}
                            disabled={approveUserMutation.isPending}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            data-testid={`button-approve-${pendingUser.id}`}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            {approveUserMutation.isPending ? "Aprovando..." : "Aprovar"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span>Todos os Usuários do Sistema</span>
                </CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os usuários registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Carregando usuários...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allUsers.map((systemUser: SystemUser) => (
                      <div
                        key={systemUser.id}
                        className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`rounded-full p-2 ${
                            systemUser.role === 'admin' || systemUser.role === 'super_admin' 
                              ? 'bg-purple-600' 
                              : 'bg-gray-600'
                          }`}>
                            {systemUser.role === 'admin' || systemUser.role === 'super_admin' ? (
                              <Shield className="h-5 w-5 text-white" />
                            ) : (
                              <Users className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{systemUser.username}</h3>
                            <div className="flex items-center space-x-1 text-sm text-gray-400">
                              <Mail className="h-3 w-3" />
                              <span>{systemUser.email}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {systemUser.lastLogin 
                                  ? `Último acesso: ${format(new Date(systemUser.lastLogin), "dd/MM/yyyy 'às' HH:mm")}`
                                  : "Nunca acessou"
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={systemUser.role === 'admin' || systemUser.role === 'super_admin' ? "default" : "secondary"}
                            className={
                              systemUser.role === 'admin' || systemUser.role === 'super_admin'
                                ? "bg-purple-900/20 text-purple-400 border-purple-500/20"
                                : "bg-gray-600/20"
                            }
                          >
                            {systemUser.role === 'super_admin' ? 'Super Admin' : 
                             systemUser.role === 'admin' ? 'Admin' : 'Usuário'}
                          </Badge>
                          <Badge 
                            variant={systemUser.isApproved ? "default" : "destructive"}
                            className={
                              systemUser.isApproved 
                                ? "bg-green-900/20 text-green-400 border-green-500/20"
                                : "bg-red-900/20 text-red-400 border-red-500/20"
                            }
                          >
                            {systemUser.isApproved ? "Aprovado" : "Pendente"}
                          </Badge>
                          <Badge 
                            variant={systemUser.isActive ? "default" : "secondary"}
                            className={
                              systemUser.isActive 
                                ? "bg-blue-900/20 text-blue-400 border-blue-500/20"
                                : "bg-gray-600/20"
                            }
                          >
                            {systemUser.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}