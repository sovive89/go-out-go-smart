import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getSessionIdByClientToken } from '@/services/client-flow';

const ClientTokenAccess = () => {
  const { unitSlug, clientToken } = useParams<{ unitSlug: string; clientToken: string }>();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolve = async () => {
      if (!clientToken) {
        setLoading(false);
        return;
      }
      const id = await getSessionIdByClientToken(clientToken);
      setSessionId(id);
      setLoading(false);
    };
    resolve();
  }, [clientToken]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!sessionId || !clientToken || !unitSlug) {
    return <Navigate to="/cliente" replace />;
  }

  return <Navigate to={`/cliente/pedido/${sessionId}/${clientToken}`} replace />;
};

export default ClientTokenAccess;
