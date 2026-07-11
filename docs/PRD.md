# PRD — BusinessOS

## 1. Objetivos e métricas de sucesso

Objetivo central da V1: dar ao founder um lugar único, simples e confiável para manter as informações centrais do negócio atualizadas, e deixar essa informação em um formato que já pode ser consumido por agentes de IA no futuro, sem precisar refazer o modelo de dados depois.

Métricas de sucesso da V1:

- O founder consegue preencher as 11 páginas de item sem fricção (sem precisar entender markdown ou frontmatter manualmente).
- O founder revisita e atualiza o conteúdo ao longo do tempo (não é preenchido uma vez e abandonado) — indicado por `updated_at` mudando ao longo das semanas.
- Cada item tem um `status` coerente com seu preenchimento real (não fica em `not_started` depois de escrito).
- O conteúdo de qualquer item pode ser lido programaticamente (via `lib/content.ts`) e serializado como contexto de IA sem transformação adicional — validando que o schema de frontmatter é suficiente.
- Zero necessidade de banco de dados para operar a V1 com um único founder/usuário local.

## 2. Personas

**Founder solo, começando do zero.** Está definindo (ou já tem um rascunho de) objetivo pessoal, mercado, cliente, tese de valor e oferta. Ainda não tem estrutura de time, processos ou ferramentas formais de gestão. Quer um lugar para organizar o raciocínio do negócio e, no futuro, ter ajuda de IA para evoluir esse raciocínio.

Não há, na V1, persona de "time" ou "múltiplos usuários" — o produto é single-user.

## 3. Escopo

### Dentro do escopo da V1

- As 4 seções (Founder, Direção, Validação, Caixa) e as 11 páginas de item correspondentes.
- Página de cada seção com listagem dos itens em cards, com select para alternar entre visualização em grid e em lista.
- Página de detalhe de cada item, com leitura e edição do conteúdo markdown e dos campos de frontmatter (`title`, `status`, `ai_context`, `summary`, `tags`).
- CRUD de conteúdo via arquivos markdown no sistema de arquivos local (pasta `content/`) — sem banco de dados.
- Persistência via Server Actions / funções de leitura e escrita de arquivo (ver `docs/spec.md`).
- Design system baseado em shadcn/ui, com componentes documentados no Storybook.

### Fora do escopo da V1

- Supabase ou qualquer banco de dados — é decisão de stack já tomada para o futuro, não implementada agora.
- Autenticação e multiusuário.
- Sincronização em nuvem.
- Agentes e skills de IA rodando de fato (nenhuma integração com LLM nesta fase). A V1 apenas modela os dados (`ai_context`, `summary`) de forma compatível com esse uso futuro.
- Qualquer funcionalidade de colaboração em tempo real.
- Importação/exportação de dados de outras ferramentas.

## 4. Requisitos funcionais

### 4.1 Estrutura geral

- Navegação principal em sidebar, com as 4 seções (Founder, Direção, Validação, Caixa).
- Cada seção tem uma página própria listando seus itens como cards. Um select no topo da página alterna entre visualização em grid e em lista.
- Cada item tem uma página de detalhe própria (rota própria), com o conteúdo markdown renderizado/editável e os metadados do frontmatter visíveis (status, se entra no contexto de IA, resumo, tags, data de atualização).
- O card de cada item, na página de seção, mostra pelo menos: título, status e o `summary` como preview.

### 4.2 Páginas de item — propósito de cada uma

**Seção Founder**

1. **Objetivo** — motivação pessoal por trás do negócio: por que o founder está construindo isso, o que ele busca alcançar (financeiro, profissional, pessoal).
2. **Estilo de vida** — como o founder quer que seu dia a dia e sua vida funcionem por causa (ou apesar) do negócio; restrições pessoais de tempo, energia e prioridades que moldam as decisões do negócio.

**Seção Direção**

3. **Mapa do Mercado** — tamanho, dinâmica e principais forças do mercado-alvo: quem mais atua ali, tendências relevantes, e onde há espaço de oportunidade.
4. **Mapa de Problemas** — os problemas reais que o público-alvo enfrenta, priorizados por relevância e intensidade, que o negócio pode escolher resolver.
5. **Perfil Ideal de Cliente** — descrição concreta de quem é o cliente que o negócio quer servir: características, contexto, comportamento e critérios que o tornam "ideal".
6. **Tese de Valor** — a hipótese central de por que o negócio vai gerar valor para esse cliente e por que ele pagaria por isso.
7. **Oferta** — o que exatamente será vendido: formato, entrega, e como isso resolve o problema mapeado.

**Seção Validação**

8. **Oferta** — versão da oferta em teste no mercado real: o que foi ajustado desde a hipótese inicial e o que está sendo validado agora.
9. **Primeiros clientes** — registro dos primeiros clientes reais (ou tentativas de venda): quem são, o que foi aprendido com cada um, e sinais de validação ou de ajuste necessário.

**Seção Caixa**

10. **Fluxo de Caixa** — entradas e saídas de dinheiro do negócio, visão de curto prazo de quanto entra, quanto sai, e saúde financeira imediata.
11. **ERP** — visão mais estruturada/consolidada da operação financeira e administrativa do negócio conforme ele cresce além do fluxo de caixa básico.

### 4.3 Edição de conteúdo

- O founder edita o corpo em markdown livremente.
- O founder pode alterar `status` (`not_started`, `in_progress`, `done`).
- O founder pode alternar `ai_context` (se aquele item deve ou não entrar no contexto passado a agentes de IA no futuro).
- `summary` é editável e usado tanto como preview no card quanto como contexto rápido para IA.
- `updated_at` é atualizado automaticamente a cada salvamento.
- `tags` são opcionais, editáveis livremente.

## 5. Requisitos não funcionais

- **Simplicidade antes de completude**: a V1 deve ser operável por um founder não-técnico sem que ele precise entender markdown/YAML como formato — a interface deve abstrair isso.
- **Performance**: leitura e escrita de arquivos locais devem ser instantâneas do ponto de vista do usuário (sem loaders perceptíveis para operações de CRUD simples).
- **Sem lock-in de banco de dados**: a modelagem de conteúdo em arquivos markdown com frontmatter deve ser suficiente e portátil, sem depender de nenhuma infraestrutura de banco para funcionar na V1.
- **Compatibilidade futura**: o schema de frontmatter e a estrutura de pastas devem ser desenhados para migrar depois para Supabase sem exigir redesenho de dados, apenas troca de camada de persistência.
- **Consistência visual**: todos os componentes de UI devem seguir o design system definido (shadcn/ui "new-york", neutral, Inter, cantos arredondados) e estar documentados no Storybook.
- **Acessibilidade básica**: contraste adequado em preto e branco, navegação por teclado nos componentes interativos padrão do shadcn/ui.
