# WebMCP Agent Developer — Formação 4

Formação prática dedicada ao papel **WebMCP Agent Developer**. O projeto ensina a construir o agente de navegador que descobre, seleciona e executa ferramentas oferecidas pela página sem entregar autorização ao modelo.

## O que está incluído

- arquitetura de 4 capítulos Agent Developer, cada um com seus próprios módulos;
- Capítulo 1 publicado com 4 módulos completos, 24 tópicos e cerca de 12 horas;
- progresso, dúvidas, anotações, temas e exportação/importação da jornada;
- console local para auditar o contexto apresentado ao agente;
- validador avançado de catálogos, tools e JSON Schemas;
- geração estática pronta para GitHub Pages e Vercel.

## Capítulos e módulos

O menu superior navega pelos capítulos da formação Agent Developer. A numeração segue `capítulo.módulo`: `1.1`, `1.2`, `2.1` e assim por diante.

O Capítulo 1 está publicado com estes módulos:

1. Descoberta de ferramentas;
2. Execução de ferramentas;
3. Cross-origin e permissões;
4. Loop conversacional.

Os capítulos 2 (Raciocínio e políticas), 3 (Adaptadores de modelos) e 4 (Entrega Agent Developer) já estão mapeados no índice e serão publicados progressivamente.

## Executar localmente

```bash
npm run build
npm test
npm run serve
```

Abra `http://localhost:4173`. O curso também é legível abrindo `index.html`, mas um servidor local representa melhor o contexto de execução.

## Console Page Agent

O laboratório em `labs/validador-tools.html` recebe um descritor JSON auditável. Ele verifica:

- unicidade, nomes, títulos e descrições;
- estrutura de `inputSchema`;
- coerência de `required` e `properties`;
- annotations do draft;
- evidência de `AbortSignal`;
- risco, confirmação humana, fallback e exemplo de resultado.

O console é local, determinístico e não registra nem executa tools. Campos de governança como `risk`, `fallback` e `resultExample` não pertencem ao draft WebMCP; servem para revisar prontidão operacional.


## Especificação e limites

WebMCP permanece em evolução. O conteúdo foi conferido em 30 de agosto de 2026 contra o [repositório oficial WebMCP](https://github.com/webmachinelearning/webmcp), a [especificação renderizada](https://webmachinelearning.github.io/webmcp/) e o [explainer da API declarativa](https://github.com/webmachinelearning/webmcp/blob/main/declarative-api-explainer.md).

O curso ensina `document.modelContext`, `registerTool()`, `getTools()`, `executeTool()` e ciclo de vida por `AbortSignal`. Não trata WebMCP como substituto do backend, de autorização ou de MCP.

## Progressão da formação

Todas as fases usam `<meta name="inema-course" content="webmcp-zero-expert">`. No GitHub Pages da organização, o estado local é compartilhado pela mesma origem. Para outros domínios, o aluno pode exportar e importar a jornada em JSON com merge não destrutivo.

Consulte [o contrato de entrega e passagem](docs/entrega-e-progressao.md).

## Licença

Código sob licença MIT. Conteúdo educacional © INEMA.

<!-- inema-backlink:v1 -->
## Mais no INEMA.CLUB

- [Ficha completa deste curso](https://www.inema.club/cursos/249-formacao-webmcp-4-agent-developer/)
- [Guia: como aprender inteligência artificial](https://www.inema.club/aprender-inteligencia-artificial/)
- [Todos os cursos](https://www.inema.club/cursos/)
<!-- /inema-backlink:v1 -->
