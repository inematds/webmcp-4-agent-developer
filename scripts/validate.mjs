import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pages = [
  'index.html',
  'labs/validador-tools.html',
  'curso/agent/modulo-3-1.html',
  'curso/agent/modulo-3-2.html',
  'curso/agent/modulo-3-3.html',
  'curso/agent/modulo-3-4.html'
];
const errors = [];
const manifests = [];

for (const file of pages) {
  const html = readFileSync(resolve(root, file), 'utf8');
  const manifestMatch = html.match(/<script type="application\/json" data-inema-manifest>\s*([\s\S]*?)\s*<\/script>/);
  if (!manifestMatch) errors.push(`${file}: manifesto ausente`);
  else manifests.push([file, JSON.stringify(JSON.parse(manifestMatch[1]))]);
  if (!html.includes('name="inema-course" content="webmcp-zero-expert"')) errors.push(`${file}: courseId incorreto`);
  if (!html.includes('https://inema.club')) errors.push(`${file}: INEMA.CLUB ausente`);
  if (!html.includes('id="theme-toggle"')) errors.push(`${file}: theme toggle ausente`);
  if (!html.includes('data-inema-journey-open')) errors.push(`${file}: jornada ausente`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (/^(?:https?:|#|data:)/.test(target)) continue;
    const clean = target.split('#')[0].split('?')[0];
    if (!clean) continue;
    const diskPath = resolve(root, dirname(file), clean);
    if (!existsSync(diskPath)) errors.push(`${file}: destino interno ausente (${target})`);
  }
}

for (const file of pages.filter(name => name.includes('modulo-'))) {
  const html = readFileSync(resolve(root, file), 'utf8');
  const topics = (html.match(/data-inema-topic=/g) || []).length;
  const lines = html.split('\n').length;
  if (topics !== 6) errors.push(`${file}: ${topics} tópicos, esperado 6`);
  if (lines < 500 || lines > 800) errors.push(`${file}: ${lines} linhas, esperado 500–800`);
  if (!html.includes('role="img"')) errors.push(`${file}: SVG conceitual ausente`);
  if ((html.match(/bg-red-900\/20/g) || []).length < 2) errors.push(`${file}: menos de 2 grids fazer/evitar`);
  if (!html.includes('w-10 h-10 rounded-full')) errors.push(`${file}: timeline ausente`);
  if ((html.match(/bg-primary\/10/g) || []).length < 2) errors.push(`${file}: menos de 2 dicas práticas`);
}

if (manifests.length && new Set(manifests.map(([, json]) => json)).size !== 1) errors.push('Manifestos não são idênticos entre as páginas.');

const all = pages.map(file => readFileSync(resolve(root, file), 'utf8')).join('\n');
if (all.includes('navigator.modelContext')) errors.push('API obsoleta navigator.modelContext encontrada.');
if (all.includes('unregisterTool(')) errors.push('Padrão obsoleto unregisterTool encontrado.');

const foundation = readFileSync(resolve(root, 'curso/agent/modulo-3-1.html'), 'utf8');
for (const expected of ['Comece pelo pedido do usuário', 'Leia o catálogo como contrato', 'Catálogo filtrado']) {
  if (!foundation.includes(expected)) errors.push(`modulo-3-1: conteúdo aprofundado ausente (${expected})`);
}
const index = readFileSync(resolve(root, 'index.html'), 'utf8');
for (const expected of ['Cap. 1', 'capitulo-2', 'capitulo-3', 'capitulo-4', 'Capítulo 1 · módulos disponíveis']) {
  if (!index.includes(expected)) errors.push(`index: arquitetura por capítulos ausente (${expected})`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`OK: ${pages.length} páginas, 4 módulos, 24 tópicos, laboratório e manifesto consistente.`);
