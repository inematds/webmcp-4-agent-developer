export const course = {
  repo: 'webmcp-4-agent-developer', phase: '4', role: 'WebMCP Agent Developer', shortRole: 'Agent Developer', track: '3', accent: 'purple', icon: '🤖',
  description: 'Construa agentes de navegador que descobrem, selecionam e executam tools WebMCP com política, contexto e recuperação.',
  promise: 'Saia de chamadas manuais para um loop agêntico observável, controlado e orientado pela intenção do usuário.',
  labName: 'Console Page Agent', labDescription: 'Simule descoberta, seleção, execução e resposta de um agente diante de catálogos WebMCP.'
};

export const modules = [
  {
    id: '3-1', number: '1.1', icon: '🔎', title: 'Descoberta de ferramentas', duration: '3h', type: 'Agentes',
    promise: 'O agente entende o que a página oferece', description: 'Leia catálogos dinâmicos, filtre capacidades e transforme descritores WebMCP em contexto útil ao modelo.',
    lab: 'Construir um inspetor que captura o catálogo atual, explica cada tool e seleciona apenas as candidatas relevantes para um pedido.',
    svg: ['Página WebMCP', 'Catálogo filtrado', 'Modelo decide'],
    topics: [
      ['Comece pelo pedido do usuário', 'Descoberta começa com intenção, restrições e estado atual, não com a enumeração cega de todas as tools.', 'Um objetivo normalizado reduz ruído antes mesmo de apresentar capacidades ao modelo.', ['intenção', 'restrições', 'contexto', 'critério de sucesso'], `const objetivo = { acao: "buscar", entidade: "curso", tema: "WebMCP", nivel: "iniciante" };`],
      ['Leia o catálogo como contrato', 'Nome, descrição, inputSchema e annotations formam a interface que o agente consegue raciocinar.', 'Tratar o descritor como dado permite validar, indexar, comparar e registrar decisões.', ['name', 'description', 'inputSchema', 'annotations'], `const tools = await document.modelContext.getTools();
for (const tool of tools) validarDescritor(tool);`],
      ['Filtre antes de chamar o modelo', 'Regras determinísticas eliminam tools incompatíveis com rota, autenticação, risco ou entidade.', 'O filtro diminui tokens e impede escolhas que já sabemos serem inválidas.', ['rota atual', 'sessão', 'risco', 'pré-condição'], `const candidatas = tools.filter(tool =>
  policy.isVisible(tool, pageState, userSession)
);`],
      ['Crie representações úteis', 'O agente precisa de descrições curtas, schemas íntegros e exemplos coerentes, sem despejar implementação interna.', 'Uma representação estável melhora escolha e permite comparar modelos ou prompts.', ['serialização', 'limite de contexto', 'exemplo', 'redação'], `const promptTools = candidatas.map(({ name, description, inputSchema }) =>
  ({ name, description, inputSchema })
);`],
      ['Reaja ao catálogo efêmero', 'Navegação, login e seleção podem alterar as tools disponíveis durante a mesma conversa.', 'O agente deve invalidar snapshots e redescobrir capacidades quando o documento sinaliza mudança.', ['toolchange', 'snapshot', 'invalidação', 'redescoberta'], `document.modelContext.addEventListener("toolchange", () => {
  catalogCache.invalidate(location.href);
});`],
      ['Meça a qualidade da descoberta', 'Cobertura, precisão e tool correta no top-k revelam se o pipeline recupera boas candidatas.', 'Sem evals de descoberta, uma resposta final ruim pode ser atribuída ao componente errado.', ['recall', 'precision', 'top-k', 'dataset'], `caso: "curso iniciante"
esperadas: ["buscar_cursos"]
proibidas: ["confirmar_inscricao"]`]
    ]
  },
  {
    id: '3-2', number: '1.2', icon: '▶️', title: 'Execução de ferramentas', duration: '3h', type: 'Runtime',
    promise: 'Da decisão ao efeito verificável', description: 'Valide argumentos, aplique políticas e execute tools com timeout, cancelamento e respostas estruturadas.',
    lab: 'Implementar um executor que recebe uma chamada do modelo, valida a intenção e devolve envelope de sucesso, erro ou recuperação.',
    svg: ['Chamada proposta', 'Policy + execução', 'Resultado observado'],
    topics: [
      ['Separe proposta de execução', 'A chamada produzida pelo modelo é uma proposta não confiável até passar por validação e política.', 'A fronteira impede que texto probabilístico se transforme diretamente em efeito.', ['tool call', 'untrusted input', 'policy gate', 'execução'], `const proposal = await model.chooseTool(context);
const approved = await gate.evaluate(proposal, session);`],
      ['Valide o schema novamente', 'Mesmo quando o provedor aplica schemas, o runtime valida tipos, limites, enums e campos extras.', 'Defesa em profundidade contém divergências de provider e chamadas produzidas por código externo.', ['JSON Schema', 'coerção proibida', 'limites', 'erro estável'], `const result = validator.validate(tool.inputSchema, proposal.arguments);
if (!result.ok) return fail("INVALID_ARGUMENTS", result.errors);`],
      ['Aplique política antes do efeito', 'Risco, autenticação, escopo e necessidade de confirmação são decididos fora do modelo.', 'O LLM pode recomendar; a aplicação continua responsável por autorizar.', ['autorização', 'risco', 'confirmação', 'escopo'], `if (tool.annotations?.destructiveHint) {
  await requireHumanConfirmation(proposal);
}`],
      ['Execute com orçamento e cancelamento', 'Toda execução recebe AbortSignal, deadline e limites compatíveis com a experiência.', 'Uma conversa abandonada não deve manter rede, UI ou backend trabalhando indefinidamente.', ['AbortSignal', 'deadline', 'resource budget', 'cleanup'], `const signal = AbortSignal.any([turn.signal, AbortSignal.timeout(10_000)]);
return document.modelContext.executeTool(proposal.name, proposal.arguments, { signal });`],
      ['Normalize resultados e falhas', 'O runtime converte retornos heterogêneos em envelopes com status, dados, evidência e próxima ação.', 'Uma forma comum simplifica o loop sem esconder o erro original.', ['envelope', 'erro recuperável', 'evidência', 'next action'], `return { ok: false, code: "AUTH_REQUIRED", recovery: { action: "request_login" } };`],
      ['Registre um rastro reproduzível', 'Cada execução liga turno, catálogo, proposta, decisão de política, duração e resultado sanitizado.', 'O rastro permite depurar seleção, execução e efeito sem gravar segredos.', ['traceId', 'catalog version', 'latência', 'redaction'], `trace.record({ turnId, tool: proposal.name, policy: approved.reason, durationMs, outcome });`]
    ]
  },
  {
    id: '3-3', number: '1.3', icon: '🛂', title: 'Cross-origin e permissões', duration: '3h', type: 'Segurança',
    promise: 'Autoridade limitada por desenho', description: 'Modele origem, identidade, consentimento e fronteiras entre página, agente, backend e serviços externos.',
    lab: 'Desenhar uma matriz de autoridade para um agente que navega entre catálogo público, área autenticada e serviço externo.',
    svg: ['Origem da página', 'Fronteira de permissão', 'Serviço autorizado'],
    topics: [
      ['Mapeie quem fala por quem', 'Página, agente, usuário e backend possuem identidades e autoridades diferentes.', 'Confundir essas identidades cria delegação excessiva e bugs de autorização.', ['principal', 'delegação', 'sessão', 'recurso'], `actor: userSession.id
agent: browserAgent.instanceId
origin: location.origin
resource: "enrollments"`],
      ['Use a política da mesma origem', 'Origem combina esquema, host e porta e define uma fronteira central da Web.', 'Uma tool registrada por um documento não concede acesso livre a outras origens.', ['same-origin', 'scheme', 'host', 'port'], `const sameOrigin = new URL(target).origin === location.origin;
if (!sameOrigin) return requireExplicitPolicy(target);`],
      ['Trate iframe como fronteira', 'Frames incorporados possuem documento, origem e ciclo de vida próprios.', 'O agente precisa saber qual contexto oferece a tool e onde o efeito será visível.', ['top frame', 'iframe', 'sandbox', 'context id'], `const context = { frameId, origin: frame.location.origin, sandboxFlags };
catalog.attachContext(context);`],
      ['Não transforme CORS em autorização', 'CORS controla leitura por scripts no navegador; o backend ainda valida identidade e permissão.', 'Uma resposta liberada por CORS pode continuar proibida para aquele usuário e operação.', ['CORS', 'credentials', 'backend auth', 'CSRF'], `fetch(api, { credentials: "include", signal });
// servidor valida sessão, escopo e CSRF`],
      ['Peça consentimento proporcional', 'Ações sensíveis exigem uma confirmação clara que mostre alvo, efeito e reversibilidade.', 'Consentimento genérico ou antecipado não cobre uma mutação específica.', ['just in time', 'efeito', 'alvo', 'reversibilidade'], `confirm({ action: "cancelar inscrição", target: enrollmentId, reversible: false });`],
      ['Teste ataques entre contextos', 'A suíte cobre tool spoofing, navegação durante execução, frame removido e resposta de origem inesperada.', 'Fronteiras só existem de verdade quando os caminhos adversariais são exercitados.', ['spoofing', 'navigation race', 'frame removal', 'origin check'], `esperado: rejeitar resultado quando responseOrigin !== registeredOrigin`]
    ]
  },
  {
    id: '3-4', number: '1.4', icon: '💬', title: 'Loop conversacional', duration: '3h', type: 'Orquestração',
    promise: 'Conversa que age e explica', description: 'Construa o ciclo observar, decidir, executar e responder sem perder estado, controle ou transparência.',
    lab: 'Entregar um Page Agent que resolve uma busca em múltiplas etapas, pede confirmação e explica o resultado com evidências.',
    svg: ['Observar contexto', 'Decidir + agir', 'Responder + continuar'],
    topics: [
      ['Defina o estado do turno', 'Cada turno reúne mensagem, snapshot da página, catálogo, execuções anteriores e orçamento restante.', 'Um estado explícito evita prompts montados por concatenação acidental.', ['turn state', 'page snapshot', 'history', 'budget'], `const turn = { message, pageState, tools, calls: [], budget: { maxCalls: 4 } };`],
      ['Implemente observar, decidir, agir', 'O loop alterna observação estruturada, decisão do modelo e execução controlada até atingir um terminal.', 'Separar fases facilita teste e evita recursão sem limite.', ['observe', 'decide', 'act', 'terminal'], `while (!turn.done && turn.calls.length < turn.budget.maxCalls) {
  turn.next = await decide(observe(turn));
  await act(turn.next, turn);
}`],
      ['Gerencie múltiplas chamadas', 'Uma tarefa pode exigir busca, detalhe e ação, com resultados alimentando decisões posteriores.', 'O runtime precisa preservar dependências sem deixar o modelo inventar um ID intermediário.', ['dependency', 'result binding', 'sequence', 'parallel safety'], `const courseId = calls.buscar_cursos.output.items[0].id;
await propose("consultar_curso", { courseId });`],
      ['Interrompa para o humano', 'Ambiguidade, alto risco ou mudança material de plano cria um ponto de confirmação.', 'A pausa mantém agência humana sem quebrar a continuidade do turno.', ['human in the loop', 'ambiguity', 'risk', 'resume token'], `return pause({ reason: "MULTIPLE_MATCHES", choices, resumeToken });`],
      ['Responda com evidência', 'A resposta distingue o que foi observado, o que foi executado e o que ainda depende do usuário.', 'Transparência reduz falsas afirmações de sucesso e melhora confiança.', ['grounding', 'executed effects', 'pending action', 'citation'], `return answer({ found: 3, executed: [], pending: "escolha um curso", evidence: trace.links });`],
      ['Avalie a conversa completa', 'O teste mede conclusão, tool correta, passos, segurança, recuperação e qualidade da resposta.', 'Avaliar apenas o texto final esconde chamadas desnecessárias ou perigosas.', ['task success', 'tool accuracy', 'step count', 'safety'], `score = success * 40 + correctTools * 25 + safety * 25 + clarity * 10;`]
    ]
  }
];

export const chapters = [
  { id: 'capitulo-1', number: '1', title: 'Núcleo do agente', status: 'disponivel', description: 'Quatro módulos para descobrir, executar, limitar e orquestrar tools.', modules: modules.map(module => ({ number: module.number, title: module.title, href: `curso/agent/modulo-${module.id}.html` })) },
  { id: 'capitulo-2', number: '2', title: 'Raciocínio e políticas', status: 'proximo', description: 'Seleção híbrida, roteamento, memória e políticas de ação.', modules: [{number:'2.1',title:'Roteamento híbrido'},{number:'2.2',title:'Memória de trabalho'},{number:'2.3',title:'Policy engine'},{number:'2.4',title:'Planos verificáveis'}] },
  { id: 'capitulo-3', number: '3', title: 'Adaptadores de modelos', status: 'proximo', description: 'Providers, schemas, streaming e portabilidade.', modules: [{number:'3.1',title:'Adapter de provider'},{number:'3.2',title:'Tool calling portátil'},{number:'3.3',title:'Streaming de execução'},{number:'3.4',title:'Fallback entre modelos'}] },
  { id: 'capitulo-4', number: '4', title: 'Entrega Agent Developer', status: 'proximo', description: 'Evals, UX conversacional, documentação e projeto aplicado.', modules: [{number:'4.1',title:'Dataset de tarefas'},{number:'4.2',title:'UX do agente'},{number:'4.3',title:'Handoff operacional'},{number:'4.4',title:'Projeto final Agent Developer'}] }
];
