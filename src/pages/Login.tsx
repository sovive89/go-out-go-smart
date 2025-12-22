import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Apple, Chrome, Facebook, Instagram, ArrowRight } from 'lucide-react';
import nightpassLogo from '@/assets/nightpass-logo.png';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { user, loading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate('/eventos');
    }
  }, [user, loading, navigate]);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
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
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo and title */}
        <div className="text-center mb-12 animate-fade-in">
          <img 
            src={nightpassLogo} 
            alt="NightPass Logo" 
            className="w-72 h-auto mx-auto object-contain"
            style={{ 
              mixBlendMode: 'lighten',
              filter: 'drop-shadow(0 0 20px hsl(38 92% 50% / 0.4)) drop-shadow(0 0 40px hsl(38 92% 50% / 0.2))'
            }}
          />
        </div>

        {/* Login buttons */}
        <div className="w-full max-w-sm space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button 
            size="lg" 
            onClick={handleGetStarted} 
            className="w-full h-14 rounded-xl text-lg font-semibold group"
          >
            Começar
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground">ou continue com</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button 
              variant="glass" 
              size="icon" 
              onClick={handleGoogleLogin} 
              className="w-14 h-14 rounded-xl hover:border-primary/50"
            >
              <Chrome className="w-6 h-6" />
            </Button>
            <Button 
              variant="glass" 
              size="icon" 
              onClick={handleGetStarted} 
              className="w-14 h-14 rounded-xl hover:border-primary/50"
            >
              <Apple className="w-6 h-6" />
            </Button>
            <Button 
              variant="glass" 
              size="icon" 
              onClick={handleGetStarted} 
              className="w-14 h-14 rounded-xl hover:border-primary/50"
            >
              <Facebook className="w-6 h-6" />
            </Button>
            <Button 
              variant="glass" 
              size="icon" 
              onClick={handleGetStarted} 
              className="w-14 h-14 rounded-xl hover:border-primary/50"
            >
              <Instagram className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-sm text-muted-foreground mt-12 max-w-xs animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Ao continuar, você concorda com nossos{' '}
          <span className="text-primary hover:underline cursor-pointer">Termos de Uso</span> e{' '}
          <span className="text-primary hover:underline cursor-pointer">Política de Privacidade</span>
        </p>
      </div>
    </div>
  );
};

export default Login;