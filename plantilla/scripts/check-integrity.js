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
     8. Ningún color literal fuera de tokens.css.
     9. Ningún tamaño de letra literal fuera de tokens.css.
    10. Ninguna duración ni curva de animación literal fuera de tokens.css.
    11. Toda imagen tiene un `alt` con texto.
    12. Todo `data-anim` usa una de las variantes que existen.
    13. Todo `target="_blank"` lleva `rel="noopener"`.
    14. Todo recurso externo (script o hoja de estilo) lleva `integrity`.
    15. Ningún `onclick=` ni `href="javascript:"` (la CSP los bloquea).
    16. La ficha JSON-LD del index.html dice lo mismo que site.js.

   El punto 5 es el que más veces rompe un sitio: Vite no valida las rutas
   que van dentro de strings de HTML, así que un nombre mal escrito solo se
   ve como imagen rota en producción. Y el 1 evita el clásico bochorno de
   publicar con un marcador de la plantilla a la vista en la portada.

   Los puntos 8 a 10 son los que sostienen el acabado del sitio. Las tres
   reglas estaban escritas en la documentación desde el primer día y las tres
   se rompieron igual, porque romperlas no da error en ningún sitio: se ve
   —meses después, en una revisión visual— como un icono con el azul de la
   paleta anterior, dos textos del mismo papel con tamaños que no llegan a
   distinguirse, o dos fichas vecinas que responden al puntero a velocidades
   distintas. Una regla de acabado que no se comprueba es una intención.

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

/* --- 8, 9 y 10. Disciplina del CSS -----------------------------------
   tokens.css es el único archivo exento: es justamente el sitio donde estos
   valores deben estar. */
const CSS_REVISADOS = ['base.css', 'layout.css', 'components.css', 'responsive.css']

// Blancos y negros neutros no pertenecen a ninguna paleta: la sombra negra de
// una tarjeta y el texto blanco de un botón son los mismos en todas.
const HEX_NEUTROS = new Set(['#fff', '#ffffff', '#000', '#000000'])
const esCanalNeutro = valores =>
  valores.every(v => v === '0') || valores.every(v => v === '255')

/* Lo que se ignora se BORRA EN BLANCO, no se recorta: se sustituye por
   espacios y se conservan los saltos de línea. Así los números de línea que
   se informan siguen siendo los del archivo de verdad — un aviso que apunta a
   una línea equivocada hace perder más tiempo que no informar de ninguna. */
const enBlanco = trozo => trozo.replace(/[^\n]/g, ' ')

const sinComentarios = css => css.replace(/\/\*[\s\S]*?\*\//g, enBlanco)

/* El bloque de `prefers-reduced-motion` se salta entero: ahí las duraciones
   TIENEN que ser literales (`0.01ms !important` apaga las animaciones sin
   depender de ningún token). Se localiza contando llaves porque dentro hay
   reglas anidadas. */
const sinBloqueMenosMovimiento = css => {
  const i = css.indexOf('@media (prefers-reduced-motion')
  if (i === -1) return css
  let nivel = 0
  for (let j = css.indexOf('{', i); j < css.length; j++) {
    if (css[j] === '{') nivel++
    else if (css[j] === '}' && --nivel === 0) {
      return css.slice(0, i) + enBlanco(css.slice(i, j + 1)) + css.slice(j + 1)
    }
  }
  return css.slice(0, i) + enBlanco(css.slice(i))
}

const numeroDeLinea = (texto, indice) => texto.slice(0, indice).split('\n').length

for (const archivo of CSS_REVISADOS) {
  const ruta = join(raiz, 'src/styles', archivo)
  if (!existsSync(ruta)) continue
  const bruto = readFileSync(ruta, 'utf8')
  const css = sinBloqueMenosMovimiento(sinComentarios(bruto))

  // --- 8. Colores literales ---
  for (const m of css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    if (HEX_NEUTROS.has(m[0].toLowerCase())) continue
    errores.push(
      `Color literal "${m[0]}" en src/styles/${archivo}, línea ` +
        `${numeroDeLinea(css, m.index)}. Los colores van en tokens.css y se ` +
        `usan por nombre (regla 5 del proyecto).`
    )
  }
  for (const m of css.matchAll(/\b(rgba?|hsla?)\(([^)]*)\)/g)) {
    const canales = m[2].split(/[,/\s]+/).filter(Boolean).slice(0, 3)
    if (m[1].startsWith('rgb') && esCanalNeutro(canales)) continue
    errores.push(
      `Color literal "${m[0]}" en src/styles/${archivo}, línea ` +
        `${numeroDeLinea(css, m.index)}. Si hace falta un lavado nuevo, se ` +
        `añade a tokens.css con color-mix() para que cambie solo al cambiar ` +
        `de paleta.`
    )
  }

  // --- 9. Tamaños de letra literales ---
  for (const m of css.matchAll(/font-size:\s*([^;}]+)/g)) {
    const valor = m[1].trim()
    if (valor.startsWith('var(') || valor === 'inherit') continue
    errores.push(
      `Tamaño de letra literal "${valor}" en src/styles/${archivo}, línea ` +
        `${numeroDeLinea(css, m.index)}. Usa un paso de la escala (--txt-*): ` +
        `un tamaño suelto no crea jerarquía, solo desorden.`
    )
  }

  // --- 10. Duraciones y curvas literales ---
  for (const m of css.matchAll(/(transition|animation)(-duration|-delay)?:\s*([^;}]+)/g)) {
    // Se quitan los tokens antes de buscar: lo que quede con un número y una
    // unidad de tiempo es un valor escrito a mano.
    const valor = m[3].replace(/var\(--[a-z0-9-]+\)/g, '')
    const tiempo = valor.match(/\d*\.?\d+\s*m?s\b/)
    if (tiempo) {
      errores.push(
        `Duración literal "${tiempo[0].trim()}" en el ${m[1]} de ` +
          `src/styles/${archivo}, línea ${numeroDeLinea(css, m.index)}. Usa ` +
          `--rapido, --medio o --lento: el sitio entero tiene que responder a ` +
          `la misma velocidad.`
      )
    }
    if (valor.includes('cubic-bezier(')) {
      errores.push(
        `Curva literal cubic-bezier() en el ${m[1]} de src/styles/${archivo}, ` +
          `línea ${numeroDeLinea(css, m.index)}. Usa --curva-salida, ` +
          `--curva-entrada o --curva-suave.`
      )
    }
  }
}

/* --- 11. Imágenes sin texto alternativo -----------------------------
   El `alt` no es SEO: es lo que se lee en voz alta y lo que se ve cuando la
   imagen no carga. Vacío se avisa (a veces una imagen es decorativa de
   verdad); ausente es un error, porque siempre es un olvido. */
for (const m of todoElHtml.matchAll(/<img\b[^>]*>/g)) {
  const alt = m[0].match(/\salt="([^"]*)"/)
  if (!alt) {
    errores.push(`Imagen sin atributo alt: ${m[0].slice(0, 90)}…`)
  } else if (!alt[1].trim()) {
    avisos.push(
      `Imagen con alt vacío: ${m[0].slice(0, 90)}… Si es decorativa está bien; ` +
        `si no, describe lo que se ve.`
    )
  }
}

/* --- 12. Variantes de animación que existen -------------------------
   Un `data-anim="fade"` no da error en el navegador: el elemento aparece sin
   movimiento y nadie se enteraría de que la secuencia está a medias. */
const ANIMS = new Set(['subir', 'aparecer', 'escala', 'lateral'])
for (const m of html.matchAll(/data-anim="([^"]*)"/g)) {
  if (!ANIMS.has(m[1])) {
    errores.push(
      `data-anim="${m[1]}" no existe. Variantes: ${[...ANIMS].join(', ')} ` +
        `(ver src/lib/reveal.js).`
    )
  }
}

/* ============================================================
   13 a 16 · SEGURIDAD DEL DOCUMENTO

   Las cuatro comprueban cosas que FUNCIONAN igual de bien estando mal, y por
   eso no se arreglan solas: un `target="_blank"` sin `rel` abre la pestaña,
   un CDN sin `integrity` sirve el archivo, un `onclick` responde al clic en
   local. El día en que dejan de estar bien ya es tarde.
   ============================================================ */

/* --- 13. Enlaces externos con rel="noopener" -------------------------
   Una pestaña abierta con target="_blank" recibe `window.opener` y puede
   redirigir la pestaña ORIGEN a donde quiera (tabnabbing): el visitante
   vuelve creyendo que sigue en tu sitio y se encuentra otra cosa. Los
   navegadores modernos ya lo aplican solos, pero no todos los que abren un
   sitio lo son, y el atributo no cuesta nada. */
for (const m of todoElHtml.matchAll(/<a\s[^>]*>/gi)) {
  const etiqueta = m[0]
  if (!/target\s*=\s*["']_blank["']/i.test(etiqueta)) continue
  if (/rel\s*=\s*["'][^"']*noopener/i.test(etiqueta)) continue
  const href = etiqueta.match(/href\s*=\s*["']([^"']*)["']/i)?.[1] || '(sin href)'
  errores.push(`Enlace con target="_blank" sin rel="noopener": ${href}`)
}

/* --- 14. Recursos de terceros firmados con integrity -----------------
   Si el CDN devolviera un archivo distinto al firmado, el navegador lo
   descarta en vez de ejecutarlo. Es la única defensa real que tiene un sitio
   estático ante un CDN comprometido.

   Exentos los que sirven contenido VARIABLE y por tanto no tienen hash fijo:
   Google Fonts devuelve un CSS distinto según el navegador que pregunta, y un
   «kit» de Font Awesome es un loader generado por cuenta que cambia al tocar
   su configuración. */
const SIN_INTEGRIDAD = ['fonts.googleapis.com', 'kit.fontawesome.com']
for (const m of todoElHtml.matchAll(/<(script|link)\s[^>]*>/gi)) {
  const etiqueta = m[0]
  const url = etiqueta.match(/(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)["']/i)?.[1]
  if (!url) continue
  // De los <link> solo interesan los que traen CÓDIGO o estilos.
  if (/^<link/i.test(etiqueta) && !/rel\s*=\s*["']stylesheet["']/i.test(etiqueta)) continue
  if (SIN_INTEGRIDAD.some(h => url.includes(h))) continue
  if (!/\sintegrity\s*=/i.test(etiqueta)) {
    errores.push(
      `Recurso externo sin integrity: ${url}\n` +
        `      Calcula el hash: curl -s "${url}" | openssl dgst -sha384 -binary | openssl base64 -A`
    )
  }
}

/* --- 15. Nada de código en línea en los atributos --------------------
   Un `onclick="…"` o un `href="javascript:…"` es lo primero que bloquea la
   Content-Security-Policy del index.html: funcionaría en local y moriría en
   silencio en producción. Además mezcla conducta con markup, que es justo lo
   que separa esta plantilla. */
const manejadoresVistos = new Set()
for (const m of todoElHtml.matchAll(/<[a-z][^>]*\s(on[a-z]+)\s*=\s*["'][^"']*["'][^>]*>/gi)) {
  if (manejadoresVistos.has(m[1])) continue
  manejadoresVistos.add(m[1])
  errores.push(`Manejador en línea "${m[1]}": usa addEventListener en un módulo de src/lib/`)
}
if (/href\s*=\s*["']javascript:/i.test(todoElHtml)) {
  errores.push('href="javascript:…": la Content-Security-Policy lo bloquea en producción')
}

/* --- 16. La ficha JSON-LD dice lo mismo que src/data/site.js ---------
   El bloque de datos estructurados es la única copia de estos datos fuera de
   site.js, y es la que lee el buscador. Si el nombre o la descripción cambian
   en site.js y ahí no, lo que se indexa queda desfasado sin que se note en la
   pantalla. */
const bloqueLd = htmlIndex.match(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
)?.[1]

if (!bloqueLd) {
  avisos.push(
    'index.html no tiene bloque JSON-LD. Sin él, el buscador lee el sitio ' +
      'como texto suelto en vez de como una ficha con nombre, web y logo.'
  )
} else if (!marcadores.length) {
  // Con marcadores sin rellenar la comparación no diría nada útil: el punto 1
  // ya ha dado el error que toca.
  let ficha
  try {
    ficha = JSON.parse(bloqueLd)
  } catch (e) {
    errores.push(`El bloque JSON-LD de index.html no es JSON válido: ${e.message}`)
  }
  if (ficha) {
    const pares = [
      ['name', ficha.name, site.nombre],
      ['description', ficha.description, site.descripcion],
      ['url', ficha.url, site.url],
    ]
    for (const [campo, enFicha, enDatos] of pares) {
      if (enFicha !== enDatos) {
        errores.push(
          `JSON-LD desincronizado: "${campo}" dice «${enFicha}» y ` +
            `src/data/site.js dice «${enDatos}»`
        )
      }
    }
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
