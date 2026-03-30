import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UtensilsCrossed, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formatPhoneBR = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const ClientRegistration = () => {
  const { sessionId: urlSessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkExistingSession = async () => {
      // Se tiver um sessionId na URL, verifica se é válido e se o cliente já está nele
      if (urlSessionId) {
        const savedToken = localStorage.getItem(`client_token_${urlSessionId}`);
        const { data: session } = await supabase
          .from('sessions')
          .select('status')
          .eq('id', urlSessionId)
          .maybeSingle();

        if (session?.status === 'active' && savedToken) {
          navigate(`/cliente/pedido/${urlSessionId}/${savedToken}`, { replace: true });
          return;
        }
      }
      setChecking(false);
    };
    checkExistingSession();
  }, [urlSessionId, navigate]);

  const phoneDigits = phone.replace(/\D/g, '');
  const isValid = name.trim().length >= 3 && phoneDigits.length === 11;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);

    try {
      let targetSessionId = urlSessionId;

      // Se não houver sessionId na URL (QR Code genérico), criamos uma nova sessão (comanda)
      if (!targetSessionId) {
        const { data: newSession, error: sessionError } = await supabase
          .from('sessions')
          .insert({
            status: 'active',
            opened_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (sessionError || !newSession) throw new Error('Erro ao abrir comanda');
        targetSessionId = newSession.id;
      }

      // Registra o cliente na sessão
      const { data: client, error: clientError } = await supabase
        .from('session_clients')
        .insert({
          session_id: targetSessionId,
          client_name: name.trim(),
          client_phone: phoneDigits,
        })
        .select('client_token')
        .single();

      if (clientError || !client) throw new Error('Erro ao registrar cliente');

      // Salva o token para persistência
      localStorage.setItem(`client_token_${targetSessionId}`, client.client_token);
      
      toast({ 
        title: 'Comanda aberta!', 
        description: `Bem-vindo, ${name.split(' ')[0]}!`,
      });

      navigate(`/cliente/pedido/${targetSessionId}/${client.client_token}`, { replace: true });
    } catch (error: any) {
      toast({ 
        title: 'Erro no cadastro', 
        description: error.message || 'Tente novamente.', 
        variant: 'destructive' 
      });
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-10">
        {/* Logo & Welcome */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto shadow-inner">
            <UtensilsCrossed className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-bold text-3xl text-foreground tracking-tight">PØP9 BAR</h1>
            <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
            <p className="text-base text-muted-foreground font-medium">
              Seja bem-vindo! 👋
            </p>
            <p className="text-sm text-muted-foreground/80">
              Preencha abaixo para abrir sua comanda digital.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass p-8 rounded-[2.5rem] border border-border/40 shadow-2xl shadow-primary/5 animate-in fade-in zoom-in-95 duration-500 delay-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Nome completo
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Como quer ser chamado?"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-secondary/20 border-border/20 focus:bg-secondary/40 transition-all text-base"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                WhatsApp / Celular
              </label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={e => setPhone(formatPhoneBR(e.target.value))}
                  className="pl-12 h-14 rounded-2xl bg-secondary/20 border-border/20 focus:bg-secondary/40 transition-all text-base"
                  inputMode="tel"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isValid || loading}
              className="w-full h-14 rounded-2xl text-lg font-bold gap-3 mt-4 shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Abrir Comanda
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center space-y-4 animate-in fade-in duration-1000 delay-500">
          <p className="text-[11px] text-muted-foreground/60 leading-relaxed px-4">
            Ao abrir sua comanda, você concorda com os termos de uso do estabelecimento. Seus dados estão seguros.
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">
            <div className="w-8 h-[1px] bg-border/30" />
            Powered by Go Out Go Smart
            <div className="w-8 h-[1px] bg-border/30" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRegistration;
