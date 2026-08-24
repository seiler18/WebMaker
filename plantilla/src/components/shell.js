import { site, redes, descargas } from '../data/site.js'
import { mapaMenu } from '../site-map.js'

/* ============================================================
   ARMAZÓN DE NAVEGACIÓN

   Dos variantes, elegidas con `site.armazon`. Comparten los mismos enlaces
   (salen de site-map.js) y el mismo scroll-spy; solo cambia el chrome:

     'topbar'   Barra superior fija. En móvil, menú desplegable (cajón).
                Lo esperable en un sitio de empresa.
     'sidebar'  Columna fija a la izquierda. En móvil, barra inferior de
                iconos. Cómodo para recorrer muchas secciones de un tirón.

   Cada enlace lleva `data-spy-link` con el id de su sección: es el contrato
   con src/lib/scrollspy.js, que le añade la clase `.is-active`.
   ============================================================ */

function marca(clase) {
  const visual = site.logo
    ? `<img class="${clase}-logo" src="${site.logo}" alt="${site.nombre}" width="40" height="40">`
    : `<span class="${clase}-monograma" aria-hidden="true">${site.monograma}</span>`

  return `
    <a class="${clase}" href="#inicio" aria-label="Ir al inicio">
      ${visual}
      <span class="${clase}-texto">
        <span class="${clase}-nombre">${site.nombre}</span>
        ${site.lema ? `<span class="${clase}-lema">${site.lema}</span>` : ''}
      </span>
    </a>
  `
}

function enlaces(clase) {
  return mapaMenu
    .map(
      s => `
      <li>
        <a class="${clase}" href="#${s.id}" data-spy-link="${s.id}">
          <i class="${s.icon}" aria-hidden="true"></i>
          <span class="nav-largo">${s.label}</span>
          <span class="nav-corto">${s.short}</span>
        </a>
      </li>
    `
    )
    .join('')
}

function botonesDescarga() {
  return descargas
    .map(
      d => `
      <a class="btn-descarga" href="${d.href}" target="_blank" rel="noopener noreferrer"
         download="${d.download}">
        <i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i>${d.label}
      </a>
    `
    )
    .join('')
}

function iconosRedes() {
  return redes
    .map(
      r => `
      <a href="${r.href}" target="_blank" rel="noopener noreferrer"
         title="${r.label}" aria-label="${r.label}">
        <i class="${r.icon}" aria-hidden="true"></i>
      </a>
    `
    )
    .join('')
}

/* ----------------------- VARIANTE TOPBAR ----------------------- */
function armazonTopbar() {
  return `
    <header class="topbar">
      <div class="topbar-inner">
        ${marca('marca')}

        <nav class="topbar-nav" id="menuPrincipal" aria-label="Secciones">
          <ul>${enlaces('nav-link')}</ul>
          ${descargas.length ? `<div class="topbar-extras">${botonesDescarga()}</div>` : ''}
        </nav>

        <button type="button" class="menu-boton" id="botonMenu"
                aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir menú">
          <span class="menu-boton-barras" aria-hidden="true"></span>
        </button>
      </div>
    </header>
  `
}

/* ----------------------- VARIANTE SIDEBAR ----------------------- */
function armazonSidebar() {
  return `
    <aside class="sidenav" aria-label="Secciones">
      <div class="sidenav-brand">${marca('marca')}</div>
      <ul class="sidenav-nav">${enlaces('nav-link')}</ul>
      <div class="sidenav-actions">
        ${botonesDescarga()}
        ${redes.length ? `<div class="sidenav-social">${iconosRedes()}</div>` : ''}
      </div>
    </aside>

    <!-- En el armazón 'sidebar' la barra superior queda casi vacía en
         escritorio, pero en móvil es donde vive la marca: la sidebar se
         convierte en barra de iconos y su cabecera desaparece por falta de
         sitio. Sin esto, el logo no se ve en el celular. -->
    <header class="topbar topbar-minima">
      <div class="topbar-inner">
        ${marca('marca marca-movil')}
        ${descargas.length ? `<div class="topbar-extras">${botonesDescarga()}</div>` : ''}
      </div>
    </header>
  `
}

export function renderShell() {
  return site.armazon === 'sidebar' ? armazonSidebar() : armazonTopbar()
}

/**
 * Abre y cierra el menú móvil de la variante 'topbar'.
 * En la variante 'sidebar' no hay botón y esto no hace nada.
 */
export function initShell() {
  const boton = document.getElementById('botonMenu')
  const menu = document.getElementById('menuPrincipal')
  if (!boton || !menu) return

  const cerrar = () => {
    menu.classList.remove('abierto')
    boton.setAttribute('aria-expanded', 'false')
    boton.setAttribute('aria-label', 'Abrir menú')
  }

  boton.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto')
    boton.setAttribute('aria-expanded', String(abierto))
    boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú')
  })

  // Al elegir una sección el menú sobra: si se queda abierto, tapa
  // justamente lo que se acaba de pedir ver.
  menu.addEventListener('click', evento => {
    if (evento.target.closest('a')) cerrar()
  })

  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') cerrar()
  })

  // Al pasar a escritorio el cajón deja de tener sentido: si quedó abierto,
  // sus estilos de móvil ya no aplican y el menú aparecería a medio camino.
  //
  // ESTE ANCHO VA EN PAREJA con el @media de styles/responsive.css (991.98px),
  // que es donde se explica cuándo conviene subirlo. Si cambias uno sin el
  // otro, queda una franja de anchos con el cajón abierto y los estilos de
  // escritorio aplicados.
  window.matchMedia('(min-width: 992px)').addEventListener('change', e => {
    if (e.matches) cerrar()
  })
}
