import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatPhoneBR, isValidPhoneBR, normalizePhoneBR } from '@/lib/phone';
import { getActiveSessionForUnitSlug, getSessionIdByClientToken } from '@/services/client-flow';

const ClientUnitEntry = () => {
  const { unitSlug } = useParams<{ unitSlug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [savedToken, setSavedToken] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!unitSlug) return;
      const activeSession = await getActiveSessionForUnitSlug(unitSlug);
      setSessionId(activeSession?.sessionId ?? null);

      const token = localStorage.getItem(`client_token_unit_${unitSlug}`);
      if (!token) return;

      const tokenSessionId = await getSessionIdByClientToken(token);
      if (tokenSessionId && activeSession?.sessionId === tokenSessionId) {
        setSavedToken(token);
      } else {
        localStorage.removeItem(`client_token_unit_${unitSlug}`);
      }
    };
    load();
  }, [unitSlug]);

  const openWithSavedToken = async () => {
    if (!unitSlug || !savedToken) return;
    navigate(`/c/${unitSlug}/comanda/${savedToken}`, { replace: true });
  };

  const isValid = name.trim().length >= 3 && isValidPhoneBR(phone) && Boolean(sessionId);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid || !sessionId || !unitSlug) return;

    const phoneNormalized = normalizePhoneBR(phone);
    setLoading(true);

    const { data: existing } = await supabase
      .from('session_clients')
      .select('client_token')
      .eq('session_id', sessionId)
      .eq('client_phone', phoneNormalized)
      .maybeSingle();

    if (existing?.client_token) {
      localStorage.setItem(`client_token_${sessionId}`, existing.client_token);
      localStorage.setItem(`client_token_unit_${unitSlug}`, existing.client_token);
      navigate(`/c/${unitSlug}/comanda/${existing.client_token}`, { replace: true });
      return;
    }

    const { data, error } = await supabase
      .from('session_clients')
      .insert({
        session_id: sessionId,
        client_name: name.trim(),
        client_phone: phoneNormalized,
      })
      .select('client_token')
      .single();

    if (error || !data) {
      toast({ title: 'Não foi possível abrir a comanda', variant: 'destructive' });
      setLoading(false);
      return;
    }

    localStorage.setItem(`client_token_${sessionId}`, data.client_token);
    localStorage.setItem(`client_token_unit_${unitSlug}`, data.client_token);
    navigate(`/c/${unitSlug}/comanda/${data.client_token}`, { replace: true });
  };

  if (!sessionId) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center space-y-3 max-w-xs">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
          <h1 className="text-lg font-semibold">Sem sessão ativa</h1>
          <p className="text-sm text-muted-foreground">Não há sessão operacional ativa para esta unidade no momento.</p>
          <Link to="/cliente" className="text-sm text-primary hover:underline">Voltar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-sm mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Abra sua comanda</h1>
          <p className="text-sm text-muted-foreground">Unidade: {unitSlug}</p>
        </div>

        {savedToken && (
          <Button variant="outline" className="w-full" onClick={openWithSavedToken}>
            Reabrir comanda anterior
          </Button>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 glass rounded-2xl p-5">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="(11) 91234-5678" value={phone} onChange={(e) => setPhone(formatPhoneBR(e.target.value))} />
          </div>
          <Button type="submit" className="w-full gap-2" disabled={!isValid || loading}>
            {loading ? 'Abrindo...' : 'Abrir comanda'} <ArrowRight className="w-4 h-4" />
          </Button>
          {!isValid && (
            <p className="text-xs text-muted-foreground">Informe nome completo e celular válido (DDD + número com 9 dígitos).</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ClientUnitEntry;
