/* ============================================================
   MODAL MÍNIMO

   Sustituye al modal de Bootstrap, que arrastraba jQuery y Popper y, en el
   proyecto original, obligó a una regla incómoda: nada de `transform`,
   `filter` ni `isolation` en el contenedor del contenido, porque cualquiera
   de los tres crea un contexto de apilamiento y dejaba el modal (z-index
   1050) por debajo de la barra de navegación.

   Aquí el diálogo se mueve al final de <body> al abrirse, así que no hay
   ancestro que pueda atraparlo y esa regla desaparece.

   Uso:
     <button data-modal="#ficha-x">Ver más</button>
     <dialog class="modal" id="ficha-x"> … </dialog>

   Se apoya en <dialog> nativo: el foco atrapado, el cierre con Escape y el
   fondo inerte los da el navegador. Soportado en todos los navegadores
   actuales.
   ============================================================ */

export function initModales() {
  const disparadores = document.querySelectorAll('[data-modal]')
  if (!disparadores.length) return

  for (const boton of disparadores) {
    boton.addEventListener('click', () => {
      const dialogo = document.querySelector(boton.dataset.modal)
      if (!dialogo) {
        console.warn(`Modal no encontrado: ${boton.dataset.modal}`)
        return
      }
      // Se mueve a <body> la primera vez. Es idempotente: si ya está ahí,
      // appendChild no hace nada perceptible.
      if (dialogo.parentElement !== document.body) document.body.appendChild(dialogo)
      dialogo.showModal()
    })
  }

  for (const dialogo of document.querySelectorAll('dialog.modal')) {
    // Cerrar pulsando fuera. El propio <dialog> ocupa toda la pantalla y su
    // ::backdrop no recibe clics, así que se compara contra el recuadro
    // interior: si el clic cayó fuera de él, es que fue en el fondo.
    dialogo.addEventListener('click', evento => {
      const caja = dialogo.querySelector('.modal-caja')
      if (!caja) return
      const r = caja.getBoundingClientRect()
      const dentro =
        evento.clientX >= r.left && evento.clientX <= r.right &&
        evento.clientY >= r.top && evento.clientY <= r.bottom
      if (!dentro) dialogo.close()
    })

    for (const cerrar of dialogo.querySelectorAll('[data-cerrar-modal]')) {
      cerrar.addEventListener('click', () => dialogo.close())
    }
  }
}
