(function () {
  'use strict';

  const sample = [
    {
      name: 'buscar_cursos',
      title: 'Buscar cursos',
      description: 'Busca cursos disponíveis por tema e nível sem alterar dados.',
      inputSchema: {
        type: 'object',
        properties: {
          tema: { type: 'string', minLength: 2, description: 'Tema principal desejado.' },
          nivel: { type: 'string', enum: ['iniciante', 'intermediario', 'avancado'], description: 'Nível atual da pessoa.' }
        },
        required: ['tema'],
        additionalProperties: false
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      executeBehavior: 'Consulta o catálogo, atualiza a lista visível e retorna cursos resumidos.',
      registration: { usesAbortSignal: true },
      risk: { level: 'low', effect: 'read', humanConfirmation: false },
      fallback: 'O mesmo filtro permanece disponível no formulário da página.',
      resultExample: { ok: true, total: 1, itens: [{ id: 'catalogo-integrado', status: 'disponivel' }] }
    },
    {
      name: 'consultar_disponibilidade',
      title: 'Consultar disponibilidade',
      description: 'Consulta vagas de uma turma específica e não cria matrícula.',
      inputSchema: {
        type: 'object',
        properties: {
          cursoId: { type: 'string', minLength: 1, description: 'Identificador estável do curso.' },
          turmaId: { type: 'string', minLength: 1, description: 'Identificador estável da turma.' }
        },
        required: ['cursoId', 'turmaId'],
        additionalProperties: false
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      executeBehavior: 'Consulta o backend com cancelamento, exibe vagas e retorna a evidência.',
      registration: { usesAbortSignal: true },
      risk: { level: 'low', effect: 'read', humanConfirmation: false },
      fallback: 'Link para a página pública da turma.',
      resultExample: { ok: true, turmaId: '2026-09', vagas: 12, consultadoEm: '2026-08-30T12:00:00Z' }
    }
  ];

  const $ = (id) => document.getElementById(id);
  const input = $('catalog-input');
  const findingsMount = $('findings');
  const summaryMount = $('tool-summary');
  let lastReport = null;

  function finding(level, scope, title, detail, fix, points, earned) {
    return { level, scope, title, detail, fix, points, earned };
  }

  function text(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function schemaChecks(tool, scope) {
    const out = [];
    const schema = tool.inputSchema;
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
      out.push(finding('fail', scope, 'inputSchema ausente ou inválido', 'O draft aceita inputSchema opcional, mas uma tool com parâmetros precisa declarar seu contrato.', 'Use um objeto JSON Schema com type: "object" e properties.', 18, 0));
      return out;
    }
    if (schema.type === 'object') out.push(finding('pass', scope, 'Schema raiz é object', 'A entrada possui uma forma previsível.', '', 5, 5));
    else out.push(finding('fail', scope, 'Schema raiz sem type object', 'A tool recebe argumentos nomeados, mas o schema raiz não declara object.', 'Defina inputSchema.type como "object".', 5, 0));

    const props = schema.properties;
    if (props && typeof props === 'object' && !Array.isArray(props) && Object.keys(props).length) {
      out.push(finding('pass', scope, 'Propriedades declaradas', `${Object.keys(props).length} parâmetro(s) encontrado(s).`, '', 5, 5));
      const missingDescriptions = Object.entries(props).filter(([, value]) => !value || !text(value.description)).map(([key]) => key);
      if (!missingDescriptions.length) out.push(finding('pass', scope, 'Parâmetros têm descrição', 'Todas as propriedades orientam a geração de argumentos.', '', 7, 7));
      else out.push(finding('warn', scope, 'Parâmetros sem descrição', `Sem descrição: ${missingDescriptions.join(', ')}.`, 'Explique significado, formato e unidade de cada parâmetro.', 7, Math.max(0, 7 - missingDescriptions.length * 2)));
    } else {
      out.push(finding('warn', scope, 'Schema sem propriedades', 'Isso é válido para uma ação sem entrada, mas deve ser intencional.', 'Adicione properties ou documente executeBehavior como ação sem parâmetros.', 5, 2));
    }

    const required = Array.isArray(schema.required) ? schema.required : [];
    const invalidRequired = required.filter(key => !props || !Object.prototype.hasOwnProperty.call(props, key));
    if (!invalidRequired.length) out.push(finding('pass', scope, 'required é coerente', required.length ? `${required.length} campo(s) obrigatório(s).` : 'Nenhum campo foi marcado como obrigatório.', '', 4, 4));
    else out.push(finding('fail', scope, 'required aponta para campo inexistente', invalidRequired.join(', '), 'Remova o nome ou crie a propriedade correspondente.', 4, 0));

    if (schema.additionalProperties === false) out.push(finding('pass', scope, 'Argumentos extras são bloqueados', 'O contrato rejeita chaves inesperadas.', '', 3, 3));
    else out.push(finding('info', scope, 'Argumentos extras estão abertos', 'Isso pode ser intencional, mas aumenta a superfície de entrada.', 'Considere additionalProperties: false e valide novamente no execute.', 3, 1));
    return out;
  }

  function toolChecks(tool, index, allNames) {
    const scope = text(tool.name) || `tool #${index + 1}`;
    const out = [];
    const name = text(tool.name);
    if (name) out.push(finding('pass', scope, 'Nome presente', `Identificador: ${name}.`, '', 5, 5));
    else out.push(finding('fail', scope, 'Nome obrigatório ausente', 'registerTool rejeita nome vazio.', 'Defina um identificador único e estável.', 5, 0));
    if (name && /^[a-z][a-z0-9_\-]*$/.test(name)) out.push(finding('pass', scope, 'Nome previsível', 'O identificador é simples para logs e chamadas.', '', 2, 2));
    else if (name) out.push(finding('warn', scope, 'Convenção de nome inconsistente', 'A especificação exige apenas string não vazia; esta é uma recomendação de qualidade.', 'Prefira minúsculas com underscore ou hífen.', 2, 1));
    if (name && allNames.filter(x => x === name).length > 1) out.push(finding('fail', scope, 'Nome duplicado', 'O mesmo catálogo registra duas tools com o mesmo nome.', 'Torne cada responsabilidade e nome únicos.', 5, 0));
    else out.push(finding('pass', scope, 'Nome único no catálogo', 'Nenhuma colisão foi encontrada.', '', 5, 5));

    const description = text(tool.description);
    if (description.length >= 35) out.push(finding('pass', scope, 'Descrição orienta a escolha', description, '', 9, 9));
    else if (description) out.push(finding('warn', scope, 'Descrição curta demais', description, 'Explique o que faz, quando usar e o efeito produzido.', 9, 4));
    else out.push(finding('fail', scope, 'Descrição obrigatória ausente', 'registerTool rejeita descrição vazia.', 'Escreva uma descrição operacional e específica.', 9, 0));

    if (text(tool.title)) out.push(finding('pass', scope, 'Título humano presente', tool.title, '', 3, 3));
    else out.push(finding('info', scope, 'Título humano ausente', 'title é opcional no draft, mas melhora interfaces nativas.', 'Inclua um título localizado para exibição.', 3, 1));
    out.push(...schemaChecks(tool, scope));

    const annotations = tool.annotations;
    if (annotations && typeof annotations.readOnlyHint === 'boolean' && typeof annotations.untrustedContentHint === 'boolean') out.push(finding('pass', scope, 'Annotations explícitas', 'readOnlyHint e untrustedContentHint foram declarados.', '', 6, 6));
    else out.push(finding('warn', scope, 'Annotations incompletas', 'Hints ajudam agentes e revisores, mas não são autorização.', 'Declare os dois booleanos de acordo com o comportamento real.', 6, 2));

    if (text(tool.executeBehavior).length >= 30) out.push(finding('pass', scope, 'Execução documentada', tool.executeBehavior, '', 7, 7));
    else out.push(finding('warn', scope, 'Comportamento de execute pouco auditável', 'JSON não carrega funções; precisamos de uma descrição do efeito.', 'Descreva consulta/mutação, atualização da UI, backend e erros.', 7, 2));

    if (tool.registration && tool.registration.usesAbortSignal === true) out.push(finding('pass', scope, 'Ciclo de vida cancelável', 'O descritor declara uso de AbortSignal no registro.', '', 6, 6));
    else out.push(finding('warn', scope, 'Sem evidência de AbortSignal', 'A tool pode permanecer registrada após o estado que a originou.', 'Registre com { signal } e aborte ao desmontar ou mudar de contexto.', 6, 1));

    const risk = tool.risk || {};
    if (['low', 'medium', 'high'].includes(risk.level) && ['read', 'write'].includes(risk.effect)) out.push(finding('pass', scope, 'Risco classificado', `${risk.level} · ${risk.effect}.`, '', 6, 6));
    else out.push(finding('warn', scope, 'Risco não classificado', 'A especificação não exige este campo; produção segura exige análise equivalente.', 'Declare level e effect no registro de governança do catálogo.', 6, 1));
    if (risk.effect === 'write' && risk.humanConfirmation !== true) out.push(finding('fail', scope, 'Mutação sem confirmação humana', 'O descritor indica escrita, mas não registra confirmação.', 'Use fluxo preparar → mostrar → confirmar antes do efeito.', 7, 0));
    else out.push(finding('pass', scope, 'Confirmação coerente com o efeito', risk.effect === 'write' ? 'Mutação exige confirmação.' : 'Consulta não força confirmação.', '', 7, 7));

    if (tool.resultExample && typeof tool.resultExample === 'object') out.push(finding('pass', scope, 'Exemplo de resultado estruturado', 'Existe evidência do shape devolvido ao agente.', '', 7, 7));
    else out.push(finding('warn', scope, 'Sem exemplo de resultado', 'Não é possível avaliar se a saída é verificável.', 'Inclua um resultExample pequeno, sem dados pessoais.', 7, 1));
    if (text(tool.fallback).length >= 20) out.push(finding('pass', scope, 'Fallback documentado', tool.fallback, '', 5, 5));
    else out.push(finding('warn', scope, 'Fallback ausente', 'A jornada pode falhar em navegadores sem WebMCP.', 'Mantenha formulário, link ou ação manual equivalente.', 5, 1));
    return out;
  }

  function analyze(value) {
    const tools = Array.isArray(value) ? value : (value && Array.isArray(value.tools) ? value.tools : null);
    if (!tools) throw new Error('Use um array de tools ou um objeto com a propriedade "tools".');
    if (!tools.length) throw new Error('O catálogo está vazio. Inclua ao menos uma tool.');
    if (tools.some(tool => !tool || typeof tool !== 'object' || Array.isArray(tool))) throw new Error('Cada item do catálogo precisa ser um objeto.');
    const names = tools.map(tool => text(tool.name));
    const findings = tools.flatMap((tool, index) => toolChecks(tool, index, names));
    const possible = findings.reduce((sum, item) => sum + item.points, 0);
    const earned = findings.reduce((sum, item) => sum + item.earned, 0);
    const score = Math.round((earned / possible) * 100);
    return { schemaVersion: 1, generatedAt: new Date().toISOString(), score, toolCount: tools.length, findings, tools: tools.map(tool => ({ name: text(tool.name) || '(sem nome)', description: text(tool.description) })) };
  }

  function make(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content != null) node.textContent = content;
    return node;
  }

  function render(report) {
    lastReport = report;
    const counts = report.findings.reduce((acc, item) => { acc[item.level] = (acc[item.level] || 0) + 1; return acc; }, {});
    $('score-value').textContent = String(report.score);
    $('score-gauge').style.setProperty('--score', String(report.score));
    $('score-gauge').style.setProperty('--gauge-color', report.score >= 80 ? '#34d399' : report.score >= 55 ? '#fbbf24' : '#f87171');
    $('score-label').textContent = report.score >= 80 ? 'Catálogo consistente' : report.score >= 55 ? 'Catálogo precisa de revisão' : 'Catálogo ainda não está pronto';
    $('score-summary').textContent = `${report.toolCount} tool(s), ${counts.fail || 0} falha(s) e ${counts.warn || 0} atenção(ões). Priorize as falhas antes de testar no navegador.`;
    $('count-pass').textContent = String(counts.pass || 0);
    $('count-warn').textContent = String((counts.warn || 0) + (counts.info || 0));
    $('count-fail').textContent = String(counts.fail || 0);
    $('parse-status').textContent = 'JSON válido · relatório atualizado';
    $('parse-status').className = 'text-xs text-emerald-400';

    summaryMount.replaceChildren();
    report.tools.forEach((tool, index) => {
      const card = make('div', 'bg-dark-800 border border-dark-600 rounded-xl p-5');
      card.append(make('p', 'text-xs text-emerald-400 font-semibold', `TOOL ${index + 1}`));
      card.append(make('h3', 'font-bold mt-1', tool.name));
      card.append(make('p', 'text-sm text-neutral-400 mt-2', tool.description || 'Sem descrição.'));
      summaryMount.append(card);
    });

    findingsMount.replaceChildren();
    const order = { fail: 0, warn: 1, info: 2, pass: 3 };
    report.findings.slice().sort((a, b) => order[a.level] - order[b.level]).forEach(item => {
      const card = make('article', 'finding-card bg-dark-800 border border-dark-600 rounded-xl p-5');
      card.dataset.level = item.level;
      const row = make('div', 'flex items-start justify-between gap-4');
      const body = make('div');
      body.append(make('p', `text-xs font-semibold ${item.level === 'fail' ? 'text-red-400' : item.level === 'warn' ? 'text-primary' : item.level === 'pass' ? 'text-emerald-400' : 'text-sky-400'}`, `${item.level.toUpperCase()} · ${item.scope}`));
      body.append(make('h3', 'font-bold mt-1', item.title));
      body.append(make('p', 'text-sm text-neutral-400 mt-2', item.detail));
      if (item.fix) body.append(make('p', 'text-sm text-neutral-300 mt-3', `Ajuste: ${item.fix}`));
      row.append(body, make('span', 'text-xs text-neutral-500 flex-shrink-0', `${item.earned}/${item.points}`));
      card.append(row);
      findingsMount.append(card);
    });

    const actions = make('div', 'flex justify-start flex-wrap gap-3 pt-3');
    const download = make('button', 'px-4 py-2 rounded-lg bg-dark-700 hover:bg-dark-600', 'Baixar relatório JSON');
    download.type = 'button';
    download.addEventListener('click', downloadReport);
    const copy = make('button', 'px-4 py-2 rounded-lg border border-dark-600 hover:bg-dark-700', 'Copiar plano de correção');
    copy.type = 'button';
    copy.addEventListener('click', copyPlan);
    actions.append(download, copy);
    findingsMount.prepend(actions);
  }

  function downloadReport() {
    if (!lastReport) return;
    const blob = new Blob([JSON.stringify(lastReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `webmcp-agent-diagnostico-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyPlan() {
    if (!lastReport) return;
    const important = lastReport.findings.filter(item => item.level === 'fail' || item.level === 'warn');
    const plan = important.map((item, index) => `${index + 1}. [${item.scope}] ${item.title}\n   ${item.fix || item.detail}`).join('\n');
    try { await navigator.clipboard.writeText(plan || 'Nenhuma correção prioritária.'); }
    catch (_) {
      const area = document.createElement('textarea'); area.value = plan; document.body.append(area); area.select(); document.execCommand('copy'); area.remove();
    }
    $('parse-status').textContent = 'Plano copiado';
  }

  function run() {
    try {
      const parsed = JSON.parse(input.value);
      render(analyze(parsed));
    } catch (error) {
      $('parse-status').textContent = error.message;
      $('parse-status').className = 'text-xs text-red-400';
      findingsMount.replaceChildren(make('div', 'bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-red-100', `Não foi possível analisar: ${error.message}`));
    }
  }

  $('load-example').addEventListener('click', () => { input.value = JSON.stringify(sample, null, 2); run(); });
  $('run-validator').addEventListener('click', run);
  $('clear-validator').addEventListener('click', () => { input.value = ''; lastReport = null; $('parse-status').textContent = 'Aguardando análise'; findingsMount.replaceChildren(make('div', 'bg-dark-800 border border-dark-600 rounded-xl p-6 text-neutral-400', 'Os achados aparecerão aqui, priorizados por impacto.')); summaryMount.replaceChildren(); });
  input.value = JSON.stringify(sample, null, 2);
})();
