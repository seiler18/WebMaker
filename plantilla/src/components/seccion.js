/* ============================================================
   ENVOLTORIO COMÚN DE SECCIÓN

   Todas las secciones comparten el mismo andamiaje: separador de zona,
   contenedor de ancho de lectura y cabecera (antetítulo · título · regla ·
   bajada). En el proyecto del que sale esta plantilla ese markup estaba
   copiado en cada componente, y cuando se añadió el separador hubo que
   editar cinco archivos y actualizar la guía para que nadie lo olvidara.

   Aquí se escribe una vez. Un bloque nuevo solo aporta su contenido.
   ============================================================ */

/**
 * @param {Object}  s
 * @param {string}  s.id          Id del <section>. Debe existir en site-map.js.
 * @param {string}  [s.eyebrow]   Antetítulo corto en mayúsculas.
 * @param {string}  [s.titulo]    Título de la sección.
 * @param {string}  [s.subtitulo] Una o dos frases de contexto. Admite HTML.
 * @param {string}  s.contenido   HTML del cuerpo.
 * @param {boolean} [s.sinSeparador] Para la primera sección tras el hero,
 *                  donde el separador sobra: ya hay un corte visual.
 * @returns {string} HTML de la sección completa.
 */
export function seccion({ id, eyebrow, titulo, subtitulo, contenido, sinSeparador = false }) {
  // El separador es decorativo puro: aria-hidden para que un lector de
  // pantalla no anuncie un rombo entre secciones.
  const separador = sinSeparador
    ? ''
    : '<div class="section-divider" aria-hidden="true"><span></span></div>'

  const cabecera =
    eyebrow || titulo || subtitulo
      ? `
        <div class="section-head" data-anim="subir">
          ${eyebrow ? `<span class="section-eyebrow">${eyebrow}</span>` : ''}
          ${titulo ? `<h2 class="section-title">${titulo}</h2>` : ''}
          ${titulo ? '<div class="section-rule"></div>' : ''}
          ${subtitulo ? `<p class="section-subtitle">${subtitulo}</p>` : ''}
        </div>
      `
      : ''

  return `
    <section class="section" id="${id}">
      ${separador}
      <div class="section-inner">
        ${cabecera}
        ${contenido}
      </div>
    </section>
  `
}
