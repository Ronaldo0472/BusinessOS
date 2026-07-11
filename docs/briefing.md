# Briefing de Produto — BusinessOS

## Problema

Founders que estão começando um negócio do zero não têm um lugar único onde consolidar as decisões e informações centrais do negócio (quem é o cliente, qual é a tese de valor, qual é a oferta, como está o caixa). Essa informação hoje fica espalhada em notas soltas, documentos desconectados, na cabeça do founder, ou simplesmente não é escrita. Isso gera dois problemas:

1. O founder perde tempo reconstruindo contexto toda vez que precisa tomar uma decisão ou revisitar uma escolha já feita.
2. Ferramentas de IA que poderiam ajudar no negócio (analisar, sugerir, questionar) não têm acesso a um contexto estruturado e confiável sobre o negócio — então não conseguem colaborar de forma relevante.

## Público

Founders em estágio inicial, começando um negócio do zero (pré-produto, pré-validação ou logo após os primeiros clientes). Pessoas que ainda estão definindo objetivo pessoal, mercado, cliente ideal, oferta e primeiros números de caixa — não empresas já estruturadas com times e sistemas.

## Proposta de valor

BusinessOS é a "inteligência" central do negócio: uma base estruturada de informações, organizada em markdown, que o founder edita diretamente por uma interface web simples. Essa mesma base serve como contexto compartilhado para agentes e skills de IA lerem e colaborarem na tomada de decisão e no desenvolvimento do negócio.

Não é um CRM, não é uma ferramenta de gestão de projeto, não é um bloco de notas genérico. É um repositório de decisões e informações estruturado por seções que qualquer negócio nascente precisa preencher: quem é o founder, qual a direção estratégica, como validar a oferta no mercado, e como está o caixa.

## Visão de produto

O produto organiza a informação do negócio em 4 seções e 11 páginas de item:

- **Founder** — Objetivo, Estilo de vida
- **Direção** — Mapa do Mercado, Mapa de Problemas, Perfil Ideal de Cliente, Tese de Valor, Oferta
- **Validação** — Oferta, Primeiros clientes
- **Caixa** — Fluxo de Caixa, ERP

Cada item é uma página própria, com um card de acesso na página da seção (visualização em grid ou lista). O conteúdo de cada item é escrito livremente pelo founder em markdown, com metadados estruturados (frontmatter) que descrevem status, se aquele conteúdo deve entrar como contexto para IA, e um resumo de uma linha.

No médio prazo, a visão é conectar agentes de IA especializados por seção (um agente de Direção ajudando a refinar a Tese de Valor, um agente de Caixa analisando o Fluxo de Caixa) que leem esse conteúdo como contexto compartilhado e colaboram ativamente com o founder. Essa camada de agentes está fora do escopo da V1, mas orienta as decisões de modelagem de dados desde já — por isso o frontmatter já tem o campo `ai_context`.

## Stack

- **Next.js (App Router)** + **TypeScript** + **Tailwind CSS**
- **shadcn/ui** para componentes, estilo "new-york", cor base "neutral", cantos arredondados
- **Storybook** para gestão e documentação de componentes
- Fonte **Inter**
- **Persistência V1**: sistema de arquivos local (pasta `content/`), sem banco de dados
- **Persistência futura (decisão já tomada, fora do escopo V1)**: **Supabase**, para viabilizar multiusuário, sincronização em nuvem e, eventualmente, autenticação. A V1 é deliberadamente sem banco de dados para validar o modelo de conteúdo e a experiência antes de investir em infraestrutura multiusuário.

## Princípios de design

- Minimalista, preto e branco, sem cor de destaque.
- Cantos arredondados em todos os elementos de interface.
- Sidebar de navegação com hover background nos itens.
- Cards no lugar de tabelas como padrão de listagem, com um select para alternar entre visualização em grid e em lista.
- Prioridade para clareza e velocidade de leitura/escrita sobre densidade de informação.
