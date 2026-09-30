import { site, redes, descargas } from '../data/site.js'
import { mapaMenu } from '../site-map.js'

/* ============================================================
   ARMAZÓN DE NAVEGACIÓN

   Dos variantes, elegidas con `site.armazon`. Comparten los mismos enlaces
   (salen de site-map.js) y el mismo scroll-spy; solo cambia el chrome:

     'topbar'   Barra superior fija con los enlaces en línea. Lo esperable
                en un sitio de empresa.
     'sidebar'  Columna fija a la izquierda. Cómodo para recorrer muchas
                secciones de un tirón.

   EN MÓVIL LOS DOS SON LO MISMO: una cinta fija de iconos en la parte
   inferior (al alcance del pulgar), con la marca arriba. No hay menú
   hamburguesa ni cajón: son los mismos enlaces, solo cambia el CSS
   (styles/responsive.css).

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

        <nav class="topbar-nav" aria-label="Secciones">
          <ul>${enlaces('nav-link')}</ul>
        </nav>

        <!-- Fuera del <nav> a propósito: en móvil el <nav> baja a la cinta
             inferior y las descargas tienen que quedarse arriba. -->
        ${descargas.length ? `<div class="topbar-extras">${botonesDescarga()}</div>` : ''}
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
