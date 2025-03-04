
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  if (user && !loading) {
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="container mx-auto flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Bem-vindo ao Scrapvorn</h1>
            <p className="text-scrapvorn-gray mt-2">
              Faça login ou crie uma conta para começar
            </p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Registrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm onSubmit={signIn} />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm onSubmit={signUp} />
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-8">
            <Link to="/" className="text-scrapvorn-gray hover:text-scrapvorn-orange">
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AuthFormProps {
  onSubmit: (email: string, password: string, username?: string) => Promise<void>;
}

const LoginForm = ({ onSubmit }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/5 border border-scrapvorn-gray/10">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Entre com sua conta para acessar o painel
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-scrapvorn-gray">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-scrapvorn-gray/20 text-white"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-scrapvorn-gray">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-scrapvorn-gray/20 text-white"
              placeholder="Sua senha"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-scrapvorn-orange hover:bg-scrapvorn-orangeLight text-black"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

const RegisterForm = ({ onSubmit }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit(email, password, username);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/5 border border-scrapvorn-gray/10">
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>
          Registre-se para começar a usar o Scrapvorn
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-scrapvorn-gray">
              Nome de usuário
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/5 border-scrapvorn-gray/20 text-white"
              placeholder="Seu nome de usuário"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="register-email" className="text-sm font-medium text-scrapvorn-gray">
              Email
            </label>
            <Input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-scrapvorn-gray/20 text-white"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="register-password" className="text-sm font-medium text-scrapvorn-gray">
              Senha
            </label>
            <Input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-scrapvorn-gray/20 text-white"
              placeholder="Sua senha"
              required
              minLength={6}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-scrapvorn-orange hover:bg-scrapvorn-orangeLight text-black"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Auth;
