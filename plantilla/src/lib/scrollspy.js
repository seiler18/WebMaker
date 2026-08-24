/* ============================================================
   SCROLL-SPY — marca en el menú la sección que se está viendo

   POR QUÉ NO SE USA IntersectionObserver AQUÍ (sí se usa en reveal.js, que
   es otro problema): las secciones de un sitio así tienen alturas muy
   dispares — el hero ocupa casi una pantalla, «Contacto» apenas media. Con
   IO hay momentos en que dos secciones cruzan el umbral a la vez y otros en
   que ninguna lo cruza, y el resaltado parpadea. Comparar la posición de
   scroll contra el inicio de cada sección da siempre un único ganador.

   El cálculo va dentro de requestAnimationFrame para no leer el layout en
   cada evento de scroll (evita reflows forzados y tirones).
   ============================================================ */

/**
 * @param {Object} [opts]
 * @param {string} [opts.linkSelector] Selector de los enlaces a resaltar.
 *                 Cada uno debe llevar data-spy-link="ID_DE_LA_SECCION".
 * @param {number} [opts.offset] Píxeles bajo el borde superior donde se
 *                 sitúa la «línea de lectura». Debe ser >= al alto de la
 *                 barra fija, o una sección se marcaría activa antes de
 *                 asomar por debajo de ella.
 * @returns {() => void} Fuerza un recálculo. Útil tras cambios de altura
 *                 (imágenes que cargan, un filtro que oculta tarjetas…).
 */
export function initScrollSpy({ linkSelector = '[data-spy-link]', offset = 96 } = {}) {
  // Puede haber DOS enlaces por sección (escritorio y móvil conviven en el
  // DOM), así que se agrupan por sección y se marcan todos a la vez.
  const porSeccion = new Map()
  for (const link of document.querySelectorAll(linkSelector)) {
    const section = document.getElementById(link.dataset.spyLink)
    if (!section) continue
    if (!porSeccion.has(section)) porSeccion.set(section, { section, links: [] })
    porSeccion.get(section).links.push(link)
  }

  const targets = [...porSeccion.values()]
  if (!targets.length) return () => {}

  let activo = null
  let encolado = false

  function activar(target) {
    if (target === activo) return
    if (activo) {
      for (const l of activo.links) {
        l.classList.remove('is-active')
        l.removeAttribute('aria-current')
      }
    }
    for (const l of target.links) {
      l.classList.add('is-active')
      // aria-current comunica la sección actual a los lectores de pantalla.
      l.setAttribute('aria-current', 'true')
    }
    activo = target
  }

  function actualizar() {
    encolado = false
    const scrollY = window.scrollY

    // Al final del documento gana siempre la última sección: una sección
    // corta al pie nunca llegaría a cruzar la línea de lectura.
    const alFinal =
      scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
    if (alFinal) {
      activar(targets[targets.length - 1])
      return
    }

    const linea = scrollY + offset
    let ganador = targets[0]
    for (const target of targets) {
      // getBoundingClientRect + scrollY en vez de offsetTop: no depende de
      // cuál sea el offsetParent, así que sigue funcionando aunque mañana se
      // envuelva el contenido en un contenedor posicionado.
      const top = target.section.getBoundingClientRect().top + scrollY
      if (top <= linea) ganador = target
      else break
    }
    activar(ganador)
  }

  function programar() {
    if (encolado) return
    encolado = true
    requestAnimationFrame(actualizar)
  }

  window.addEventListener('scroll', programar, { passive: true })
  window.addEventListener('resize', programar)
  window.addEventListener('load', programar)

  actualizar()
  return programar
}
