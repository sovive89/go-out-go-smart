import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Apple, Chrome, Facebook, Instagram, Mail, ArrowLeft, Building2, PartyPopper, ShoppingBag } from 'lucide-react';
import nightpassLogo from '@/assets/nightpass-logo.png';

type AuthMode = 'select-type' | 'login' | 'signup';
type UserRole = 'customer' | 'bar' | 'event_organizer';

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'Senha deve ter no mínimo 6 caracteres');
const nameSchema = z.string().min(2, 'Nome deve ter no mínimo 2 caracteres');

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signUp, signIn, signInWithGoogle, loading } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('select-type');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/eventos');
    }
  }, [user, loading, navigate]);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'customer': return 'Cliente';
      case 'bar': return 'Estabelecimento';
      case 'event_organizer': return 'Organizador de Eventos';
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'customer': return 'Compre ingressos e acesse eventos';
      case 'bar': return 'Gerencie seu bar ou restaurante';
      case 'event_organizer': return 'Crie e gerencie seus eventos';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'customer': return <ShoppingBag className="w-8 h-8" />;
      case 'bar': return <Building2 className="w-8 h-8" />;
      case 'event_organizer': return <PartyPopper className="w-8 h-8" />;
    }
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setMode('signup');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate inputs
      emailSchema.parse(email);
      passwordSchema.parse(password);
      
      if (mode === 'signup') {
        nameSchema.parse(fullName);
        
        const { error } = await signUp(email, password, fullName, selectedRole);
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Email já cadastrado',
              description: 'Este email já está em uso. Tente fazer login.',
              variant: 'destructive',
            });
          } else {
            throw error;
          }
          return;
        }

        toast({
          title: 'Conta criada com sucesso!',
          description: 'Você será redirecionado...',
        });
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Credenciais inválidas',
              description: 'Email ou senha incorretos.',
              variant: 'destructive',
            });
          } else {
            throw error;
          }
          return;
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Erro de validação',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro. Tente novamente.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: 'Erro ao conectar com Google',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleBack = () => {
    if (mode === 'login') {
      setMode('select-type');
    } else if (mode === 'signup') {
      setMode('select-type');
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
      
      {/* Header */}
      <header className="relative z-10 p-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-6 py-8">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={nightpassLogo} 
            alt="NightPass Logo" 
            className="w-48 h-auto object-contain"
            style={{ 
              mixBlendMode: 'lighten',
              filter: 'drop-shadow(0 0 20px hsl(38 92% 50% / 0.4))'
            }}
          />
        </div>

        {/* Select Role Mode */}
        {mode === 'select-type' && (
          <div className="w-full max-w-sm space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Bem-vindo ao NightPass
              </h1>
              <p className="text-muted-foreground">
                Escolha como você quer usar o app
              </p>
            </div>

            <div className="space-y-4">
              {(['customer', 'bar', 'event_organizer'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleSelectRole(role)}
                  className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {getRoleIcon(role)}
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {getRoleLabel(role)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getRoleDescription(role)}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground">já tem conta?</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full h-14 rounded-xl"
              onClick={() => setMode('login')}
            >
              <Mail className="w-5 h-5 mr-2" />
              Entrar com Email
            </Button>
          </div>
        )}

        {/* Login/Signup Form */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="w-full max-w-sm space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                {mode === 'login' ? 'Entrar' : `Criar conta como ${getRoleLabel(selectedRole)}`}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'login' 
                  ? 'Entre com suas credenciais' 
                  : 'Preencha os dados para criar sua conta'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 rounded-xl bg-secondary/50 border-border/50"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl bg-secondary/50 border-border/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-secondary/50 border-border/50"
                  required
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Aguarde...' : (mode === 'login' ? 'Entrar' : 'Criar conta')}
              </Button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground">ou continue com</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <Button 
                variant="glass" 
                size="icon" 
                className="h-14 rounded-xl hover:border-primary/50"
                onClick={handleGoogleLogin}
              >
                <Chrome className="w-6 h-6" />
              </Button>
              <Button 
                variant="glass" 
                size="icon" 
                className="h-14 rounded-xl hover:border-primary/50"
                onClick={() => toast({ title: 'Em breve', description: 'Login com Apple em breve.' })}
              >
                <Apple className="w-6 h-6" />
              </Button>
              <Button 
                variant="glass" 
                size="icon" 
                className="h-14 rounded-xl hover:border-primary/50"
                onClick={() => toast({ title: 'Em breve', description: 'Login com Facebook em breve.' })}
              >
                <Facebook className="w-6 h-6" />
              </Button>
              <Button 
                variant="glass" 
                size="icon" 
                className="h-14 rounded-xl hover:border-primary/50"
                onClick={() => toast({ title: 'Em breve', description: 'Login com Instagram em breve.' })}
              >
                <Instagram className="w-6 h-6" />
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {mode === 'login' ? (
                <>
                  Não tem conta?{' '}
                  <button 
                    onClick={() => setMode('select-type')} 
                    className="text-primary hover:underline"
                  >
                    Criar conta
                  </button>
                </>
              ) : (
                <>
                  Já tem conta?{' '}
                  <button 
                    onClick={() => setMode('login')} 
                    className="text-primary hover:underline"
                  >
                    Entrar
                  </button>
                </>
              )}
            </p>
          </div>
        )}

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground mt-8 max-w-xs">
          Ao continuar, você concorda com nossos{' '}
          <span className="text-primary hover:underline cursor-pointer">Termos de Uso</span> e{' '}
          <span className="text-primary hover:underline cursor-pointer">Política de Privacidade</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
