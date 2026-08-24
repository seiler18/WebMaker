/* ============================================================
   ANIMACIÓN DE ENTRADA AL HACER SCROLL

   Sustituye a AOS, que en el proyecto original era una dependencia npm con
   su propio CSS. Esto son unas ochenta líneas, no añade peso al bundle y hace
   lo único que se usaba de verdad: aparecer al entrar en pantalla.

   Uso:
     data-anim="subir|aparecer|escala|lateral"   en el elemento
     data-anim-secuencia                          en el CONTENEDOR
     data-anim-espera="120"                       retardo manual, en ms

   Lo que aporta `data-anim-secuencia`: los hijos con [data-anim] entran
   ESCALONADOS, uno detrás de otro. Sin eso, las seis tarjetas de una rejilla
   aparecen exactamente a la vez, y una fila que aparece de golpe se lee como
   un salto de la página; escalonada, se lee como una fila que se va poniendo.
   Es la diferencia entre «tiene animaciones» y «tiene ritmo», y no cuesta
   nada: el retardo lo pone el JS al observar, no hay un temporizador por
   tarjeta.

   Aquí SÍ es correcto IntersectionObserver: la pregunta es «¿este elemento
   concreto ya se ve?», que es exactamente lo que IO responde, y no hay
   ambigüedad posible entre varios candidatos (a diferencia del scroll-spy).
   ============================================================ */

const MARGEN = '0px 0px -12% 0px' // dispara un poco antes del borde inferior

/* El escalonado tiene TECHO a propósito. Con 70ms por elemento y una rejilla
   de doce tarjetas, la última entraría 770ms después de la primera: a esa
   altura ya no se percibe secuencia, se percibe que el sitio va lento y que
   hay contenido que tarda en salir. Pasado el sexto, todos comparten el
   retardo máximo y entran juntos, que es lo que el ojo espera de algo que
   está «al fondo de la fila». */
const PASO_MS = 70
const PASOS_MAX = 6

export function initReveal() {
  const elementos = document.querySelectorAll('[data-anim]')
  if (!elementos.length) return

  // Quien pide menos movimiento ve todo directamente, sin animación y sin
  // observador. Importante: no basta con quitar la transición — si se dejara
  // el estado inicial oculto y algo fallara, el contenido no aparecería.
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (sinMovimiento || !('IntersectionObserver' in window)) {
    for (const el of elementos) el.classList.add('anim-visible')
    return
  }

  // Retardo de cada elemento, calculado UNA vez antes de observar: el manual
  // manda; si no hay, se mira si el padre declara secuencia y se usa la
  // posición del elemento entre sus hermanos animados.
  const espera = el => {
    const manual = Number(el.dataset.animEspera)
    if (manual) return manual

    const grupo = el.parentElement
    if (!grupo || !grupo.hasAttribute('data-anim-secuencia')) return 0

    const hermanos = [...grupo.children].filter(h => h.hasAttribute('data-anim'))
    const i = hermanos.indexOf(el)
    return Math.min(i, PASOS_MAX) * PASO_MS
  }

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue
        const el = entrada.target
        const ms = espera(el)
        if (ms) el.style.transitionDelay = `${ms}ms`
        el.classList.add('anim-visible')
        // Una vez visto, se deja de observar: la animación es de entrada,
        // no un efecto que deba repetirse al subir y bajar.
        obs.unobserve(el)
      }
    },
    { rootMargin: MARGEN, threshold: 0.05 }
  )

  /* EL RETARDO SE BORRA AL TERMINAR. Es el detalle que hace que el escalonado
     no se pague después: `transition-delay` es del elemento, no de la
     animación de entrada, así que una tarjeta que entró con 420ms de retardo
     se quedaba con esos 420ms para SIEMPRE — y el levantarse al pasar el
     puntero por encima empezaba casi medio segundo tarde. Se sentía como una
     página que no responde, y el culpable estaba en otro archivo. */
  const limpiar = evento => {
    const el = evento.target
    if (el.hasAttribute('data-anim') && el.style.transitionDelay) {
      el.style.transitionDelay = ''
    }
  }

  for (const el of elementos) {
    el.addEventListener('transitionend', limpiar, { once: true })
    observador.observe(el)
  }
}
