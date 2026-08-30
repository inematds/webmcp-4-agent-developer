const esc = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const header = (module, topic, index, accent) => `
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
  <div class="flex items-center gap-4 min-w-0">
    <span class="flex items-center justify-center w-12 h-12 rounded-full bg-${accent}-500/20 text-${accent}-400 font-bold text-xl flex-shrink-0">${index + 1}</span>
    <h2 class="text-2xl font-bold">${topic[0]}</h2>
  </div>
  <button type="button" data-inema-doubt-toggle aria-pressed="false" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-700 border border-dark-600 text-neutral-300 self-start">
    <span aria-hidden="true">?</span>
    <span>Tenho dúvida</span>
  </button>
</div>`;

const concepts = (items, accent) => `
<div>
  <h3 class="font-semibold text-${accent}-400">Conceitos-chave</h3>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
    ${items.map((item, index) => `
    <div class="bg-dark-700/60 border border-dark-600 rounded-lg p-4">
      <strong class="text-${accent}-400 text-xs">0${index + 1}</strong>
      <p class="text-sm text-neutral-300 mt-2">${item}</p>
    </div>`).join('')}
  </div>
</div>`;

const footer = (items, accent) => `
${concepts(items, accent)}
<div class="flex justify-start mt-7">
  <button type="button" data-inema-read-toggle aria-pressed="false" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-${accent}-500/20 border border-${accent}-500/30 text-${accent}-400 hover:bg-${accent}-500/30">
    <span class="inema-read-icon" aria-hidden="true">○</span>
    <span data-inema-read-label>Marcar como lido</span>
  </button>
</div>`;

const hero = (module, accent, hex, darkHex, prefix) => `
<div class="rounded-2xl border border-${accent}-500/30 bg-dark-900/40 p-4 mb-7 overflow-hidden">
  <svg viewBox="0 0 1000 300" class="w-full h-auto" role="img" aria-label="Fluxo de ${module.svg.join(' para ')}">
    <defs>
      <filter id="${prefix}-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.8" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <marker id="${prefix}-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
        <path d="M0,0 L8,4.5 L0,9 L2.4,4.5 Z" fill="#38bdf8"/>
      </marker>
      <pattern id="${prefix}-grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="1.2" cy="1.2" r="1.2" fill="${hex}" opacity=".12"/>
      </pattern>
    </defs>
    <rect width="1000" height="300" fill="url(#${prefix}-grid)"/>
    <g fill="none" stroke="#38bdf8" stroke-width="1.8" opacity=".62" marker-end="url(#${prefix}-arrow)">
      <path d="M270 150 H380"/>
      <path d="M620 150 H730"/>
    </g>
    <g>
      <rect x="40" y="105" width="230" height="90" rx="14" fill="${darkHex}" stroke="${hex}" stroke-width="2"/>
      <text x="155" y="143" text-anchor="middle" fill="${hex}" font-family="Inter,sans-serif" font-weight="600" font-size="18">${module.svg[0]}</text>
      <text x="155" y="170" text-anchor="middle" fill="#d1d5db" font-family="Inter,sans-serif" font-size="13">estado de partida</text>
    </g>
    <g filter="url(#${prefix}-glow)">
      <rect x="380" y="95" width="240" height="110" rx="14" fill="${darkHex}" stroke="${hex}" stroke-width="2"/>
    </g>
    <text x="500" y="143" text-anchor="middle" fill="${hex}" font-family="Inter,sans-serif" font-weight="600" font-size="18">${module.svg[1]}</text>
    <text x="500" y="170" text-anchor="middle" fill="#d1d5db" font-family="Inter,sans-serif" font-size="13">decisão observável</text>
    <g>
      <rect x="730" y="105" width="230" height="90" rx="14" fill="#0e1b26" stroke="#38bdf8" stroke-width="2"/>
      <text x="845" y="143" text-anchor="middle" fill="#9ad6ff" font-family="Inter,sans-serif" font-weight="600" font-size="18">${module.svg[2]}</text>
      <text x="845" y="170" text-anchor="middle" fill="#bfe6ff" font-family="Inter,sans-serif" font-size="13">resultado verificável</text>
    </g>
  </svg>
</div>`;

function visual(index, module, topic, accent, palette) {
  const [title, what, why, keys, code] = topic;
  if (index === 0) return `
${hero(module, accent, palette.hex, palette.dark, `m${module.id.replace('-', '')}`)}
<div class="grid md:grid-cols-2 gap-6 mb-6">
  <div class="bg-${accent}-900/20 border border-${accent}-500/30 rounded-xl p-6">
    <h3 class="font-semibold text-${accent}-400">Antes de modelar</h3>
    <p class="text-neutral-300 mt-3">Escreva o pedido da pessoa, o estado atual e a evidência que provará conclusão.</p>
  </div>
  <div class="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
    <h3 class="font-semibold text-red-400">Erro de partida</h3>
    <p class="text-neutral-300 mt-3">Começar pelo nome de uma função ou por um botão produz uma tool sem objetivo humano claro.</p>
  </div>
</div>
<div class="bg-primary/10 border border-primary/30 rounded-xl p-6 mb-6">
  <h3 class="font-semibold text-primary">Preveja antes de abrir o código</h3>
  <p class="text-neutral-300 mt-3">Qual informação muda a decisão? Qual efeito precisa aparecer na interface? Responda antes de implementar.</p>
</div>`;
  if (index === 1) return `
<div class="overflow-x-auto border border-dark-600 rounded-xl mb-6">
  <table class="w-full text-left text-sm min-w-[700px]">
    <thead class="bg-dark-700">
      <tr><th class="p-4">Pergunta</th><th class="p-4">Contrato forte</th><th class="p-4">Contrato fraco</th></tr>
    </thead>
    <tbody class="divide-y divide-dark-600">
      <tr><th class="p-4">Quando usar?</th><td class="p-4">A descrição nomeia intenção e contexto.</td><td class="p-4">“Faz coisas” ou “gerencia”.</td></tr>
      <tr><th class="p-4">O que recebe?</th><td class="p-4">Somente dados necessários.</td><td class="p-4">Objeto genérico e ilimitado.</td></tr>
      <tr><th class="p-4">O que devolve?</th><td class="p-4">Estado e próxima ação verificáveis.</td><td class="p-4">Texto sem protocolo.</td></tr>
      <tr><th class="p-4">Como falha?</th><td class="p-4">Código, motivo e recuperação.</td><td class="p-4">Exceção opaca.</td></tr>
    </tbody>
  </table>
</div>
<div class="grid md:grid-cols-2 gap-6 mb-6">
  <div class="bg-${accent}-900/20 border border-${accent}-500/30 rounded-xl p-6">
    <h3 class="font-semibold text-${accent}-400">Faça</h3>
    <ul class="mt-4 space-y-2 text-neutral-300"><li>✓ Use verbos específicos.</li><li>✓ Delimite entradas.</li><li>✓ Declare a evidência.</li></ul>
  </div>
  <div class="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
    <h3 class="font-semibold text-red-400">Evite</h3>
    <ul class="mt-4 space-y-2 text-neutral-300"><li>✗ Misturar intenções.</li><li>✗ Aceitar qualquer objeto.</li><li>✗ Esconder efeitos.</li></ul>
  </div>
</div>`;
  if (index === 2) return `
<div class="space-y-4 mb-6">
  <div class="flex items-start gap-4">
    <div class="w-10 h-10 rounded-full bg-${accent}-500/20 text-${accent}-400 flex items-center justify-center font-bold flex-shrink-0">1</div>
    <div class="flex-1 bg-dark-800 border border-dark-600 rounded-xl p-5"><h3 class="font-semibold">Observe</h3><p class="text-sm text-neutral-400 mt-2">Capture estado, entrada e contexto antes da ação.</p></div>
  </div>
  <div class="flex items-start gap-4">
    <div class="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold flex-shrink-0">2</div>
    <div class="flex-1 bg-dark-800 border border-dark-600 rounded-xl p-5"><h3 class="font-semibold">Decida</h3><p class="text-sm text-neutral-400 mt-2">Valide pré-condições e escolha a transição permitida.</p></div>
  </div>
  <div class="flex items-start gap-4">
    <div class="w-10 h-10 rounded-full bg-${accent}-500/20 text-${accent}-400 flex items-center justify-center font-bold flex-shrink-0">3</div>
    <div class="flex-1 bg-dark-800 border border-dark-600 rounded-xl p-5"><h3 class="font-semibold">Execute</h3><p class="text-sm text-neutral-400 mt-2">Aplique a regra compartilhada e respeite cancelamento.</p></div>
  </div>
  <div class="flex items-start gap-4">
    <div class="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold flex-shrink-0">4</div>
    <div class="flex-1 bg-dark-800 border border-dark-600 rounded-xl p-5"><h3 class="font-semibold">Prove</h3><p class="text-sm text-neutral-400 mt-2">Atualize a interface e devolva resultado estruturado.</p></div>
  </div>
</div>
<div class="bg-primary/10 border border-primary/30 rounded-xl p-6 mb-6">
  <h3 class="font-semibold text-primary">Ponto de controle</h3>
  <p class="text-neutral-300 mt-3">Se a etapa 2 reprovar, a tool não tenta “dar um jeito”: ela devolve uma recuperação explícita.</p>
</div>`;
  if (index === 3) return `
<div class="grid lg:grid-cols-[1.1fr_.9fr] gap-6 mb-6">
  <div class="min-w-0">
    <p class="text-xs text-${accent}-400 font-semibold mb-3">CÓDIGO DE REFERÊNCIA</p>
    <pre class="code-shell"><code>${esc(code)}</code></pre>
  </div>
  <div class="space-y-3 min-w-0">
    <div class="bg-dark-800 border border-dark-600 rounded-xl p-5"><strong class="text-${accent}-400">Entrada</strong><p class="text-sm text-neutral-400 mt-2">É pequena, descrita e validável.</p></div>
    <div class="bg-dark-800 border border-dark-600 rounded-xl p-5"><strong class="text-sky-400">Execução</strong><p class="text-sm text-neutral-400 mt-2">Reutiliza a regra real da aplicação.</p></div>
    <div class="bg-dark-800 border border-dark-600 rounded-xl p-5"><strong class="text-${accent}-400">Saída</strong><p class="text-sm text-neutral-400 mt-2">Permite verificar efeito e continuar.</p></div>
  </div>
</div>
<div class="bg-primary/10 border border-primary/30 rounded-xl p-6 mb-6">
  <h3 class="font-semibold text-primary">Leia o código como contrato</h3>
  <p class="text-neutral-300 mt-3">Sublinhe onde a entrada é validada, onde o efeito acontece, onde o cancelamento chega e onde a UI é atualizada.</p>
</div>`;
  if (index === 4) return `
<div class="grid md:grid-cols-2 gap-6 mb-6">
  <div class="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
    <h3 class="font-semibold text-red-400">Falha provocada</h3>
    <p class="text-neutral-300 mt-3">Execute o cenário com estado ausente, entrada inválida ou capacidade indisponível.</p>
  </div>
  <div class="bg-${accent}-900/20 border border-${accent}-500/30 rounded-xl p-6">
    <h3 class="font-semibold text-${accent}-400">Recuperação esperada</h3>
    <p class="text-neutral-300 mt-3">A resposta informa o que falhou, o que permanece seguro e qual ação pode continuar.</p>
  </div>
</div>
<div class="bg-dark-800 border border-dark-600 rounded-xl p-6 mb-6">
  <h3 class="font-semibold">Matriz mínima de teste</h3>
  <div class="grid sm:grid-cols-2 gap-4 mt-4 text-sm text-neutral-300">
    <p>✓ caminho feliz reproduzível</p>
    <p>✓ entrada inválida acionável</p>
    <p>✓ cancelamento encerra trabalho</p>
    <p>✓ fallback preserva a jornada</p>
    <p>✓ interface reflete o estado</p>
    <p>✓ backend mantém autorização</p>
  </div>
</div>`;
  return `
<div class="bg-dark-800 border border-dark-600 rounded-xl p-6 mb-6">
  <h3 class="text-xl font-bold">Exercício de síntese</h3>
  <ol class="mt-4 space-y-3 text-neutral-300">
    <li><strong class="text-${accent}-400">1.</strong> Explique o problema sem usar o nome da tecnologia.</li>
    <li><strong class="text-${accent}-400">2.</strong> Desenhe o estado anterior e posterior.</li>
    <li><strong class="text-${accent}-400">3.</strong> Implemente a menor prova funcional.</li>
    <li><strong class="text-${accent}-400">4.</strong> Provoque uma falha e registre a recuperação.</li>
    <li><strong class="text-${accent}-400">5.</strong> Entregue código, evidência e uma limitação conhecida.</li>
  </ol>
</div>
<div class="bg-${accent}-900/20 border border-${accent}-500/30 rounded-xl p-6 mb-6">
  <h3 class="text-xl font-bold text-${accent}-400">Desafio do módulo</h3>
  <p class="text-neutral-300 mt-3">${module.lab}</p>
</div>
<div class="bg-primary/10 border border-primary/30 rounded-xl p-6 mb-6">
  <h3 class="font-semibold text-primary">Critério de Agent Developer responsável</h3>
  <p class="text-neutral-300 mt-3">A entrega precisa funcionar, explicar seus limites e preservar o caminho humano quando a capacidade experimental não existir.</p>
</div>`;
}

export function renderDeepModule(module, accent, palette) {
  return module.topics.map((topic, index) => {
    const [title, what, why, keys, code] = topic;
    const codeBlock = index === 3 ? '' : `
  <pre class="code-shell mb-6"><code>${esc(code)}</code></pre>`;
    return `
<section id="topico-${index + 1}" data-inema-topic="modulo-${module.id}#topico-${index + 1}" class="mb-16">
  ${header(module, topic, index, accent)}
  <div class="inema-prose">
    <p data-inema-block="m${module.id}-t${index + 1}-p1" class="text-neutral-300 mb-5 leading-relaxed"><strong class="text-${accent}-400">O que é:</strong> ${what}</p>
    <p data-inema-block="m${module.id}-t${index + 1}-p2" class="text-neutral-300 mb-6 leading-relaxed"><strong class="text-${accent}-400">Por que aprender:</strong> ${why}</p>
  </div>
  ${visual(index, module, topic, accent, palette)}
  ${codeBlock}
  <details class="bg-dark-800 border border-dark-600 rounded-xl p-6 mb-6">
    <summary class="font-semibold text-sky-400 cursor-pointer">Indo mais fundo: evidência que vale guardar</summary>
    <div class="mt-4 space-y-3 text-sm text-neutral-300">
      <p data-inema-block="m${module.id}-t${index + 1}-p3">Registre a entrada, o estado anterior, a decisão tomada, o resultado e a alteração visível da página.</p>
      <p data-inema-block="m${module.id}-t${index + 1}-p4">Inclua também uma falha provocada e o comportamento observado sem suporte WebMCP.</p>
    </div>
  </details>
  ${footer(keys, accent)}
</section>`;
  }).join('\n');
}
