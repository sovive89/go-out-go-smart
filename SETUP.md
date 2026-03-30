# 🚀 Guia de Setup - PØP9 BAR

Siga este guia passo a passo para configurar o **PØP9 BAR** em sua máquina.

## 📋 Pré-requisitos

- **Node.js** 18+ ou **Bun** instalado
- Conta no **Supabase** (gratuita em [supabase.com](https://supabase.com))
- **Git** instalado
- Um editor de código (VS Code recomendado)

---

## 🔧 Passo 1: Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/go-out-go-smart.git
cd go-out-go-smart
```

---

## 📦 Passo 2: Instalar Dependências

### Com npm:
```bash
npm install
```

### Com Bun (mais rápido):
```bash
bun install
```

---

## 🔐 Passo 3: Configurar Variáveis de Ambiente

### 3.1 Criar arquivo `.env.local`

Na raiz do projeto, crie um arquivo chamado `.env.local`:

```bash
# Linux/Mac
touch .env.local

# Windows (PowerShell)
New-Item -Name ".env.local" -ItemType File
```

### 3.2 Obter Credenciais do Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Selecione seu projeto **go-out-go-smart**
3. Clique em **Settings** (engrenagem no canto inferior esquerdo)
4. Vá para a aba **API**
5. Copie:
   - **Project URL** (ex: `https://abc123.supabase.co`)
   - **Anon Key** (a chave pública)

### 3.3 Preencher `.env.local`

Abra o arquivo `.env.local` e cole:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

**⚠️ IMPORTANTE**: Nunca compartilhe este arquivo ou suas credenciais!

---

## ✅ Passo 4: Verificar Banco de Dados

As tabelas já devem estar criadas no seu Supabase. Para verificar:

1. Acesse seu projeto no Supabase
2. Vá para **SQL Editor** (ícone de banco de dados)
3. Você deve ver as tabelas:
   - `sessions`
   - `session_clients`
   - `orders`
   - `order_items`
   - `menu_items`
   - `menu_categories`
   - `user_roles`
   - `profiles`

Se alguma tabela estiver faltando, execute o SQL de criação (disponível em `supabase/migrations/`).

---

## 🎮 Passo 5: Executar Localmente

### Com npm:
```bash
npm run dev
```

### Com Bun:
```bash
bun run dev
```

A aplicação estará disponível em:
```
http://localhost:5173
```

---

## 🔑 Passo 6: Fazer Login

1. Acesse `http://localhost:5173`
2. Você verá a página de login
3. Use credenciais de teste ou crie uma nova conta via Supabase Auth

**Para criar um usuário teste no Supabase:**
1. Vá para **Authentication** → **Users**
2. Clique em **Add user**
3. Preencha email e senha
4. Clique em **Create user**

---

## 🎯 Passo 7: Testar as Funcionalidades

### Teste como Cliente:
1. Acesse `http://localhost:5173/abrir`
2. Preencha Nome e Celular
3. Clique em "Abrir Comanda"
4. Você será redirecionado para o cardápio

### Teste como Gestor:
1. Faça login com uma conta de admin
2. Acesse `http://localhost:5173/gestor`
3. Você verá o mapa de comandas

---

## 📁 Estrutura de Pastas Importante

```
go-out-go-smart/
├── .env.local              ← Suas credenciais (NÃO COMMITAR!)
├── .env.example            ← Exemplo de configuração
├── src/
│   ├── pages/
│   ├── components/
│   ├── contexts/
│   └── App.tsx
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@/integrations/supabase/client'"
**Solução**: Execute `npm install` novamente

### Erro: "VITE_SUPABASE_URL is not defined"
**Solução**: Verifique se o arquivo `.env.local` existe e tem as variáveis corretas

### Erro: "Supabase connection failed"
**Solução**: 
1. Verifique se as credenciais em `.env.local` estão corretas
2. Verifique se seu projeto Supabase está ativo
3. Verifique sua conexão com a internet

### Erro: "Port 5173 is already in use"
**Solução**: 
```bash
# Mude a porta
npm run dev -- --port 3000
```

### Banco de dados vazio (sem tabelas)
**Solução**: Execute as migrações do Supabase:
1. Acesse seu projeto no Supabase
2. Vá para **SQL Editor**
3. Execute os scripts em `supabase/migrations/`

---

## 🚀 Próximos Passos

Após configurar com sucesso:

1. **Explore o Mapa de Comandas**: `/gestor`
2. **Teste o CRM**: `/gestor/crm`
3. **Veja os Relatórios**: `/gestor/relatorios-avancados`
4. **Configure Impressoras**: `/gestor/configuracoes`
5. **Leia o README**: `README_POP9_BAR.md`

---

## 💡 Dicas

- Use o **DevTools do navegador** (F12) para debugar
- Verifique o **Console** do Supabase para erros de banco de dados
- Use **Realtime Database** do Supabase para testes em tempo real
- Mantenha `.env.local` no `.gitignore` (já está configurado)

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique este guia novamente
2. Consulte o `README_POP9_BAR.md`
3. Abra uma **Issue** no GitHub
4. Entre em contato via email ou WhatsApp

---

**Pronto para começar? Execute `npm run dev` e boa sorte! 🎉**
