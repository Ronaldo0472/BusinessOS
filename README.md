# BusinessOS

Painel de gestão pessoal e estratégica de um negócio, organizado em 4 seções:
**Founder**, **Direção**, **Validação** e **Caixa**. O conteúdo de cada item é
um arquivo markdown com frontmatter, editável direto pela interface.

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Storybook

Os componentes compartilhados (`ItemCard`, `ViewToggle`, `SidebarNav`, etc.)
têm stories no Storybook:

```bash
npm run storybook
```

Acesse [http://localhost:6006](http://localhost:6006).

### Outros scripts

```bash
npm run build            # build de produção do Next.js
npm run start             # roda o build de produção
npm run lint               # ESLint
npm run build-storybook   # build estático do Storybook
```

## Estrutura de pastas

```
src/
  app/                    # rotas (App Router)
    page.tsx              # dashboard (/)
    founder/               # seção Founder — referência completa
      page.tsx            # listagem (/founder)
      [slug]/page.tsx      # detalhe/edição (/founder/:slug)
    direcao/               # stub por enquanto (mesma estrutura de rotas)
    validacao/             # stub por enquanto
    caixa/                 # stub por enquanto
  components/
    ui/                    # componentes shadcn/ui
    sidebar-nav.tsx         # navegação lateral fixa (4 seções + subitens)
    item-card.tsx           # card de um item de conteúdo
    view-toggle.tsx         # alterna grade/lista via querystring (?view=)
    section-grid.tsx        # grid/lista de ItemCard
    content-editor.tsx      # editor de frontmatter + corpo markdown
    *.stories.tsx            # stories do Storybook
  lib/
    content.ts              # leitura/escrita de content/{section}/{slug}.md
    actions.ts               # Server Action de salvar (saveItemAction)
    utils.ts                 # helper cn() do shadcn/ui
content/
  founder/                 # itens reais (objetivo.md, estilo-de-vida.md)
  direcao/ validacao/ caixa/  # vazios — outros agentes populam depois
docs/                       # briefing, PRD e spec (mantidos por outro processo)
```

## Modelo de conteúdo

Cada item é um arquivo `content/{section}/{slug}.md` com frontmatter YAML:

```yaml
---
title: string
slug: string
section: "founder" | "direcao" | "validacao" | "caixa"
status: "not_started" | "in_progress" | "done"
updated_at: string (ISO date)
ai_context: boolean
summary: string
tags: string[]
---
(corpo markdown livre)
```

Sem banco de dados nesta fase: toda a persistência é via sistema de arquivos
(`content/`), usando `gray-matter` para ler/escrever o frontmatter.

## Padrão de referência: Founder

A seção **Founder** está 100% funcional (listagem em grade/lista, detalhe com
edição de frontmatter e corpo, salvar via Server Action) e serve de modelo
para implementar Direção, Validação e Caixa do mesmo jeito.
