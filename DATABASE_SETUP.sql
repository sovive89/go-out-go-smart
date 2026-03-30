-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DATA DO PØP9 BAR
-- Copie e cole este script no SQL Editor do seu novo projeto Supabase

-- 1. Tabela de Sessões (Comandas)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'closed'
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  total_amount DECIMAL(10,2) DEFAULT 0
);

-- 2. Tabela de Clientes da Sessão (CRM)
CREATE TABLE IF NOT EXISTS session_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  client_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Categorias do Cardápio
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0
);

-- 4. Tabela de Itens do Cardápio
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES menu_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT -1 -- -1 para infinito
);

-- 5. Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  session_client_id UUID REFERENCES session_clients(id),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'delivered', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- 7. Configurações e APIs
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar Realtime para as tabelas principais
ALTER PUBLICATION supabase_realtime ADD TABLE sessions, session_clients, orders, order_items;
