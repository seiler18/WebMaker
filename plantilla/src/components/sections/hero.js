import { site } from '../../data/site.js'
import { hero } from '../../data/hero.js'

/* ============================================================
   HERO / PORTADA

   No usa el envoltorio seccion(): es a sangre completa, sin cabecera y con
   su propio fondo. Es la única sección que se salta ese molde.

   El `isolation: isolate` del .hero (styles/components.css) contiene sus
   capas decorativas de z-index negativo. Sin él se colarían por debajo del
   fondo de la página y no se verían.
   ============================================================ */

export function renderHero() {
  const botones = hero.acciones
    .map(
      (a, i) => `
        <a class="hero-btn ${i === 0 ? 'primario' : 'fantasma'}" href="${a.href}"
           ${a.externo ? 'target="_blank" rel="noopener noreferrer"' : ''}>
          ${a.icon ? `<i class="${a.icon}" aria-hidden="true"></i>` : ''}${a.label}
        </a>
      `
    )
    .join('')

  const cinta = hero.cinta.length
    ? `
      <ul class="hero-cinta" aria-label="En cifras">
        ${hero.cinta
          .map(
            d => `
          <li>
            <span class="hero-cinta-dato">${d.dato}</span>
            <span class="hero-cinta-pie">${d.pie}</span>
          </li>
        `
          )
          .join('')}
      </ul>
    `
    : ''

  return `
    <header class="hero" id="inicio">
      <div class="hero-fondo" aria-hidden="true"></div>

      <div class="hero-contenido">
        ${hero.antetitulo ? `<p class="hero-antetitulo">${hero.antetitulo}</p>` : ''}
        <h1 class="hero-titulo">${site.nombre}</h1>
        ${site.lema ? `<p class="hero-lema">«${site.lema}»</p>` : ''}
        <p class="hero-bajada">${hero.bajada}</p>

        <div class="hero-acciones">${botones}</div>
        ${cinta}
      </div>

      <!-- Indicador de que hay más abajo. Se oculta en móvil (responsive.css):
           en una pantalla corta cae encima de los botones. -->
      <a class="hero-scroll" href="#${hero.siguiente}" aria-label="Ir a la siguiente sección">
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </a>
    </header>
  `
}
