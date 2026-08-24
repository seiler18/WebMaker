import { site, redes } from '../data/site.js'
import { mapaMenu } from '../site-map.js'
import { contacto } from '../data/contacto.js'

/* ============================================================
   PIE DE PÁGINA

   No es una sección del mapa: va siempre al final, no se enlaza y no
   participa en el scroll-spy. Por eso lo monta src/main.js aparte.
   ============================================================ */

export function renderFooter() {
  const enlaces = mapaMenu
    .map(s => `<li><a href="#${s.id}">${s.label}</a></li>`)
    .join('')

  const sociales = redes
    .map(
      r => `
      <a href="${r.href}" target="_blank" rel="noopener noreferrer" aria-label="${r.label}">
        <i class="${r.icon}" aria-hidden="true"></i> <span>${r.label}</span>
      </a>
    `
    )
    .join('')

  return `
    <footer class="pie">
      <div class="pie-inner">
        <div class="pie-marca">
          <span class="pie-nombre">${site.nombre}</span>
          ${site.lema ? `<p class="pie-lema">«${site.lema}»</p>` : ''}
          ${contacto.correo ? `<p class="pie-dato"><a href="mailto:${contacto.correo}">${contacto.correo}</a></p>` : ''}
        </div>

        <nav class="pie-nav" aria-label="Mapa del sitio">
          <h2>Secciones</h2>
          <ul>${enlaces}</ul>
        </nav>

        ${
          redes.length
            ? `<div class="pie-redes">
                 <h2>Síguenos</h2>
                 <div class="pie-redes-lista">${sociales}</div>
               </div>`
            : ''
        }
      </div>

      <p class="pie-legal">
        © ${site.nombre} ${new Date().getFullYear()}. Todos los derechos reservados.
      </p>
    </footer>
  `
}
