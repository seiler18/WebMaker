/* ============================================================
   IDENTIDAD DEL SITIO

   Todo lo que se repite en más de un sitio (cabecera, pie, meta tags del
   index.html) vive aquí para no tenerlo escrito en cuatro archivos.

   Lo rellena la skill `recopilar-briefing` a partir del briefing.md.
   ============================================================ */

export const site = {
  nombre: '{{NOMBRE}}',
  // Va en la cabecera cuando el nombre completo no cabe (móvil).
  nombreCorto: '{{NOMBRE_CORTO}}',
  lema: '{{LEMA}}',
  // Meta description. Una frase, 150-160 caracteres, con lo que hace la
  // organización y dónde. Es lo que sale en Google bajo el título.
  descripcion: '{{DESCRIPCION}}',
  url: '{{URL_PRODUCCION}}',

  /* Armazón de navegación. Dos opciones, ambas con el mismo scroll-spy:

       'topbar'   Barra superior fija con los enlaces + menú desplegable en
                  móvil. Es lo que espera un visitante en un sitio de empresa.
       'sidebar'  Columna fija a la izquierda con los enlaces, que en móvil
                  se convierte en barra inferior de iconos. Distintivo, muy
                  cómodo para recorrer un sitio de una sola página con
                  muchas secciones (currículos, portafolios, fichas).

     Cambiar este valor no requiere tocar ninguna sección: el armazón es la
     única parte del CSS que reacciona. */
  armazon: 'topbar',

  /* Logo. Si no hay archivo, se deja en null y sale el monograma. */
  logo: null,
  monograma: '{{MONOGRAMA}}',

  idioma: 'es',
}

/* Redes y perfiles del pie. `principal: true` las sube también a la
   cabecera (en el armazón 'sidebar', al bloque de acciones). */
export const redes = [
  // { label: 'LinkedIn', href: 'https://…', icon: 'fa-brands fa-linkedin' },
]

/* Descargas destacadas (catálogos, tarifarios, estatutos…).
   Los archivos van en la raíz del proyecto y scripts/copy-assets.js los
   lleva al dist/: si añades uno, decláralo también allí. */
export const descargas = [
  // { label: 'Catálogo 2026', href: 'catalogo.pdf', download: 'Catalogo' },
]
