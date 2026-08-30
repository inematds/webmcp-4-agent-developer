import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { course, modules, chapters } from './course-data.mjs';
import { renderDeepModule } from './deep-content.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'curso/agent');
mkdirSync(outDir, { recursive: true });

const manifest = {
  course: 'webmcp-zero-expert',
  tracks: [
    { n: '3', title: 'WebMCP Agent Developer', modules: modules.map(m => ({ id: m.id, title: m.title, topics: 6, href: `https://inematds.github.io/webmcp-4-agent-developer/curso/agent/modulo-${m.id}.html` })) }
  ]
};

const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const relFor = depth => typeof depth === 'string' ? depth : (depth === 0 ? '.' : '../..');
const manifestBlock = () => `<script type="application/json" data-inema-manifest>\n${JSON.stringify(manifest, null, 2)}\n</script>`;

function head({ title, description, depth = 0 }) {
  const rel = relFor(depth);
  return `<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <meta name="inema-course" content="webmcp-zero-expert">
  <script>
    (function(){try{var h=document.documentElement,p=JSON.parse(localStorage.getItem('inema.prefs')||'{}'),t=p.theme||(localStorage.getItem('theme')==='light'?'claro':'inema-dark');if(t==='claro'||t==='sepia')h.classList.remove('dark');else h.classList.add('dark');if(['sepia','foco','contraste'].includes(t))h.setAttribute('data-theme',t);else h.removeAttribute('data-theme');if(p.fontScale)h.style.fontSize=p.fontScale+'%';}catch(e){document.documentElement.classList.add('dark')}})();
  </script>
  <title>${title} | WebMCP Agent Developer</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={darkMode:'class',theme:{extend:{colors:{primary:'#FACC15',dark:{900:'#111827',800:'#1f2937',700:'#374151',600:'#4b5563'}}}}};</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="icon" href="${rel}/favicon.svg" type="image/svg+xml">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${rel}/assets/site.css">
  <link rel="stylesheet" href="${rel}/assets/learn.css">
  ${manifestBlock()}
</head>`;
}

function nav(depth = 0) {
  const rel = relFor(depth);
  return `<a class="skip" href="#conteudo">Ir para o conteúdo</a>
<nav class="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-600" aria-label="Navegação principal">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center min-h-16 gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <a href="${rel}/index.html" class="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 flex-shrink-0" aria-label="WebMCP Agent Developer — início">
          <span class="text-2xl" aria-hidden="true">⬡</span><span class="font-bold hidden sm:inline">WebMCP Agent Developer</span><span class="font-bold sm:hidden">W4</span>
        </a>
        <span class="text-neutral-600 hidden sm:inline">|</span>
        <a href="https://inema.club" target="_blank" rel="noreferrer" class="text-sky-400 hover:text-sky-300 text-sm font-medium hidden sm:inline">INEMA.CLUB</a>
      </div>
      <div class="flex items-center gap-1">
        <div class="hidden lg:flex items-center gap-1">
          ${chapters.map((chapter, index) => `<a class="phase-chip px-2.5 py-1.5 rounded-lg text-sm ${index === 0 ? 'font-semibold' : 'text-neutral-400 hover:text-purple-400'}" ${index === 0 ? 'aria-current="page"' : ''} href="${rel}/index.html#${chapter.id}">Cap. ${chapter.number}<span class="hidden xl:inline"> · ${chapter.title.split(' ')[0]}</span></a>`).join('\n          ')}
          <a class="phase-chip px-2.5 py-1.5 rounded-lg text-sm text-sky-400 hover:text-sky-300" href="${rel}/labs/validador-tools.html">Laboratórios</a>
        </div>
        <button type="button" data-inema-journey-open class="p-2 rounded-lg text-neutral-300 hover:bg-dark-700" aria-label="Abrir minha jornada"><span aria-hidden="true">◷</span><span data-inema-journey-badge class="inema-journey-badge" data-count="0"></span></button>
        <div class="relative">
          <button type="button" data-inema-appearance-toggle="[data-inema-appearance]" aria-expanded="false" class="p-2 rounded-lg bg-dark-700 hover:bg-dark-600" aria-label="Ajustar aparência">◑</button>
          <div data-inema-appearance class="inema-appearance-pop right-0 mt-3">
            <p class="text-sm font-semibold mb-2">Tema</p>
            <div class="inema-segment"><button data-inema-set-theme="inema-dark">Escuro</button><button data-inema-set-theme="claro">Claro</button><button data-inema-set-theme="sepia">Sépia</button><button data-inema-set-theme="foco">Foco</button><button data-inema-set-theme="contraste">Contraste</button></div>
            <p class="text-sm font-semibold mt-4 mb-2">Tamanho</p>
            <div class="inema-segment"><button data-inema-set-fontscale="100">A</button><button data-inema-set-fontscale="112">A+</button><button data-inema-set-fontscale="125">A++</button></div>
          </div>
        </div>
        <button id="theme-toggle" class="p-2 rounded-lg bg-dark-700 hover:bg-dark-600" aria-label="Alternar tema claro e escuro">
          <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5 text-neutral-300" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
          <svg id="theme-toggle-light-icon" class="hidden w-5 h-5 text-neutral-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        </button>
      </div>
    </div>
    <div class="lg:hidden flex items-center gap-1 overflow-x-auto pb-2" aria-label="Capítulos do WebMCP Agent Developer">
      ${chapters.map((chapter, index) => `<a class="phase-chip flex-shrink-0 px-3 py-2 rounded-lg text-xs ${index === 0 ? 'font-semibold' : 'text-neutral-400 hover:text-purple-400'}" ${index === 0 ? 'aria-current="page"' : ''} href="${rel}/index.html#${chapter.id}">Cap. ${chapter.number}</a>`).join('\n      ')}
      <a class="phase-chip flex-shrink-0 px-3 py-2 rounded-lg text-xs text-sky-400" href="${rel}/labs/validador-tools.html">Labs</a>
    </div>
  </div>
</nav>`;
}

function heroSvg(labels, prefix) {
  return `<div class="rounded-2xl border border-purple-500/30 bg-dark-900/40 p-4 overflow-hidden">
  <svg viewBox="0 0 900 260" class="w-full h-auto" role="img" aria-label="Fluxo ${labels.join(' para ')}">
    <defs>
      <linearGradient id="${prefix}-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c084fc"/><stop offset="1" stop-color="#3b82f6"/></linearGradient>
      <filter id="${prefix}-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <pattern id="${prefix}-grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r="1.2" fill="#c084fc" opacity=".12"/></pattern>
      <marker id="${prefix}-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L8,4.5 L0,9 L2.4,4.5 Z" fill="#38bdf8"/></marker>
    </defs>
    <rect width="900" height="260" fill="url(#${prefix}-grid)"/>
    <path d="M250 130 H365 M535 130 H650" stroke="#38bdf8" stroke-width="1.8" opacity=".65" marker-end="url(#${prefix}-arrow)"/>
    <g><rect x="45" y="92" width="205" height="76" rx="14" fill="#1a1230" stroke="#c084fc" stroke-width="2"/><text x="147" y="125" text-anchor="middle" fill="#c084fc" font-family="Inter,sans-serif" font-size="17" font-weight="600">${labels[0]}</text><text x="147" y="148" text-anchor="middle" fill="#bfdbfe" font-family="Inter,sans-serif" font-size="12">entrada observável</text></g>
    <g filter="url(#${prefix}-glow)"><rect x="365" y="82" width="170" height="96" rx="14" fill="url(#${prefix}-grad)" stroke="#c084fc" stroke-width="2"/></g><text x="450" y="125" text-anchor="middle" fill="#06281d" font-family="Inter,sans-serif" font-size="17" font-weight="600">${labels[1]}</text><text x="450" y="149" text-anchor="middle" fill="#064e3b" font-family="Inter,sans-serif" font-size="12">contrato explícito</text>
    <g><rect x="650" y="92" width="205" height="76" rx="14" fill="#0e1b26" stroke="#38bdf8" stroke-width="2"/><text x="752" y="125" text-anchor="middle" fill="#9ad6ff" font-family="Inter,sans-serif" font-size="17" font-weight="600">${labels[2]}</text><text x="752" y="148" text-anchor="middle" fill="#bfe6ff" font-family="Inter,sans-serif" font-size="12">resultado verificável</text></g>
  </svg>
</div>`;
}

function scripts(depth = 0) {
  const rel = relFor(depth);
  return `<script>
function toggleTopic(button){const item=button.closest('.topic-item');const panel=item.querySelector('.topic-explanation');const card=button.closest('[data-inema-module]');card.querySelectorAll('.topic-explanation.active').forEach(x=>{if(x!==panel){x.classList.remove('active');const b=x.previousElementSibling;if(b)b.setAttribute('aria-expanded','false')}});panel.classList.toggle('active');button.setAttribute('aria-expanded',panel.classList.contains('active')?'true':'false')}
function openModal(id){const m=document.getElementById(id);if(m){m.classList.remove('hidden');document.body.style.overflow='hidden';m.querySelector('button')?.focus()}}
function closeModal(){document.querySelectorAll('.modal').forEach(m=>m.classList.add('hidden'));document.body.style.overflow='auto'}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
const tt=document.getElementById('theme-toggle'),di=document.getElementById('theme-toggle-dark-icon'),li=document.getElementById('theme-toggle-light-icon');function syncTheme(){if(document.documentElement.classList.contains('dark')){li?.classList.remove('hidden');di?.classList.add('hidden')}else{di?.classList.remove('hidden');li?.classList.add('hidden')}}syncTheme();tt?.addEventListener('click',()=>{const next=document.documentElement.classList.contains('dark')?'claro':'inema-dark';if(window.INEMA&&typeof window.INEMA.setPref==='function')window.INEMA.setPref('theme',next);else{document.documentElement.classList.toggle('dark');localStorage.setItem('theme',next==='claro'?'light':'dark')}syncTheme()});
</script>
<script src="${rel}/assets/learn.js"></script>
<script>if(window.INEMA&&typeof window.INEMA.init==='function')window.INEMA.init();</script>`;
}

function accordion(module, topic, i) {
  const [title, what, why, concepts] = topic;
  return `<div class="topic-item">
  <button type="button" onclick="toggleTopic(this)" aria-expanded="false" aria-controls="painel-${module.id}-${i + 1}" class="w-full px-6 py-4 flex items-start gap-3 hover:bg-dark-700/50 text-left">
    <span class="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold flex items-center justify-center flex-shrink-0">${i + 1}</span>
    <span class="text-lg" aria-hidden="true">${['🎯','🔍','🧩','🛡️','👤','✅'][i]}</span>
    <span><strong>${title}</strong><span class="text-neutral-500 text-sm ml-2">— ${concepts[0]}</span></span>
  </button>
  <div id="painel-${module.id}-${i + 1}" class="topic-explanation px-6 pb-5">
    <div class="bg-dark-700/50 rounded-lg p-5 space-y-4 ml-9">
      <div><span class="text-purple-400 font-semibold">O que é:</span><p class="text-neutral-300 text-sm mt-1">${what}</p></div>
      <div><span class="text-purple-400 font-semibold">Por que aprender:</span><p class="text-neutral-300 text-sm mt-1">${why}</p></div>
      <div><span class="text-purple-400 font-semibold">Conceitos-chave:</span><p class="text-neutral-300 text-sm mt-1">${concepts.join(' · ')}</p></div>
    </div>
  </div>
</div>`;
}

function indexPage() {
  const cards = modules.map(m => `<a href="#modulo-${m.id}" class="group bg-dark-800 rounded-xl border border-dark-600 hover:border-purple-500/30 p-5">
  <div class="flex items-center justify-between mb-2"><span class="text-purple-400 font-bold text-sm">${m.number}</span><span class="text-xs text-neutral-500">${m.duration}</span></div>
  <h3 class="font-semibold mb-1 group-hover:text-purple-400">${m.icon} ${m.title}</h3><p class="text-xs text-neutral-400">${m.promise}</p>
</a>`).join('\n');
  const details = modules.map(m => `<article id="modulo-${m.id}" data-inema-module="${m.id}" data-inema-track="3" class="bg-dark-800 rounded-xl border border-dark-600 mb-8 overflow-hidden">
  <header class="p-6 border-b border-dark-600">
    <div class="flex items-center justify-between mb-2"><span class="text-purple-400 font-bold">${m.number}</span><span class="text-xs text-neutral-500">${m.duration}</span></div>
    <h3 class="text-2xl font-bold mb-2">${m.icon} ${m.title}</h3><p class="text-neutral-400">${m.description}</p>
    <div data-inema-meter="modulo:${m.id}" class="inema-meter mt-4"><div class="flex justify-between gap-3 text-sm text-neutral-400 mb-2"><span data-inema-meter-frac>0 de 6</span><span data-inema-meter-pct>0%</span></div><div class="inema-bar"><div class="inema-bar__fill" data-inema-meter-fill></div></div></div>
  </header>
  <div class="divide-y divide-dark-600">${m.topics.map((t,i)=>accordion(m,t,i)).join('\n')}</div>
  <div class="p-4 bg-dark-700/30 flex justify-start flex-wrap gap-3">
    <button type="button" onclick="openModal('modal-${m.id}')" class="px-4 py-2 text-sm bg-dark-600 hover:bg-dark-700 rounded-lg">Ver em Modal</button>
    <a href="curso/agent/modulo-${m.id}.html" class="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-lg">Ver Completo</a>
  </div>
</article>`).join('\n');
  const modals = modules.map(m => `<div id="modal-${m.id}" class="modal hidden fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-black/80" role="dialog" aria-modal="true" aria-label="Módulo ${m.number}" onclick="if(event.target===this)closeModal()"><div class="bg-dark-800 rounded-xl w-full max-w-6xl h-[95vh] flex flex-col border border-dark-600"><div class="p-4 border-b border-dark-600 flex justify-between"><span><strong class="text-purple-400">${m.number}</strong> · ${m.title}</span><button type="button" onclick="closeModal()" class="text-2xl" aria-label="Fechar">&times;</button></div><iframe src="curso/agent/modulo-${m.id}.html" title="Módulo ${m.number}" class="flex-1 w-full rounded-b-xl"></iframe></div></div>`).join('\n');
  const chapterMap = chapters.map(chapter => `<article id="${chapter.id}" class="chapter-map bg-dark-800 border ${chapter.status === 'disponivel' ? 'border-purple-500/30' : 'border-dark-600'} rounded-xl p-6">
  <div class="flex flex-wrap items-start justify-between gap-4 mb-5"><div><p class="text-sm font-semibold ${chapter.status === 'disponivel' ? 'text-purple-400' : 'text-neutral-400'}">CAPÍTULO ${chapter.number}</p><h3 class="text-xl font-bold mt-1">${chapter.title}</h3><p class="text-sm text-neutral-400 mt-2 max-w-2xl">${chapter.description}</p></div><span class="px-3 py-1 rounded-full text-xs ${chapter.status === 'disponivel' ? 'bg-purple-500/20 text-purple-400' : 'bg-dark-700 text-neutral-400'}">${chapter.status === 'disponivel' ? 'Disponível' : 'Próximo'}</span></div>
  <ol class="grid sm:grid-cols-2 gap-3">${chapter.modules.map(item => `<li>${item.href ? `<a class="module-row flex gap-3 rounded-lg bg-dark-700/60 p-3 hover:bg-dark-700" href="${item.href}">` : '<div class="module-row flex gap-3 rounded-lg bg-dark-700/30 p-3">'}<strong class="text-purple-400 text-sm">${item.number}</strong><span class="text-sm text-neutral-300">${item.title}</span>${item.href ? '</a>' : '</div>'}</li>`).join('')}</ol>
</article>`).join('\n');
  return `${head({title:'Formação 4',description:'Formação prática WebMCP Agent Developer com quatro módulos, laboratórios e validador avançado de tools e schemas.'})}
<body class="bg-dark-900 text-neutral-100 min-h-screen">
${nav(0)}
<main id="conteudo">
  <header class="hero-shell agent-hero border-b border-dark-600">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-[.9fr_1.1fr] gap-12 items-center">
      <div><span class="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full mb-4">FORMAÇÃO 4 · FASE 3</span><h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">WebMCP Agent Developer</h1><p class="text-lg text-neutral-300 mt-5 leading-relaxed">Construa agentes de navegador que descobrem, selecionam e executam tools WebMCP com políticas, contexto e recuperação.</p><div class="flex justify-start flex-wrap gap-3 mt-7"><a href="#mapa" class="px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold">Começar a formação</a><a href="labs/validador-tools.html" class="px-5 py-3 rounded-lg border border-sky-500/30 text-sky-400 hover:bg-sky-500/10 font-semibold">Abrir console do agente</a></div></div>
      ${heroSvg(['Pedido humano','Page Agent','Tool + evidência'],'agent-hero')}
    </div>
  </header>
  <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"><div class="bg-dark-800 p-4 rounded-xl border border-dark-600"><strong class="text-2xl text-purple-400">4</strong><p class="text-sm text-neutral-400">Capítulos Agent Developer</p></div><div class="bg-dark-800 p-4 rounded-xl border border-dark-600"><strong class="text-2xl text-purple-400">4</strong><p class="text-sm text-neutral-400">Módulos disponíveis</p></div><div class="bg-dark-800 p-4 rounded-xl border border-dark-600"><strong class="text-2xl text-purple-400">24</strong><p class="text-sm text-neutral-400">Tópicos publicados</p></div><div class="bg-dark-800 p-4 rounded-xl border border-dark-600"><strong class="text-2xl text-purple-400">1</strong><p class="text-sm text-neutral-400">Laboratório</p></div></div>
    <div class="bg-dark-800 border border-purple-500/30 rounded-xl p-6 mb-12"><div class="flex flex-col md:flex-row md:items-center justify-between gap-5"><div><p class="text-xs text-purple-400 font-semibold">PROGRESSO COMPARTILHADO</p><h2 class="text-2xl font-bold mt-2">Sua jornada continua entre os repositórios</h2><p class="text-neutral-400 mt-2">O mesmo identificador da Formação 1 registra lidos, dúvidas e notas. No GitHub Pages, a origem é compartilhada; JSON mantém o fallback portátil.</p></div><div data-inema-meter="trilha:3" class="inema-meter min-w-64"><div class="flex justify-between gap-3 text-sm text-neutral-400 mb-2"><span data-inema-meter-frac>0 de 24</span><span data-inema-meter-pct>0%</span></div><div class="inema-bar"><div class="inema-bar__fill" data-inema-meter-fill></div></div></div></div></div>
    <section id="mapa" class="mb-12"><h2 class="text-2xl font-bold mb-2">Mapa da formação Agent Developer</h2><p class="text-neutral-400 mb-6">O topo navega por capítulos. Dentro de cada capítulo, os módulos seguem a numeração capítulo.módulo.</p><div class="grid lg:grid-cols-2 gap-5">${chapterMap}</div></section>
    <section class="mb-12"><h2 class="text-2xl font-bold mb-6">Capítulo 1 · módulos disponíveis</h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">${cards}</div></section>
    <section class="mb-12"><div class="bg-gradient-to-br from-purple-900/30 to-dark-800 border border-purple-500/30 rounded-xl p-6"><p class="text-xs text-purple-400 font-semibold">LABORATÓRIO TRANSVERSAL</p><h2 class="text-2xl font-bold mt-2">Console Page Agent</h2><p class="text-neutral-300 mt-3 max-w-3xl">Cole um catálogo em JSON e inspecione contrato, schema, risco e evidências antes de oferecê-lo ao modelo. O console é local e não executa efeitos reais.</p><div class="flex justify-start mt-5"><a href="labs/validador-tools.html" class="px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold">Inspecionar catálogo do agente</a></div></div></section>
    <h2 class="text-2xl font-bold mb-6">Conteúdo detalhado</h2>
    ${details}
    <section class="mt-14 bg-dark-800 border border-purple-500/30 rounded-xl p-8"><p class="text-purple-400 text-xs font-semibold">CONTINUIDADE DO AGENT DEVELOPER</p><h2 class="text-2xl font-bold mt-2">Próximo: raciocínio e políticas</h2><p class="text-neutral-300 mt-3">A formação continua nos capítulos 2, 3 e 4 com roteamento, adaptadores de modelos, evals e entrega de um agente completo.</p><div class="flex justify-start flex-wrap gap-3 mt-6"><button type="button" data-inema-journey-open class="px-5 py-3 rounded-lg bg-dark-700 hover:bg-dark-600">Salvar / exportar jornada</button><a href="#capitulo-2" class="px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white">Ver módulos do capítulo 2</a></div></section>
  </section>
</main>
${modals}
<footer class="border-t border-dark-600 py-8"><div class="max-w-6xl mx-auto px-4 text-sm text-neutral-500">WebMCP Agent Developer · INEMA · Conteúdo técnico baseado no draft oficial; verifique mudanças antes de produção.</div></footer>
${scripts(0)}
</body></html>`;
}

function conceptGrid(concepts) {
  return `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
${concepts.map((c,i)=>`  <div class="bg-dark-700/60 border border-dark-600 rounded-lg p-4"><span class="text-purple-400 text-xs font-bold">0${i+1}</span><p class="text-sm text-neutral-300 mt-2">${c}</p></div>`).join('\n')}
</div>`;
}

function comparison(topic, i) {
  const c = topic[3];
  return `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  <div class="bg-purple-900/20 rounded-xl border border-purple-500/30 p-6"><h3 class="font-bold text-purple-400 mb-4">✓ Faça</h3><ul class="space-y-3 text-neutral-300"><li>✓ Declare ${c[0]} de forma observável.</li><li>✓ Preserve ${c[1]} no fluxo manual.</li><li>✓ Teste o resultado e o cancelamento.</li></ul></div>
  <div class="bg-red-900/20 rounded-xl border border-red-500/30 p-6"><h3 class="font-bold text-red-400 mb-4">✗ Evite</h3><ul class="space-y-3 text-neutral-300"><li>✗ Esconder efeitos atrás de descrições vagas.</li><li>✗ Confiar na tool como autorização.</li><li>✗ Remover o fallback da interface.</li></ul></div>
</div>`;
}

function timeline(topic) {
  return `<div class="space-y-4 mb-6">
  <div class="flex items-start gap-4"><div class="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold flex-shrink-0">1</div><div class="flex-1 bg-dark-800 border border-dark-600 rounded-xl p-5"><h3 class="font-semibold">Defina o contrato</h3><p class="text-sm text-neutral-400 mt-2">Nome, descrição, entrada, resultado e limites ficam explícitos antes da implementação.</p></div></div>
  <div class="flex items-start gap-4"><div class="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold flex-shrink-0">2</div><div class="flex-1 bg-dark-800 border border-dark-600 rounded-xl p-5"><h3 class="font-semibold">Observe a execução</h3><p class="text-sm text-neutral-400 mt-2">Registre entrada, estado visível, cancelamento e saída sem expor dados sensíveis.</p></div></div>
  <div class="flex items-start gap-4"><div class="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold flex-shrink-0">3</div><div class="flex-1 bg-dark-800 border border-dark-600 rounded-xl p-5"><h3 class="font-semibold">Verifique a evidência</h3><p class="text-sm text-neutral-400 mt-2">A tool só está pronta quando o efeito e o retorno podem ser reproduzidos.</p></div></div>
</div>`;
}

function topicSection(module, topic, i) {
  const [title, what, why, concepts, code] = topic;
  const visual = i === 0 ? heroSvg(module.svg, `m${module.id.replace('-','')}`) : i === 1 || i === 4 ? comparison(topic,i) : i === 2 ? timeline(topic) : `<div class="bg-primary/10 rounded-xl border border-primary/30 p-6 mb-6"><h3 class="text-lg font-semibold text-primary mb-3">💡 Teste de realidade</h3><p class="text-neutral-300">Implemente este tópico com um caminho feliz, uma entrada inválida e um cancelamento. Registre o que a pessoa viu e o que o agente recebeu.</p></div>`;
  return `<section id="topico-${i+1}" data-inema-topic="modulo-${module.id}#topico-${i+1}" class="mb-16">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div class="flex items-center gap-4"><span class="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xl flex-shrink-0">${i+1}</span><h2 class="text-2xl font-bold">${title}</h2></div>
    <button type="button" data-inema-doubt-toggle aria-pressed="false" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-700 border border-dark-600 text-neutral-300 self-start"><span aria-hidden="true">?</span><span>Tenho dúvida</span></button>
  </div>
  <div class="inema-prose">
    <p data-inema-block="m${module.id}-t${i+1}-p1" class="text-neutral-300 mb-6 leading-relaxed"><strong class="text-purple-400">O que é:</strong> ${what}</p>
    <p data-inema-block="m${module.id}-t${i+1}-p2" class="text-neutral-300 mb-6 leading-relaxed"><strong class="text-purple-400">Por que aprender:</strong> ${why}</p>
  </div>
  ${visual}
  <div class="bg-gradient-to-br from-purple-900/30 to-dark-800 rounded-xl border border-purple-500/30 p-6 mb-6">
    <h3 class="text-lg font-semibold text-purple-400 mb-3">Conceito aplicado</h3>
    <p data-inema-block="m${module.id}-t${i+1}-p3" class="text-neutral-300">O contrato deve ser compreensível por quem usa, testável por quem desenvolve e limitado por quem opera. A ferramenta não substitui autorização, validação nem experiência visual.</p>
  </div>
  <pre class="code-shell mb-6"><code>${esc(code)}</code></pre>
  <div class="bg-primary/10 rounded-xl border border-primary/30 p-6 mb-6"><h3 class="text-lg font-semibold text-primary mb-3">Dica prática</h3><p class="text-neutral-300">Copie o exemplo, rode primeiro com dados locais e só depois conecte o backend. Mantenha logs sem dados pessoais e provoque pelo menos uma falha.</p></div>
  <div class="bg-dark-800 rounded-xl border border-dark-600 p-6 mb-6">
    <h3 class="text-lg font-semibold mb-4">Checklist operacional</h3>
    <div class="grid sm:grid-cols-2 gap-4 text-sm text-neutral-300">
      <div class="flex items-start gap-2">
        <span class="text-purple-400">✓</span>
        <span>O objetivo da ferramenta cabe em uma frase.</span>
      </div>
      <div class="flex items-start gap-2">
        <span class="text-purple-400">✓</span>
        <span>A entrada inválida produz um erro compreensível.</span>
      </div>
      <div class="flex items-start gap-2">
        <span class="text-purple-400">✓</span>
        <span>O efeito aparece na interface para a pessoa.</span>
      </div>
      <div class="flex items-start gap-2">
        <span class="text-purple-400">✓</span>
        <span>O caminho manual funciona sem WebMCP.</span>
      </div>
    </div>
  </div>
  <details class="bg-dark-800 rounded-xl border border-dark-600 p-6 mb-6">
    <summary class="font-semibold cursor-pointer text-sky-400">Indo mais fundo: evidência mínima</summary>
    <div class="mt-4 space-y-3 text-neutral-300 text-sm">
      <p data-inema-block="m${module.id}-t${i+1}-p4">Guarde a entrada usada, o estado anterior, o resultado devolvido e a alteração visível da página.</p>
      <p data-inema-block="m${module.id}-t${i+1}-p5">Anote também o comportamento sem suporte, durante cancelamento e diante de uma resposta não autorizada do backend.</p>
    </div>
  </details>
  <div><h3 class="font-semibold text-purple-400">Conceitos-chave</h3>${conceptGrid(concepts)}</div>
  <div class="flex justify-start mt-7"><button type="button" data-inema-read-toggle aria-pressed="false" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30"><span class="inema-read-icon" aria-hidden="true">○</span><span data-inema-read-label>Marcar como lido</span></button></div>
</section>`;
}

function modulePage(module, idx) {
  const next = modules[idx+1];
  const toc = module.topics.map((t,i)=>`<li><a class="toc-link block border-l-2 border-dark-600 px-3 py-2 text-sm text-neutral-400 hover:text-purple-400" href="#topico-${i+1}">${i+1}. ${t[0]}</a></li>`).join('\n');
  const sections = renderDeepModule(module, 'purple', { hex: '#c084fc', dark: '#1a1230' });
  return `${head({title:`Módulo ${module.number} — ${module.title}`,description:module.description,depth:1})}
<body class="bg-dark-900 text-neutral-100 min-h-screen">
${nav(1)}
<nav class="max-w-6xl mx-auto px-4 py-4 text-sm text-neutral-400" aria-label="Breadcrumb"><a href="../../index.html" class="hover:text-purple-400">Início</a><span class="mx-2">/</span><a href="../../index.html#mapa" class="hover:text-purple-400">Agent Developer</a><span class="mx-2">/</span><span class="text-purple-400">Módulo ${module.number}</span></nav>
<header id="modulo-${module.id}" data-inema-module="${module.id}" data-inema-track="3" class="bg-gradient-to-br from-purple-900/30 via-dark-800 to-dark-800 py-12 border-y border-dark-600">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><span class="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full mb-4">MÓDULO ${module.number}</span><h1 class="text-3xl sm:text-4xl font-bold mb-4">${module.icon} ${module.title}</h1><p class="text-lg text-neutral-400 max-w-3xl">${module.description}</p><div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-3xl"><div class="bg-dark-800/50 p-3 rounded-lg border border-dark-600"><strong class="text-xl text-purple-400">6</strong><p class="text-xs text-neutral-400">Tópicos</p></div><div class="bg-dark-800/50 p-3 rounded-lg border border-dark-600"><strong class="text-xl text-purple-400">${module.duration}</strong><p class="text-xs text-neutral-400">Carga</p></div><div class="bg-dark-800/50 p-3 rounded-lg border border-dark-600"><strong class="text-xl text-purple-400">Agent Developer</strong><p class="text-xs text-neutral-400">Nível</p></div><div class="bg-dark-800/50 p-3 rounded-lg border border-dark-600"><strong class="text-xl text-purple-400">${module.type}</strong><p class="text-xs text-neutral-400">Tipo</p></div></div><div data-inema-meter="modulo:${module.id}" class="inema-meter mt-6 max-w-2xl"><div class="flex justify-between gap-3 text-sm text-neutral-400 mb-2"><span data-inema-meter-frac>0 de 6</span><span data-inema-meter-pct>0%</span></div><div class="inema-bar"><div class="inema-bar__fill" data-inema-meter-fill></div></div></div></div>
</header>
<main id="conteudo" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div class="grid lg:grid-cols-[15rem_minmax(0,1fr)] gap-10">
    <aside><nav data-inema-toc class="hidden lg:block sticky top-24" aria-label="Índice do módulo"><p class="text-sm text-neutral-400 mb-3" data-inema-section-counter>Seção 1 de 6</p><ol class="space-y-1">${toc}</ol></nav></aside>
    <article class="min-w-0">${sections}
      <section class="mb-12"><div class="bg-gradient-to-br from-purple-900/40 via-dark-800 to-dark-800 rounded-xl border border-purple-500/30 p-8"><h2 class="text-2xl font-bold mb-6">📦 Entrega do módulo</h2><p class="text-neutral-300 mb-6">${module.lab}</p><div class="grid md:grid-cols-2 gap-6 mb-8"><div class="bg-purple-900/20 border border-purple-500/30 rounded-xl p-5"><h3 class="text-purple-400 font-semibold">Critério de aceite</h3><p class="text-neutral-300 text-sm mt-2">A entrega funciona com suporte WebMCP e mantém o caminho manual quando a API não existe.</p></div><div class="bg-sky-900/20 border border-sky-500/30 rounded-xl p-5"><h3 class="text-sky-400 font-semibold">Evidência</h3><p class="text-neutral-300 text-sm mt-2">Inclua código, cenário testado, resultado observado e uma limitação conhecida.</p></div></div><div class="flex justify-start flex-wrap gap-3"><a href="../../index.html" class="px-5 py-3 rounded-lg bg-dark-700 hover:bg-dark-600">← Voltar para a trilha</a>${next?`<a href="modulo-${next.id}.html" class="px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white">Próximo módulo: ${next.number} →</a>`:`<a href="../../labs/validador-tools.html" class="px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white">Validar catálogo final →</a>`}</div></div></section>
      <section class="border border-dark-600 rounded-xl p-6"><h2 class="text-xl font-bold">Fontes técnicas</h2><ul class="mt-4 space-y-2 text-sm"><li><a class="text-sky-400 hover:text-sky-300" href="https://github.com/webmachinelearning/webmcp" target="_blank" rel="noreferrer">Draft e repositório oficial WebMCP</a></li><li><a class="text-sky-400 hover:text-sky-300" href="https://webmachinelearning.github.io/webmcp/" target="_blank" rel="noreferrer">Especificação renderizada</a></li><li class="text-neutral-400">A API declarativa ainda possui pontos em debate; valide o draft antes de produção.</li></ul></section>
    </article>
  </div>
</main>
<footer class="border-t border-dark-600 py-8"><div class="max-w-6xl mx-auto px-4 text-sm text-neutral-500">WebMCP Agent Developer · Módulo ${module.number} · INEMA</div></footer>
${scripts(1)}
</body></html>`;
}

function labPage() {
  return `${head({title:'Validador avançado de tools e schemas',description:'Scanner avançado local para auditar catálogos WebMCP, JSON Schema, ciclo de vida, risco e respostas.',depth:'..'})}
<body class="bg-dark-900 text-neutral-100 min-h-screen">
${nav('..')}
<main id="conteudo">
  <header class="hero-shell agent-hero border-b border-dark-600">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid lg:grid-cols-[1fr_.9fr] gap-12 items-center">
      <div>
        <span class="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full mb-4">CONSOLE AVANÇADO · AGENT DEVELOPER</span>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">Inspecione o contexto antes de chamar o modelo</h1>
        <p class="text-lg text-neutral-300 mt-5 leading-relaxed">Cole um catálogo em JSON. O console verifica se descritores, schemas, risco e evidências são adequados ao pipeline de descoberta e execução.</p>
        <div class="flex justify-start flex-wrap gap-3 mt-7">
          <button id="load-example" type="button" class="px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold">Carregar exemplo</button>
          <a href="../curso/agent/modulo-3-4.html" class="px-5 py-3 rounded-lg border border-dark-600 hover:bg-dark-700">Revisar o loop conversacional</a>
        </div>
      </div>
      ${heroSvg(['JSON auditável','24 verificações','Plano de correção'],'validator-hero')}
    </div>
  </header>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid md:grid-cols-3 gap-4 mb-10">
      <div class="bg-dark-800 border border-dark-600 rounded-xl p-5"><span class="text-purple-400 text-sm font-semibold">01 · Contrato</span><p class="text-neutral-400 text-sm mt-2">Nome, título, descrição e unicidade.</p></div>
      <div class="bg-dark-800 border border-dark-600 rounded-xl p-5"><span class="text-sky-400 text-sm font-semibold">02 · Schema</span><p class="text-neutral-400 text-sm mt-2">Tipos, propriedades, required e limites.</p></div>
      <div class="bg-dark-800 border border-dark-600 rounded-xl p-5"><span class="text-primary text-sm font-semibold">03 · Operação</span><p class="text-neutral-400 text-sm mt-2">Cancelamento, risco, confirmação e saída.</p></div>
    </div>

    <div class="grid xl:grid-cols-[1fr_1fr] gap-8 items-start">
      <section class="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
        <div class="p-5 border-b border-dark-600">
          <div class="flex items-center justify-between gap-4"><div><p class="text-xs text-purple-400 font-semibold">ENTRADA LOCAL</p><h2 class="text-2xl font-bold mt-1">Catálogo em JSON</h2></div><span id="parse-status" class="text-xs text-neutral-400" role="status">Aguardando análise</span></div>
          <p class="text-sm text-neutral-400 mt-3">Use um array de descritores. Como funções não existem em JSON, declare <code class="text-sky-400">executeBehavior</code> e evidências operacionais separadamente.</p>
        </div>
        <div class="p-5">
          <label for="catalog-input" class="font-semibold">Descritores de tools</label>
          <textarea id="catalog-input" class="validator-textarea code-shell w-full mt-3" spellcheck="false" aria-describedby="input-help"></textarea>
          <p id="input-help" class="text-xs text-neutral-500 mt-3">Nada é enviado para servidor, registrado em document.modelContext ou executado.</p>
          <div class="flex justify-start flex-wrap gap-3 mt-5">
            <button id="run-validator" type="button" class="px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold">Analisar catálogo</button>
            <button id="clear-validator" type="button" class="px-5 py-3 rounded-lg bg-dark-700 hover:bg-dark-600">Limpar</button>
          </div>
        </div>
      </section>

      <section aria-live="polite">
        <div class="bg-dark-800 border border-dark-600 rounded-xl p-6 mb-6">
          <div class="flex flex-col sm:flex-row sm:items-center gap-6">
            <div class="relative w-28 h-28 rounded-full score-gauge flex-shrink-0" id="score-gauge" style="--score:0;--gauge-color:#c084fc"><div class="absolute inset-0 z-10 flex flex-col items-center justify-center"><strong id="score-value" class="text-3xl">0</strong><span class="text-xs text-neutral-400">de 100</span></div></div>
            <div><p id="score-label" class="text-purple-400 text-sm font-semibold">Sem diagnóstico</p><h2 class="text-2xl font-bold mt-1">Qualidade do catálogo</h2><p id="score-summary" class="text-neutral-400 mt-2">Carregue o exemplo ou cole seu JSON para começar.</p></div>
          </div>
          <div class="grid grid-cols-3 gap-3 mt-6"><div class="bg-dark-700 rounded-lg p-3"><strong id="count-pass" class="text-purple-400 text-xl">0</strong><p class="text-xs text-neutral-400">Passou</p></div><div class="bg-dark-700 rounded-lg p-3"><strong id="count-warn" class="text-primary text-xl">0</strong><p class="text-xs text-neutral-400">Atenções</p></div><div class="bg-dark-700 rounded-lg p-3"><strong id="count-fail" class="text-red-400 text-xl">0</strong><p class="text-xs text-neutral-400">Falhas</p></div></div>
        </div>
        <div id="tool-summary" class="space-y-4 mb-6"></div>
        <div id="findings" class="space-y-3"><div class="bg-dark-800 border border-dark-600 rounded-xl p-6 text-neutral-400">Os achados aparecerão aqui, priorizados por impacto.</div></div>
      </section>
    </div>

    <section class="mt-12 grid lg:grid-cols-2 gap-8">
      <div class="bg-primary/10 border border-primary/30 rounded-xl p-6"><h2 class="text-xl font-bold text-primary">O que este scanner não prova</h2><ul class="text-neutral-300 mt-4 space-y-2"><li>• suporte nativo do navegador;</li><li>• autorização do backend;</li><li>• segurança do código execute;</li><li>• qualidade real sem testes de execução.</li></ul></div>
      <div class="bg-dark-800 border border-purple-500/30 rounded-xl p-6"><h2 class="text-xl font-bold text-purple-400">Próximos laboratórios da formação</h2><ul class="text-neutral-300 mt-4 space-y-2"><li>• seletor de tools com dataset;</li><li>• executor com policy gate;</li><li>• avaliação de conversas completas.</li></ul></div>
    </section>
  </section>
</main>
<footer class="border-t border-dark-600 py-8"><div class="max-w-7xl mx-auto px-4 text-sm text-neutral-500">Validador local · não executa tools · Formação WebMCP Agent Developer</div></footer>
${scripts('..')}
<script src="../assets/validator.js"></script>
</body></html>`;
}

writeFileSync(resolve(root, 'index.html'), indexPage());
for (const [i, module] of modules.entries()) writeFileSync(resolve(outDir, `modulo-${module.id}.html`), modulePage(module, i));
writeFileSync(resolve(root, 'labs/validador-tools.html'), labPage());
console.log(`Curso gerado: index + ${modules.length} módulos + laboratório.`);
