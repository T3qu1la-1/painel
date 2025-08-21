import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Menu,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Shield
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PendingUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  isApproved: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  route: string;
  order: number;
  isActive: boolean;
}

export default function AdminPanel() {
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    order: 0
  });
  const [newMenuItem, setNewMenuItem] = useState({
    categoryId: '',
    name: '',
    slug: '',
    description: '',
    icon: '',
    route: '',
    order: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending users
  const { data: pendingUsers, isLoading: loadingUsers } = useQuery({
    queryKey: ["/api/admin/users/pending"],
    queryFn: () => apiRequest("/api/admin/users/pending"),
  });

  // Fetch menu categories
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["/api/admin/menu/categories"],
    queryFn: () => apiRequest("/api/admin/menu/categories"),
  });

  // Fetch menu items
  const { data: menuItems, isLoading: loadingItems } = useQuery({
    queryKey: ["/api/admin/menu/items"],
    queryFn: () => apiRequest("/api/admin/menu/items"),
  });

  // User approval mutation
  const approveUserMutation = useMutation({
    mutationFn: ({ userId, action, reason }: { userId: string; action: 'approved' | 'rejected'; reason?: string }) =>
      apiRequest(`/api/admin/users/${userId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      }),
    onSuccess: (data, variables) => {
      toast({
        title: variables.action === 'approved' ? "Usuário Aprovado" : "Usuário Rejeitado",
        description: `${selectedUser?.username} foi ${variables.action === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/pending"] });
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar solicitação",
        variant: "destructive",
      });
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (category: any) =>
      apiRequest("/api/admin/menu/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      }),
    onSuccess: () => {
      toast({
        title: "Categoria Criada",
        description: "Nova categoria foi criada com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/menu/categories"] });
      setNewCategory({ name: '', slug: '', description: '', icon: '', order: 0 });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar categoria",
        variant: "destructive",
      });
    },
  });

  // Create menu item mutation
  const createMenuItemMutation = useMutation({
    mutationFn: (item: any) =>
      apiRequest("/api/admin/menu/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      }),
    onSuccess: () => {
      toast({
        title: "Item de Menu Criado",
        description: "Novo item foi criado com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/menu/items"] });
      setNewMenuItem({ categoryId: '', name: '', slug: '', description: '', icon: '', route: '', order: 0 });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar item",
        variant: "destructive",
      });
    },
  });

  const handleApproveUser = (action: 'approved' | 'rejected', reason?: string) => {
    if (!selectedUser) return;
    approveUserMutation.mutate({ userId: selectedUser.id, action, reason });
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug || !newCategory.icon) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, slug e ícone",
        variant: "destructive",
      });
      return;
    }
    createCategoryMutation.mutate(newCategory);
  };

  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuItem.categoryId || !newMenuItem.name || !newMenuItem.route) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha categoria, nome e rota",
        variant: "destructive",
      });
      return;
    }
    createMenuItemMutation.mutate(newMenuItem);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-500" />
          Painel Administrativo
        </h1>
        <p className="text-gray-400">
          Gerencie usuários, menus e configurações do sistema.
        </p>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="menus">Menus</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuários Pendentes de Aprovação
              </CardTitle>
              <CardDescription>
                Aprove ou rejeite novos usuários que solicitaram acesso ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Carregando usuários...</p>
                </div>
              ) : pendingUsers?.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Não há usuários pendentes de aprovação no momento.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {pendingUsers?.map((user: PendingUser) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{user.username}</h3>
                          <p className="text-sm text-gray-400">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            Registrado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                              data-testid={`button-review-${user.username}`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Revisar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Revisar Usuário</DialogTitle>
                              <DialogDescription>
                                Analise os dados do usuário e aprove ou rejeite o acesso
                              </DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-4">
                                <div className="grid gap-2">
                                  <Label>Nome de usuário</Label>
                                  <p className="text-white">{selectedUser.username}</p>
                                </div>
                                <div className="grid gap-2">
                                  <Label>Email</Label>
                                  <p className="text-white">{selectedUser.email}</p>
                                </div>
                                <div className="grid gap-2">
                                  <Label>Data de registro</Label>
                                  <p className="text-white">
                                    {new Date(selectedUser.createdAt).toLocaleString('pt-BR')}
                                  </p>
                                </div>
                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => handleApproveUser('approved')}
                                    disabled={approveUserMutation.isPending}
                                    className="flex-1"
                                    data-testid="button-approve-user"
                                  >
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Aprovar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleApproveUser('rejected')}
                                    disabled={approveUserMutation.isPending}
                                    className="flex-1"
                                    data-testid="button-reject-user"
                                  >
                                    <UserX className="h-4 w-4 mr-2" />
                                    Rejeitar
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Menus Tab */}
        <TabsContent value="menus" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Menu className="h-5 w-5" />
                  Categorias de Menu
                </CardTitle>
                <CardDescription>
                  Gerencie as categorias principais do menu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Create Category Form */}
                <form onSubmit={handleCreateCategory} className="space-y-3 p-3 bg-gray-800 rounded">
                  <h4 className="font-semibold text-white">Nova Categoria</h4>
                  <div className="grid gap-2">
                    <Label htmlFor="cat-name">Nome</Label>
                    <Input
                      id="cat-name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      placeholder="OSINT"
                      data-testid="input-category-name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cat-slug">Slug</Label>
                    <Input
                      id="cat-slug"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                      placeholder="osint"
                      data-testid="input-category-slug"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cat-icon">Ícone (Lucide)</Label>
                    <Input
                      id="cat-icon"
                      value={newCategory.icon}
                      onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                      placeholder="Search"
                      data-testid="input-category-icon"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={createCategoryMutation.isPending}
                    data-testid="button-create-category"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Categoria
                  </Button>
                </form>

                {/* Categories List */}
                <div className="space-y-2">
                  {categories?.map((category: MenuCategory) => (
                    <div key={category.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <div>
                        <span className="text-white font-medium">{category.name}</span>
                        <span className="text-gray-400 text-sm ml-2">/{category.slug}</span>
                      </div>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Menu Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Itens de Menu
                </CardTitle>
                <CardDescription>
                  Gerencie os itens dos submenus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Create Item Form */}
                <form onSubmit={handleCreateMenuItem} className="space-y-3 p-3 bg-gray-800 rounded">
                  <h4 className="font-semibold text-white">Novo Item</h4>
                  <div className="grid gap-2">
                    <Label htmlFor="item-category">Categoria</Label>
                    <Select 
                      value={newMenuItem.categoryId} 
                      onValueChange={(value) => setNewMenuItem({...newMenuItem, categoryId: value})}
                    >
                      <SelectTrigger data-testid="select-item-category">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat: MenuCategory) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="item-name">Nome</Label>
                    <Input
                      id="item-name"
                      value={newMenuItem.name}
                      onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                      placeholder="Lookup de Email"
                      data-testid="input-item-name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="item-route">Rota</Label>
                    <Input
                      id="item-route"
                      value={newMenuItem.route}
                      onChange={(e) => setNewMenuItem({...newMenuItem, route: e.target.value})}
                      placeholder="/osint/email"
                      data-testid="input-item-route"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={createMenuItemMutation.isPending}
                    data-testid="button-create-item"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Item
                  </Button>
                </form>

                {/* Items List */}
                <div className="space-y-2">
                  {menuItems?.map((item: MenuItem) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <div>
                        <span className="text-white font-medium">{item.name}</span>
                        <span className="text-gray-400 text-sm block">{item.route}</span>
                      </div>
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do Sistema
              </CardTitle>
              <CardDescription>
                Configure parâmetros globais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  Configurações avançadas do sistema estarão disponíveis em breve.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}