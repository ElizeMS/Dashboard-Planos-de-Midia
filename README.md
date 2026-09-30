# Dashboard de Planos de Mídia

Dashboard web desenvolvido para centralizar, organizar e visualizar dados de investimentos em mídia, faturamento e performance comercial.

O projeto transforma dados históricos de vendas e investimentos em uma interface interativa, permitindo acompanhar indicadores, identificar padrões de investimento e consultar informações de forma mais rápida e estruturada.

> Projeto desenvolvido no contexto do Broto e adaptado para apresentação em portfólio. Os dados disponibilizados neste repositório foram anonimizados e/ou modificados.

## Preview

<img width="1914" height="823" alt="Captura de tela 2026-09-26 201534" src="https://github.com/user-attachments/assets/863af543-594a-4219-b5c8-d2e7e793cf55" />



## Sobre o projeto

A necessidade inicial era facilitar a consulta e análise de informações relacionadas aos planos de mídia.

A partir disso, foi desenvolvido um dashboard que reúne diferentes indicadores em uma única interface, conectando os dados comerciais a uma camada de visualização mais intuitiva.

O projeto também evoluiu para contemplar diferentes níveis de análise: uma visão geral da operação e uma visão detalhada por seller.

## Principais funcionalidades

### Visão geral

* Faturamento acumulado
* Faturamento do ano atual
* Evolução anual da receita
* Distribuição dos investimentos por serviço
* Quantidade de sellers investidores
* Indicadores de recorrência
* Investimento médio por seller
* Acompanhamento de metas

### Análise por seller

* Listagem de sellers
* Busca por nome
* Filtros por ano e mês
* Histórico de investimentos
* Serviços contratados
* Evolução dos investimentos ao longo do tempo
* Visualização detalhada das movimentações

### Análise por serviço

* Distribuição do faturamento por tipo de mídia
* Evolução mensal dos investimentos
* Filtro por serviço
* Comparação da participação de cada serviço no faturamento

## Tecnologias utilizadas

* HTML5 — estrutura das páginas
* CSS3 — estilização e responsividade
* JavaScript — lógica, filtros e manipulação dos dados
* Chart.js — criação dos gráficos e visualizações
* JSON — estruturação e armazenamento dos dados

## Decisões de desenvolvimento

Uma das preocupações do projeto foi organizar os dados de forma que diferentes informações pudessem ser utilizadas em mais de uma visualização.

A interface foi dividida em diferentes níveis de navegação para evitar concentrar todas as informações em uma única página:

* Dashboard principal para visão consolidada
* Página de sellers para consulta e filtragem
* Página individual para análise detalhada
* Visualizações específicas para análise por serviço

Os filtros também foram pensados para permitir diferentes formas de exploração dos dados, principalmente por período, seller e serviço.

## Desafios

Entre os principais desafios do desenvolvimento estiveram:

* Estruturar dados históricos para utilização na aplicação
* Definir uma organização de informações que facilitasse a leitura dos indicadores
* Criar filtros conectados aos diferentes componentes da interface
* Transformar dados comerciais em visualizações úteis para análise
* Manter a interface simples mesmo com diferentes níveis de informação
* Estruturar o projeto de forma que novas análises e funcionalidades pudessem ser adicionadas posteriormente

## Resultados

O dashboard permite consultar em uma única interface informações que anteriormente estavam distribuídas entre diferentes dados e análises.

A ferramenta proporciona uma visão consolidada de:

* Histórico de investimentos
* Faturamento
* Recorrência dos sellers
* Distribuição por serviço
* Evolução dos resultados
* Desempenho individual dos sellers

Além da utilização para acompanhamento comercial, a estrutura do projeto possibilita sua expansão para outras necessidades de análise.

## Aprendizados

O desenvolvimento do projeto proporcionou experiência prática principalmente em:

* Estruturação e manipulação de dados
* Desenvolvimento de interfaces web
* JavaScript aplicado à análise de dados
* Criação de dashboards interativos
* Visualização de dados com Chart.js
* Organização de projetos front-end
* Transformação de necessidades de negócio em funcionalidades técnicas

## Próximos passos

Algumas possibilidades de evolução do projeto incluem:

* Integração com uma fonte de dados dinâmica
* Automatização da atualização dos dados
* Novos indicadores comerciais
* Mais filtros e possibilidades de segmentação
* Exportação de relatórios
* Migração para uma arquitetura com backend e banco de dados

## Contexto

Projeto desenvolvido no contexto do Broto, com foco na organização e visualização de dados relacionados aos planos de mídia.

O repositório é apresentado como projeto de portfólio e, por isso, os dados originais foram adaptados para preservar informações internas e sensíveis.
