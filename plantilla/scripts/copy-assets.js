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

import { cpSync, mkdirSync, copyFileSync, existsSync } from 'fs'
import { join } from 'path'

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

console.log(`\nCopiados ${copiados} elemento(s)${faltantes ? `, omitidos ${faltantes}` : ''}.`)
