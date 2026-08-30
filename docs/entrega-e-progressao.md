# Entrega e progressão — WebMCP Agent Developer

## Resultado esperado

Ao terminar esta fase, o aluno consegue:

1. descobrir e filtrar catálogos WebMCP dinâmicos;
2. validar propostas de chamada antes da execução;
3. aplicar política, confirmação, timeout e cancelamento;
4. respeitar origem, frames e autoridade do backend;
5. construir um loop conversacional limitado e explicável;
6. avaliar a tarefa completa, não apenas o texto final.

## Evidências obrigatórias

| Módulo | Entrega | Evidência mínima |
|---|---|---|
| 1.1 | Inspetor de catálogo | filtro, ranking e dataset de descoberta |
| 1.2 | Executor controlado | schema, policy gate, timeout e trace |
| 1.3 | Matriz de autoridade | origem, identidade, consentimento e ataques |
| 1.4 | Page Agent | tarefa multietapas, pausa humana e evidências |

## Portão para a Formação 5

A fase fica elegível quando:

- 24 tópicos estão marcados como lidos;
- quatro entregas possuem evidência registrada pelo aluno;
- o catálogo final foi analisado pelo validador;
- falhas críticas do relatório foram corrigidas;
- o aluno exportou a jornada ou confirmou que continuará na mesma origem.

O conteúdo da próxima fase pode ser consultado antes do portão. A ordem é requisito de certificação, não bloqueio artificial de estudo.

## Transporte do estado

O namespace é `inema.webmcp-zero-expert.*`. As páginas usam IDs estáveis como:

```text
modulo-3-1#topico-1
modulo-3-4#topico-6
```

No GitHub Pages, os repositórios da organização são caminhos sob `inematds.github.io`, portanto compartilham a origem e o `localStorage`. Em domínio distinto, use exportação/importação JSON. Um handoff assinado por backend fica reservado para a evolução da plataforma; o estado completo nunca deve ser colocado na URL.

## Próxima fase

`webmcp-5-expert` levará a solução para segurança, arquitetura híbrida, evals, observabilidade e governança de produção.
