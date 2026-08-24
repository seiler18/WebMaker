/* ============================================================
   ANIMACIÓN DE ENTRADA AL HACER SCROLL

   Sustituye a AOS, que en el proyecto original era una dependencia npm con
   su propio CSS. Esto son cuarenta líneas, no añade peso al bundle y hace lo
   único que se usaba de verdad: aparecer al entrar en pantalla.

   Uso: `data-anim="subir"` en el elemento. Opcionalmente
   `data-anim-espera="120"` (milisegundos) para escalonar una fila.

   Aquí SÍ es correcto IntersectionObserver: la pregunta es «¿este elemento
   concreto ya se ve?», que es exactamente lo que IO responde, y no hay
   ambigüedad posible entre varios candidatos (a diferencia del scroll-spy).
   ============================================================ */

const MARGEN = '0px 0px -12% 0px' // dispara un poco antes del borde inferior

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

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue
        const espera = Number(entrada.target.dataset.animEspera) || 0
        if (espera) entrada.target.style.transitionDelay = `${espera}ms`
        entrada.target.classList.add('anim-visible')
        // Una vez visto, se deja de observar: la animación es de entrada,
        // no un efecto que deba repetirse al subir y bajar.
        obs.unobserve(entrada.target)
      }
    },
    { rootMargin: MARGEN, threshold: 0.05 }
  )

  for (const el of elementos) observador.observe(el)
}
