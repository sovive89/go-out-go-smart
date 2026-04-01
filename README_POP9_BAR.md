# PØP9 BAR - Sistema de Gestão de Comandas Individuais

Um sistema moderno e intuitivo para gerenciar comandas de bar sem mesas, com foco em agilidade, controle em tempo real e experiência do cliente.

## 🎯 Características Principais

### 👥 Interface do Cliente (PWA)
- **Acesso via QR Code**: Cliente escaneia e acessa a PWA
- **Cadastro Rápido**: Nome completo + Celular (padrão BR)
- **Abertura Automática de Comanda**: Sessão ativa com timestamp
- **Sistema de Pedidos**: Cardápio com categorias, ingredientes customizáveis e observações
- **Acompanhamento em Tempo Real**: Visualiza consumo e status dos pedidos

### 📊 Painel do Gestor
- **Mapa de Comandas**: Cards individuais com:
  - Nome do cliente
  - Consumo discriminado (item a item)
  - Valor total da comanda
  - Timestamp de abertura
  - Botões de Imprimir e Encerrar

- **CRM & Histórico de Clientes**:
  - Histórico completo de cada cliente
  - Total gasto, número de visitas, ticket médio
  - Identificação por telefone para fidelização
  - Badges de cliente VIP (10+ visitas)

- **Relatórios Avançados**:
  - KPIs em tempo real (Faturamento, Pedidos, Ticket Médio)
  - Top 5 itens mais vendidos
  - Distribuição de vendas por horário
  - Análise de períodos (Hoje, 7 dias, 30 dias)

- **Configurações Administrativas**:
  - **Gerenciamento de APIs**: Adicionar chaves para integrações futuras
  - **Impressoras Térmicas**: Configurar impressoras por IP/Porta para recibos
  - **Links Rápidos**: Centralizar QR Code, WhatsApp suporte, etc.

### 🎨 Design
- **Identidade Visual**: PØP9 BAR com zero cortado (Ø)
- **Tema Dark Premium**: Preto (#0F0F0F), Laranja (#FF8A00), Branco
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Tipografia Bold**: Moderna e impactante

---

## 🚀 Instalação e Setup

### Pré-requisitos
- Node.js 18+ ou Bun
- Supabase (banco de dados PostgreSQL)
- Git

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/go-out-go-smart.git
cd go-out-go-smart
```

### 2. Instalar Dependências
```bash
npm install
# ou
bun install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 4. Executar em Desenvolvimento
```bash
npm run dev
# ou
bun run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 📱 Fluxo de Uso

### Para o Cliente
1. **Escaneia QR Code** → Acessa `/abrir` ou `/cliente`
2. **Preenche Dados**: Nome completo + Celular
3. **Clica "Abrir Comanda"** → Sistema cria sessão ativa
4. **Acessa Cardápio** → Navega por categorias e faz pedidos
5. **Acompanha Consumo** → Vê itens pedidos e total em tempo real
6. **Gestor Encerra** → Após pagamento, comanda é fechada

### Para o Gestor
1. **Acessa `/gestor`** → Mapa de Comandas com todos os clientes ativos
2. **Visualiza Consumo** → Cards mostram itens e totais
3. **Abre Comanda Manual** → Botão "Nova Comanda" para atendimento sem QR
4. **Imprime Comanda** → Gera recibo para o cliente
5. **Encerra Comanda** → Move para histórico após pagamento
6. **Consulta CRM** → Acessa `/gestor/crm` para histórico de clientes
7. **Analisa Relatórios** → Acessa `/gestor/relatorios-avancados` para métricas
8. **Configura Sistema** → Acessa `/gestor/configuracoes` para APIs e impressoras

---

## 🗂️ Estrutura de Pastas

```
src/
├── pages/
│   ├── client/
│   │   ├── ClientRegistration.tsx    # Cadastro inicial
│   │   ├── ClientOrder.tsx           # Sistema de pedidos
│   │   └── ClientHome.tsx            # Home do cliente
│   ├── manager/
│   │   ├── StaffDashboard.tsx        # Mapa de comandas
│   │   ├── CRMPage.tsx               # CRM & histórico
│   │   ├── AdvancedReportsPage.tsx   # Relatórios
│   │   ├── SettingsPage.tsx          # Configurações
│   │   └── AdminPage.tsx             # Admin geral
│   └── staff/
│       └── KitchenView.tsx           # Visualização cozinha
├── components/
│   ├── QRCode.tsx                    # Gerador de QR
│   └── ui/                           # Componentes UI
├── contexts/
│   ├── AuthContext.tsx               # Autenticação
│   └── CartContext.tsx               # Carrinho de pedidos
├── integrations/
│   └── supabase/                     # Cliente Supabase
└── App.tsx                           # Rotas principais
```

---

## 🔌 Rotas Principais

### Cliente
- `/` → Login
- `/abrir` → Cadastro de comanda (QR Code genérico)
- `/cliente` → Cadastro de comanda (alternativo)
- `/cliente/pedido/:sessionId` → Cadastro com session específica
- `/cliente/pedido/:sessionId/:clientToken` → Sistema de pedidos

### Gestor
- `/gestor` → Mapa de Comandas (Dashboard Principal)
- `/gestor/crm` → CRM & Histórico de Clientes
- `/gestor/relatorios-avancados` → Relatórios e Métricas
- `/gestor/configuracoes` → APIs, Impressoras, Links
- `/gestor/cozinha` → Visualização para Cozinha
- `/gestor/admin` → Painel Administrativo
- `/gestor/admin/menu` → Gestão de Cardápio

---

## 🔐 Autenticação e Roles

O sistema utiliza Supabase Auth com três roles:

- **admin**: Acesso total (mapa de comandas, CRM, relatórios, configurações)
- **attendant**: Abertura de comandas e gestão de pedidos
- **kitchen**: Visualização de pedidos para preparação

---

## 🖨️ Integração com Impressoras Térmicas

### Configuração
1. Acesse `/gestor/configuracoes` → Aba "Impressoras"
2. Adicione impressora com:
   - **Nome**: Ex: "Balcão"
   - **IP**: Ex: "192.168.1.100"
   - **Porta**: Ex: "9100" (padrão ESC/POS)
   - **Tipo**: Térmica ou Rede

### Uso
- Ao clicar "Imprimir" em uma comanda, o sistema envia o recibo para a impressora configurada
- Formato: ESC/POS (compatível com a maioria das impressoras térmicas)

---

## 🔗 Integração com APIs

### Adicionar Nova API
1. Acesse `/gestor/configuracoes` → Aba "APIs"
2. Preencha:
   - **Nome**: Ex: "Mercado Pago"
   - **Serviço**: Ex: "payment"
   - **Chave**: Sua chave de API

### Serviços Suportados
- **payment**: Mercado Pago, Stone, PagSeguro
- **crm**: RD Station, HubSpot
- **messaging**: Twilio, WhatsApp API
- **custom**: Suas próprias APIs

---

## 📊 Banco de Dados (Supabase)

### Tabelas Principais

#### `sessions`
```sql
- id (UUID)
- opened_at (TIMESTAMP)
- closed_at (TIMESTAMP, nullable)
- status (VARCHAR: 'active', 'closed')
- opened_by (UUID, FK users)
- table_number (VARCHAR, nullable)
```

#### `session_clients`
```sql
- id (UUID)
- session_id (UUID, FK sessions)
- client_name (VARCHAR)
- client_phone (VARCHAR, nullable)
- client_token (VARCHAR, unique)
- joined_at (TIMESTAMP)
```

#### `orders`
```sql
- id (UUID)
- session_id (UUID, FK sessions)
- session_client_id (UUID, FK session_clients)
- status (VARCHAR: 'pending', 'preparing', 'ready', 'served', 'cancelled')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- notes (TEXT, nullable)
```

#### `order_items`
```sql
- id (UUID)
- order_id (UUID, FK orders)
- menu_item_id (UUID, FK menu_items)
- quantity (INTEGER)
- unit_price (DECIMAL)
- status (VARCHAR)
- notes (TEXT, nullable)
- added_ingredients (JSONB, nullable)
- removed_ingredients (JSONB, nullable)
```

#### `menu_items`
```sql
- id (UUID)
- category_id (UUID, FK menu_categories)
- name (VARCHAR)
- description (TEXT, nullable)
- price (DECIMAL)
- image_url (VARCHAR, nullable)
- is_active (BOOLEAN)
- sort_order (INTEGER)
```

---

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Build para Produção
```bash
npm run build
npm run preview
```

---

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT.

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato via:
- **Email**: suporte@pop9bar.com
- **WhatsApp**: [Seu número]
- **GitHub Issues**: [Link do repositório]

---

## 🎉 Créditos

Desenvolvido com ❤️ para bares modernos que buscam eficiência e experiência do cliente.

**PØP9 BAR** - Gestão Inteligente de Comandas
