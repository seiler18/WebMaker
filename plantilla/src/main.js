/* ============================================================
   PUNTO DE ENTRADA

   Tres responsabilidades, en este orden:
     1. estilos   → el orden de import IMPORTA (responsive.css va último)
     2. markup    → cada componente devuelve un string de HTML
     3. conducta  → scroll-spy, animaciones, menú, filtros, formulario
   ============================================================ */

/* --- 1. Estilos ---------------------------------------------------------
   responsive.css SIEMPRE al final: sus overrides ganan por orden en la
   cascada, sin necesidad de un solo !important. Si lo subes de sitio,
   empezarás a necesitarlos. */
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/responsive.css'

/* --- 2. Markup --------------------------------------------------------- */
import { site } from './data/site.js'
import { mapa } from './site-map.js'
import { renderShell, initShell } from './components/shell.js'
import { renderFooter } from './components/footer.js'
import { initTarjetas } from './components/sections/tarjetas.js'
import { initContacto } from './components/sections/contacto.js'

import { initScrollSpy } from './lib/scrollspy.js'
import { initReveal } from './lib/reveal.js'
import { initModales } from './lib/modal.js'

const app = document.getElementById('app')

// El armazón elegido se anuncia en el <body>: es lo que usa el CSS para
// decidir entre columna lateral y barra superior sin duplicar selectores.
document.body.dataset.armazon = site.armazon

// Las secciones salen del mapa, en su orden. No hay lista que mantener
// aquí: añadir una fila a site-map.js la coloca en el DOM y en el menú.
app.innerHTML = `
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  ${renderShell()}
  <div class="app-main">
    <main id="contenido">
      ${mapa.map(s => s.render()).join('\n')}
    </main>
    ${renderFooter()}
  </div>
`

/* --- 3. Conducta ------------------------------------------------------- */

// El offset debe ser >= al alto de la barra fija (--topbar-h) para que una
// sección no se marque activa antes de asomar por debajo de ella.
const refrescarSpy = initScrollSpy({ offset: 96 })

initShell()      // menú móvil (solo en el armazón 'topbar')
initReveal()     // animaciones de entrada
initModales()    // diálogos «ver más», si alguna sección los usa
initTarjetas()   // botoneras de filtro de las rejillas
initContacto()   // formulario: correo por FormSubmit o WhatsApp

// Al terminar de cargar fuentes e imágenes la página puede haber cambiado de
// alto: hay que recalcular qué sección está activa.
window.addEventListener('load', refrescarSpy)

// Filtrar una rejilla también cambia el alto del documento.
document.addEventListener('click', evento => {
  if (evento.target.closest('[data-filtro]')) setTimeout(refrescarSpy, 60)
})
