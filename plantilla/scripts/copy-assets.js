/* ============================================================
   COPIA DE ASSETS AL dist/  ·  se ejecuta después de `vite build`

   Vite procesa (y le pone hash) SOLO lo que se importa desde src/main.js:
   los CSS y las imágenes referenciadas dentro de esos CSS. Las imágenes que
   van en strings de HTML, los PDFs y cualquier página estática suelta NO las
   ve, y sin este paso no llegan al dist/ — el sitio se publica con las
   imágenes rotas.

   → SI AÑADES UNA CARPETA O UN ARCHIVO QUE DEBA LLEGAR A PRODUCCIÓN,
     DECLÁRALO AQUÍ. Es el único sitio que lo sabe.
   ============================================================ */

import { cpSync, mkdirSync, copyFileSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'

import { site } from '../src/data/site.js'

/* Carpetas que se copian completas a dist/ */
const carpetas = [
  'assets/img',
  'assets/docs',
]

/* Archivos sueltos de la raíz que también deben estar en dist/
   (PDFs descargables, robots.txt, un CNAME…) */
const archivos = [
  // 'catalogo.pdf',
]

let copiados = 0
let faltantes = 0

for (const carpeta of carpetas) {
  if (!existsSync(carpeta)) {
    // Aviso, no error: una carpeta declarada y todavía vacía es normal al
    // empezar un proyecto. Lo que rompe el sitio es lo contrario: un archivo
    // referenciado que no se copia, y de eso avisa `npm run check`.
    console.warn(`⚠  No encontrado (se omite): ${carpeta}`)
    faltantes++
    continue
  }
  const destino = join('dist', carpeta)
  mkdirSync(destino, { recursive: true })
  cpSync(carpeta, destino, { recursive: true })
  console.log(`✓ ${carpeta} → ${destino}`)
  copiados++
}

for (const archivo of archivos) {
  if (!existsSync(archivo)) {
    console.warn(`⚠  No encontrado (se omite): ${archivo}`)
    faltantes++
    continue
  }
  copyFileSync(archivo, join('dist', archivo))
  console.log(`✓ ${archivo} → dist/${archivo}`)
  copiados++
}

/* ============================================================
   robots.txt y sitemap.xml

   Se GENERAN aquí en vez de versionarse como archivos sueltos por una razón
   concreta: el `lastmod` del sitemap sale con la fecha del DEPLOY. Un
   `lastmod` antiguo le dice al buscador que no hace falta volver a pasar, y
   un sitemap versionado a mano siempre acaba con la fecha del día en que
   alguien se acordó de tocarlo.

   Sin robots.txt, la PRIMERA petición de cualquier rastreador se lleva un
   404. No rompe nada, pero es lo primero que mira una auditoría de SEO.
   ============================================================ */
const hoy = new Date().toISOString().slice(0, 10)

// Con la plantilla sin rellenar, `site.url` todavía es un marcador y generar
// un sitemap con «{{URL_PRODUCCION}}» dentro sería peor que no generarlo.
// `npm run check` ya habrá dado el error por los marcadores.
if (site.url && !site.url.includes('{{')) {
  const url = site.url.endsWith('/') ? site.url : site.url + '/'

  writeFileSync(
    join('dist', 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      `  <url>\n    <loc>${url}</loc>\n    <lastmod>${hoy}</lastmod>\n` +
      `    <priority>1.0</priority>\n  </url>\n` +
      `</urlset>\n`
  )
  console.log('✓ generado dist/sitemap.xml')

  writeFileSync(
    join('dist', 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${url}sitemap.xml\n`
  )
  console.log('✓ generado dist/robots.txt')

  copiados += 2
} else {
  console.warn('⚠  site.url sin rellenar: no se generan sitemap.xml ni robots.txt')
}

console.log(`\nCopiados ${copiados} elemento(s)${faltantes ? `, omitidos ${faltantes}` : ''}.`)
