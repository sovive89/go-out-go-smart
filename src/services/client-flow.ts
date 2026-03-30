import { supabase } from '@/integrations/supabase/client';

export interface ActiveUnitSession {
  unitSlug: string;
  sessionId: string;
}

export const getActiveSessionForUnitSlug = async (unitSlug: string): Promise<ActiveUnitSession | null> => {
  const normalizedSlug = unitSlug.trim().toLowerCase();

  const { data: session } = await supabase
    .from('sessions')
    .select('id')
    .eq('status', 'active')
    .order('opened_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!session) return null;

  return {
    unitSlug: normalizedSlug,
    sessionId: session.id,
  };
};

export const getSessionIdByClientToken = async (clientToken: string): Promise<string | null> => {
  const { data } = await supabase
    .from('session_clients')
    .select('session_id')
    .eq('client_token', clientToken)
    .maybeSingle();

  return data?.session_id ?? null;
};
