import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { maskPhoneBR } from '@/lib/phone';

type MapStatus = 'abertas' | 'consumindo' | 'aguardando_preparo' | 'prontas' | 'fechamento_solicitado' | 'fechadas';

interface MapTab {
  id: string;
  opened_at: string;
  status: string;
  client_name: string;
  client_phone: string | null;
  total_amount: number;
  pending_items: number;
  map_status: MapStatus;
}

const statusTitle: Record<MapStatus, string> = {
  abertas: 'Abertas',
  consumindo: 'Consumindo',
  aguardando_preparo: 'Aguardando preparo',
  prontas: 'Prontas',
  fechamento_solicitado: 'Fechamento solicitado',
  fechadas: 'Fechadas',
};

const allColumns: MapStatus[] = ['abertas', 'consumindo', 'aguardando_preparo', 'prontas', 'fechamento_solicitado', 'fechadas'];

const CommandasMapPage = () => {
  const [tabs, setTabs] = useState<MapTab[]>([]);
  const [query, setQuery] = useState('');

  const loadMap = async () => {
    const { data: sessions } = await supabase
      .from('sessions')
      .select('id, opened_at, status, clients:session_clients(client_name, client_phone, id)')
      .order('opened_at', { ascending: false })
      .limit(100);

    if (!sessions || sessions.length === 0) {
      setTabs([]);
      return;
    }

    const sessionIds = sessions.map((s) => s.id);
    const { data: orders } = await supabase
      .from('orders')
      .select('id, session_id, status, items:order_items(status, quantity, unit_price)')
      .in('session_id', sessionIds);

    const orderBySession = new Map<string, { status: string; items: { status: string; quantity: number; unit_price: number }[] }[]>();

    ((orders ?? []) as { session_id: string; status: string; items: { status: string; quantity: number; unit_price: number }[] }[]).forEach((order) => {
      const list = orderBySession.get(order.session_id) ?? [];
      list.push({ status: order.status, items: order.items ?? [] });
      orderBySession.set(order.session_id, list);
    });

    const mapped: MapTab[] = sessions.map((session) => {
      const clients = (session.clients ?? []) as { id: string; client_name: string; client_phone: string | null }[];
      const mainClient = clients[0];
      const sessionOrders = orderBySession.get(session.id) ?? [];

      const pendingItems = sessionOrders.reduce((acc, order) => {
        return acc + order.items.filter((item) => item.status === 'pending').reduce((sum, item) => sum + item.quantity, 0);
      }, 0);

      const totalAmount = sessionOrders.reduce((acc, order) => {
        return acc + order.items.reduce((sum, item) => sum + item.quantity * Number(item.unit_price), 0);
      }, 0);

      const orderStatuses = new Set(sessionOrders.map((o) => o.status));

      let mapStatus: MapStatus = 'abertas';
      if (session.status === 'closed') mapStatus = 'fechadas';
      else if (orderStatuses.has('closing_requested')) mapStatus = 'fechamento_solicitado';
      else if (orderStatuses.has('ready')) mapStatus = 'prontas';
      else if (orderStatuses.has('preparing') || orderStatuses.has('pending')) mapStatus = 'aguardando_preparo';
      else if (totalAmount > 0) mapStatus = 'consumindo';

      return {
        id: session.id,
        opened_at: session.opened_at,
        status: session.status,
        client_name: mainClient?.client_name ?? 'Cliente',
        client_phone: mainClient?.client_phone ?? null,
        total_amount: totalAmount,
        pending_items: pendingItems,
        map_status: mapStatus,
      };
    });

    setTabs(mapped);
  };

  useEffect(() => {
    loadMap();

    const channel = supabase
      .channel('commandas-map-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, loadMap)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_clients' }, loadMap)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, loadMap)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, loadMap)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return tabs;

    return tabs.filter((tab) => {
      return (
        tab.id.slice(0, 8).toLowerCase().includes(normalized)
        || tab.client_name.toLowerCase().includes(normalized)
        || (tab.client_phone ?? '').includes(normalized.replace(/\D/g, ''))
      );
    });
  }, [query, tabs]);

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h1 className="text-lg font-bold">Mapa de Comandas</h1>
            <p className="text-xs text-muted-foreground">Operação por comanda (bar sem mesa).</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadMap}>Atualizar</Button>
        </div>
        <Input placeholder="Buscar por cliente, telefone ou código" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {allColumns.map((column) => {
          const columnTabs = filtered.filter((tab) => tab.map_status === column);
          return (
            <Card key={column} className="glass border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>{statusTitle[column]}</span>
                  <Badge variant="secondary">{columnTabs.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {columnTabs.length === 0 && (
                  <p className="text-xs text-muted-foreground">Sem comandas nesta coluna.</p>
                )}
                {columnTabs.map((tab) => (
                  <div key={tab.id} className="rounded-xl bg-secondary/20 p-3 space-y-1">
                    <div className="flex justify-between gap-2">
                      <p className="text-xs font-semibold">#{tab.id.slice(0, 6).toUpperCase()}</p>
                      <p className="text-[11px] text-muted-foreground">{new Date(tab.opened_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <p className="text-sm font-medium truncate">{tab.client_name}</p>
                    <p className="text-xs text-muted-foreground">{maskPhoneBR(tab.client_phone ?? '')}</p>
                    <div className="flex justify-between text-xs pt-1">
                      <span>Parcial: R$ {tab.total_amount.toFixed(2)}</span>
                      <span className={tab.pending_items > 0 ? 'text-primary font-semibold' : ''}>Pendentes: {tab.pending_items}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CommandasMapPage;
