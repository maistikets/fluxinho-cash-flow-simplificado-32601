

# Plano: Controle de Cartões de Crédito

## Visão Geral
Adicionar um módulo de gerenciamento de cartões de crédito ao sistema financeiro, permitindo cadastrar cartões, registrar compras vinculadas, acompanhar faturas mensais e limites disponíveis.

## O que será construído

### 1. Tabela no banco de dados: `credit_cards`
- Campos: nome do cartão, bandeira, últimos 4 dígitos, limite total, dia de fechamento, dia de vencimento, cor (visual)
- RLS: cada usuário vê apenas seus cartões

### 2. Tabela no banco de dados: `credit_card_transactions`
- Vincula transações a um cartão específico
- Campos: card_id, parcela atual, total de parcelas, valor da parcela
- Permitir compras parceladas

### 3. Nova página: `/cartoes` (Cartões de Crédito)
- Lista de cartões cadastrados com cards visuais mostrando:
  - Bandeira e nome
  - Limite total / usado / disponível (barra de progresso)
  - Fatura atual (aberta) com valor acumulado
  - Próximo vencimento
- Botão para adicionar novo cartão
- Ao clicar num cartão, ver detalhes da fatura do mês com lista de compras

### 4. Formulário de cadastro de cartão
- Modal com campos: apelido, bandeira (Visa/Master/Elo/Amex/Outro), últimos 4 dígitos, limite, dia fechamento, dia vencimento
- Edição e exclusão de cartões

### 5. Integração com TransactionForm
- Quando o método de pagamento for "Cartão de Crédito", exibir campo para selecionar qual cartão
- Campo de parcelas (1x a 12x)
- Calcular valor por parcela automaticamente

### 6. Sidebar e rotas
- Adicionar item "Cartões" no menu lateral com ícone de cartão
- Registrar rota `/cartoes` no App.tsx

## Alterações por arquivo

| Arquivo | Ação |
|---------|------|
| Migration SQL | Criar tabelas `credit_cards` e `credit_card_transactions` com RLS |
| `src/hooks/useCreditCards.ts` | Novo hook — CRUD de cartões e consulta de faturas |
| `src/pages/Cartoes.tsx` | Nova página principal de cartões |
| `src/components/CreditCardForm.tsx` | Modal de cadastro/edição de cartão |
| `src/components/CreditCardDetail.tsx` | Visualização da fatura de um cartão |
| `src/components/AppSidebar.tsx` | Adicionar item "Cartões" ao menu |
| `src/App.tsx` | Adicionar rota `/cartoes` |
| `src/components/TransactionForm.tsx` | Adicionar seleção de cartão e parcelas quando pagamento é cartão crédito |
| `src/types/financial.ts` | Adicionar tipos CreditCard e CreditCardTransaction |

## Estrutura do banco

```text
credit_cards
├── id (uuid, PK)
├── user_id (uuid, NOT NULL)
├── name (text) — ex: "Nubank Pessoal"
├── brand (text) — visa, mastercard, elo, amex, outro
├── last_four_digits (text)
├── credit_limit (numeric)
├── closing_day (int) — dia do fechamento
├── due_day (int) — dia do vencimento
├── color (text) — cor para exibição
├── is_active (boolean, default true)
├── created_at, updated_at

credit_card_transactions
├── id (uuid, PK)
├── user_id (uuid, NOT NULL)
├── card_id (uuid, FK → credit_cards)
├── transaction_id (uuid, FK → transactions, nullable)
├── description (text)
├── total_amount (numeric)
├── installment_number (int) — parcela atual
├── total_installments (int) — total de parcelas
├── installment_amount (numeric)
├── reference_month (date) — mês da fatura
├── created_at
```

## Ordem de implementação
1. Migration SQL (tabelas + RLS)
2. Tipos TypeScript
3. Hook `useCreditCards`
4. Página `Cartoes.tsx` + componentes visuais
5. Integração no `TransactionForm`
6. Sidebar + rota

