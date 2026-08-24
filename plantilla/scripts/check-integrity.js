/* ============================================================
   VERIFICADOR DE INTEGRIDAD  ·  npm run check

   Renderiza el sitio en Node (los componentes son funciones puras que
   devuelven strings, no tocan el DOM) y comprueba lo que un build correcto
   NO detecta:

     1. Marcadores {{…}} de la plantilla sin rellenar.
     2. Ids duplicados en el HTML generado.
     3. Cada sección de site-map.js existe en el DOM, y en el mismo orden.
     4. Cada data-modal="#x" apunta a un id que existe.
     5. Cada archivo local referenciado (imágenes, PDFs) existe en el disco.
     6. `base` de vite.config.js coincide con la URL de producción.
     7. Enlaces de ancla (#algo) que no corresponden a ningún id.

   El punto 5 es el que más veces rompe un sitio: Vite no valida las rutas
   que van dentro de strings de HTML, así que un nombre mal escrito solo se
   ve como imagen rota en producción. Y el 1 evita el clásico bochorno de
   publicar con un marcador de la plantilla a la vista en la portada.

   Sale con código 1 si encuentra algún problema → sirve para CI, y va dentro
   de `npm run build`, así que un error hace fallar el deploy en vez de
   llegar a producción.
   ============================================================ */

import { existsSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'

import { mapa } from '../src/site-map.js'
import { site } from '../src/data/site.js'
import { renderShell } from '../src/components/shell.js'
import { renderFooter } from '../src/components/footer.js'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const errores = []
const avisos = []

/* --- Se arma el mismo HTML que monta src/main.js --------------------- */
const htmlSecciones = mapa.map(s => s.render()).join('\n')
const html = [renderShell(), htmlSecciones, renderFooter()].join('\n')

/* index.html se revisa aparte: sus ids no participan del scroll-spy, pero sus
   rutas (favicon, og:image) se rompen igual — y son justo las que nadie mira
   hasta que un enlace compartido sale sin imagen. */
const htmlIndex = readFileSync(join(raiz, 'index.html'), 'utf8')
const todoElHtml = `${html}\n${htmlIndex}`

/* --- 1. Marcadores sin rellenar -------------------------------------- */
const marcadores = [
  ...new Set([...todoElHtml.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)].map(m => m[1])),
]
if (marcadores.length) {
  errores.push(
    `Quedan ${marcadores.length} marcador(es) de la plantilla sin rellenar: ` +
      marcadores.map(m => `{{${m}}}`).join(', ')
  )
}

/* --- 2. Ids duplicados ------------------------------------------------ */
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1])
const vistos = new Set()
for (const id of ids) {
  if (vistos.has(id)) errores.push(`Id duplicado en el DOM: "${id}"`)
  vistos.add(id)
}

/* --- 3. El mapa y el DOM cuentan lo mismo, en el mismo orden ---------
   El scroll-spy compara posiciones en el documento y asume que los enlaces
   están en el mismo orden vertical que las secciones. */
const enDom = []
for (const s of mapa) {
  // El hero es un <header>, el resto <section>: se acepta cualquier
  // elemento con ese id, lo que importa es la posición.
  const pos = html.indexOf(`id="${s.id}"`)
  if (pos === -1) {
    errores.push(`La sección "${s.id}" está en site-map.js pero no aparece en el DOM`)
    continue
  }
  enDom.push({ id: s.id, pos })
}
const ordenDom = [...enDom].sort((a, b) => a.pos - b.pos).map(s => s.id)
const ordenMapa = enDom.map(s => s.id)
if (ordenDom.join('>') !== ordenMapa.join('>')) {
  errores.push(
    'El orden de las secciones en el DOM no coincide con site-map.js.\n' +
      `      mapa: ${ordenMapa.join(' > ')}\n` +
      `      dom:  ${ordenDom.join(' > ')}`
  )
}

/* --- 4. Modales ------------------------------------------------------- */
for (const m of html.matchAll(/data-modal="#([^"]+)"/g)) {
  if (!vistos.has(m[1])) {
    errores.push(`data-modal="#${m[1]}" apunta a un id que no existe`)
  }
}

/* --- 5. Archivos locales referenciados ------------------------------- */
const esExterno = ruta => /^(https?:|mailto:|tel:|data:|#|\/\/)/.test(ruta)
const rutas = new Set()

// `content="…"` incluido: ahí viven las og:image, que son URLs absolutas y se
// filtran solas, pero si alguien pone una relativa hay que cazarla.
for (const m of todoElHtml.matchAll(/(?:src|href|content)="([^"]+)"/g)) {
  const ruta = m[1]
  if (!ruta || esExterno(ruta)) continue
  // `/src/main.js` lo resuelve Vite desde la raíz del proyecto, no es un
  // archivo del sitio publicado: se comprueba sin la barra inicial.
  const limpia = ruta.split(/[?#]/)[0].replace(/^\.?\//, '')
  // `content` trae también texto libre (descripciones, títulos). Solo se
  // toma en serio lo que parece una ruta de archivo.
  if (!/\.[a-z0-9]{2,5}$/i.test(limpia)) continue
  rutas.add(limpia)
}

for (const ruta of rutas) {
  // Las rutas del HTML son relativas a la raíz del sitio publicado, que es
  // la raíz del proyecto: Vite sirve desde ahí y copy-assets.js replica esa
  // estructura en el dist/.
  if (!existsSync(join(raiz, ruta))) {
    errores.push(`Archivo referenciado que no existe: ${ruta}`)
  }
}

/* --- 6. `base` de Vite vs URL de producción --------------------------
   Es el error más silencioso de GitHub Pages: si `base` no coincide con el
   nombre del repositorio, el sitio carga pero sin CSS ni JS. */
const viteConfig = readFileSync(join(raiz, 'vite.config.js'), 'utf8')
const baseMatch = viteConfig.match(/base:\s*['"]([^'"]+)['"]/)
if (!baseMatch) {
  avisos.push('No se encontró `base` en vite.config.js. En GitHub Pages suele hacer falta.')
} else if (site.url && !site.url.includes('{{')) {
  try {
    const ruta = new URL(site.url).pathname
    const base = baseMatch[1]
    const norm = p => (p.endsWith('/') ? p : p + '/')
    if (norm(ruta) !== norm(base)) {
      errores.push(
        `El \`base\` de vite.config.js ("${base}") no coincide con la ruta de ` +
          `site.url ("${ruta}"). En producción el sitio cargaría sin estilos.`
      )
    }
  } catch {
    avisos.push(`site.url no es una URL válida: ${site.url}`)
  }
}

/* --- 7. Anclas que no llevan a ningún sitio -------------------------- */
for (const m of html.matchAll(/href="#([^"]+)"/g)) {
  const ancla = m[1]
  if (ancla && !vistos.has(ancla)) {
    errores.push(`Enlace a #${ancla}, pero no hay ningún elemento con ese id`)
  }
}

/* --- Informe --------------------------------------------------------- */
console.log(
  `Analizados ${ids.length} ids, ${rutas.size} rutas locales y ` +
    `${mapa.length} secciones.`
)

for (const a of avisos) console.warn(`⚠  ${a}`)

if (errores.length) {
  console.error(`\n✗ ${errores.length} problema(s):\n`)
  for (const e of errores) console.error(`  · ${e}`)
  console.error('')
  process.exit(1)
}

console.log(`✓ Integridad OK — ${mapa.length} secciones, sin ids duplicados ni rutas rotas.`)
