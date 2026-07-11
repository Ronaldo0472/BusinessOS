# Spec Técnica — BusinessOS

## 1. Árvore de rotas (Next.js App Router)

```
app/
├── layout.tsx                          # layout raiz, sidebar de navegação, fonte Inter
├── page.tsx                            # home / dashboard geral (visão consolidada das 4 seções)
│
├── founder/
│   ├── page.tsx                        # seção Founder — lista de itens (grid/lista)
│   ├── objetivo/
│   │   └── page.tsx                    # item: Objetivo
│   └── estilo-de-vida/
│       └── page.tsx                    # item: Estilo de vida
│
├── direcao/
│   ├── page.tsx                        # seção Direção — lista de itens (grid/lista)
│   ├── mapa-do-mercado/
│   │   └── page.tsx
│   ├── mapa-de-problemas/
│   │   └── page.tsx
│   ├── perfil-ideal-de-cliente/
│   │   └── page.tsx
│   ├── tese-de-valor/
│   │   └── page.tsx
│   └── oferta/
│       └── page.tsx
│
├── validacao/
│   ├── page.tsx                        # seção Validação — lista de itens (grid/lista)
│   ├── oferta/
│   │   └── page.tsx
│   └── primeiros-clientes/
│       └── page.tsx
│
└── caixa/
    ├── page.tsx                        # seção Caixa — lista de itens (grid/lista)
    ├── fluxo-de-caixa/
    │   └── page.tsx
    └── erp/
        └── page.tsx
```

Observação: "Oferta" existe como slug em duas seções diferentes (`direcao/oferta` e `validacao/oferta`). Isso é esperado — o schema de conteúdo usa `section` + `slug` como chave composta, então não há colisão (`content/direcao/oferta.md` e `content/validacao/oferta.md` são arquivos distintos).

## 2. Estrutura de pastas do projeto

```
_BusinessOS/
├── app/                     # rotas do Next.js App Router (ver árvore acima)
├── components/              # componentes React reutilizáveis
│   ├── ui/                  # componentes gerados pelo shadcn/ui
│   ├── section-page.tsx     # componente de listagem de seção (grid/lista + select)
│   ├── item-card.tsx        # card de item usado na listagem
│   ├── item-detail.tsx      # visualização/edição de um item
│   └── sidebar.tsx          # navegação lateral
├── content/                 # base de conteúdo em markdown + frontmatter
│   ├── founder/
│   │   ├── objetivo.md
│   │   └── estilo-de-vida.md
│   ├── direcao/
│   │   ├── mapa-do-mercado.md
│   │   ├── mapa-de-problemas.md
│   │   ├── perfil-ideal-de-cliente.md
│   │   ├── tese-de-valor.md
│   │   └── oferta.md
│   ├── validacao/
│   │   ├── oferta.md
│   │   └── primeiros-clientes.md
│   └── caixa/
│       ├── fluxo-de-caixa.md
│       └── erp.md
├── lib/
│   ├── content.ts           # leitura/escrita de arquivos markdown (ver seção 4)
│   └── sections.ts          # metadados estáticos das 4 seções e seus itens (título, slug, rota)
├── stories/                 # arquivos .stories para o Storybook
├── docs/
│   ├── briefing.md
│   ├── PRD.md
│   └── spec.md
├── public/
├── tailwind.config.ts
├── components.json          # config do shadcn/ui
└── package.json
```

## 3. Schema de frontmatter (contrato fixo)

Todo item é um arquivo markdown em `content/{section}/{slug}.md`, `section` ∈ `{founder, direcao, validacao, caixa}`.

```yaml
---
title: string
slug: string
section: "founder" | "direcao" | "validacao" | "caixa"
status: "not_started" | "in_progress" | "done"
updated_at: string (ISO date)
ai_context: boolean   # se este item deve entrar no contexto passado aos agentes de IA
summary: string       # resumo de uma linha, usado como preview no card e como contexto rápido pra IA
tags: string[]         # opcional
---
(corpo em markdown livre, escrito pelo founder)
```

Este schema é o contrato entre a interface web (que lê/escreve) e a futura camada de agentes de IA (que só lê). Nenhum campo deve ser removido ou renomeado sem atualizar as duas pontas.

## 4. API de conteúdo — `lib/content.ts`

Camada única de acesso ao sistema de arquivos, usada tanto por Server Components (leitura) quanto por Server Actions (escrita). Nenhum outro módulo deve tocar `fs` diretamente.

```ts
// lib/content.ts

export type Section = "founder" | "direcao" | "validacao" | "caixa";

export type ItemStatus = "not_started" | "in_progress" | "done";

export interface ContentItem {
  title: string;
  slug: string;
  section: Section;
  status: ItemStatus;
  updated_at: string;   // ISO date
  ai_context: boolean;
  summary: string;
  tags?: string[];
  body: string;         // corpo markdown, sem o frontmatter
}

/**
 * Lista todos os itens de uma seção, lendo cada arquivo .md em content/{section}/
 * e parseando o frontmatter. Usado pela página de listagem da seção.
 */
export function getSection(section: Section): Promise<ContentItem[]>;

/**
 * Lê um único item por seção + slug (content/{section}/{slug}.md).
 * Usado pela página de detalhe do item. Retorna null se o arquivo não existir.
 */
export function getItem(section: Section, slug: string): Promise<ContentItem | null>;

/**
 * Escreve (cria ou atualiza) um item: serializa `data` de volta para
 * frontmatter YAML + corpo markdown, atualiza `updated_at` automaticamente,
 * e grava em content/{section}/{slug}.md. Usado por uma Server Action
 * chamada a partir do formulário de edição da página de detalhe.
 */
export function saveItem(
  section: Section,
  slug: string,
  data: Omit<ContentItem, "section" | "slug" | "updated_at">
): Promise<ContentItem>;
```

Notas de implementação:

- Parsing/serialização de frontmatter via biblioteca padrão de YAML frontmatter (ex.: `gray-matter`).
- `saveItem` é chamado a partir de uma Server Action (`"use server"`) invocada pelo formulário de edição — sem API route separada necessária na V1.
- A lista de seções e slugs válidos (as 11 páginas de item) é definida estaticamente em `lib/sections.ts` e usada para validar `section`/`slug` antes de ler ou escrever.
- Não há camada de banco de dados nesta fase: `getSection`, `getItem` e `saveItem` operam diretamente sobre `content/`. Essa é a única camada que precisará ser trocada quando a persistência migrar para Supabase — o contrato de tipos (`ContentItem`) deve permanecer o mesmo para o restante da aplicação não precisar mudar.

## 5. Design system

- **shadcn/ui**: estilo `"new-york"`, cor base `"neutral"`, cantos arredondados (`radius` padrão do preset, não customizado para além do default do estilo "new-york").
- **Tipografia**: fonte Inter, carregada via `next/font`.
- **Paleta**: preto e branco, sem cor de destaque — estados (status, hover) comunicados por peso tipográfico, opacidade e background neutro, não por cor.
- **Sidebar**: itens de navegação com hover background (token neutro do shadcn, ex. `accent`/`accent-foreground`).
- **Listagem de itens**: sempre em cards (`components/item-card.tsx`), nunca em tabela. Um `Select` (componente shadcn) no topo da página de seção alterna entre `grid` e `list` — ambas as visualizações usam o mesmo card, mudando apenas o layout container (`grid` vs `flex-col`).
- **Storybook**: cada componente novo em `components/ui/` e nos componentes de domínio (`item-card`, `section-page`, `sidebar`) tem uma story correspondente em `stories/`, documentando variantes e estados (ex.: card com `status: done` vs `not_started`, grid vs lista).

## 6. Visão de arquitetura — agentes e skills de IA (futuro, fora do escopo V1)

A visão de médio prazo é que múltiplos agentes de IA especializados por seção leiam o conteúdo de `content/` — em especial os itens com `ai_context: true` — como contexto compartilhado do negócio, e atuem como colaboradores: propondo edições, sugerindo análises, questionando premissas.

Exemplos de uso (conceituais, não implementados nesta fase):

- Um agente de "Direção" lendo `direcao/tese-de-valor.md` e `direcao/mapa-de-problemas.md` para ajudar o founder a refinar a Tese de Valor.
- Um agente de "Caixa" lendo `caixa/fluxo-de-caixa.md` para apontar riscos ou padrões no fluxo de caixa.

Elementos de arquitetura previstos para essa fase futura (nível conceitual, sem implementação definida ainda):

- Um endpoint (ou servidor MCP) que exponha os itens de `content/` filtrados por `ai_context: true`, servindo como fonte de contexto para qualquer agente/skill consumir, sem que cada agente precise reimplementar acesso ao sistema de arquivos.
- Um mecanismo de proposta de edição: agentes sugerem mudanças ao `body` ou ao `summary` de um item, mas a escrita final em `content/` continua sendo uma ação explícita do founder (revisão humana antes de persistir).
- Migração de persistência para Supabase como pré-requisito para isso funcionar em múltiplos usuários/dispositivos simultaneamente, e eventualmente para autenticação de founders e (se aplicável) de agentes.

Essa camada não deve ser construída na V1. O que a V1 precisa garantir é que o schema de frontmatter (em particular `ai_context` e `summary`) já seja suficiente para essa arquitetura futura funcionar sem exigir migração de dados.
