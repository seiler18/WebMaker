import { seccion } from '../seccion.js'

/* ============================================================
   REJILLA DE TARJETAS

   Para «Servicios», «Valores», «Equipo», «Proyectos», «Planes»… cualquier
   lista de elementos comparables.

   ES UNA REJILLA, NO UN CARRUSEL, y es deliberado. En el proyecto del que
   sale esta plantilla el carrusel costó tres hitos de arreglos: alto que
   saltaba entre diapositivas, flechas que se comían el clic de los botones
   y una maqueta que se descuadraba en móvil. Una rejilla `auto-fill` no
   tiene ninguno de esos problemas, lo enseña todo de un vistazo y en móvil
   se apila sola. Si el contenido no cabe, la respuesta es filtrar (como en
   `filtro: true`), no esconderlo detrás de flechas.

   Con más de ~12 tarjetas, activa `filtro: true` y da a cada tarjeta un
   campo `area`: aparecen botones para acotar por área.
   ============================================================ */

/**
 * @param {Object}  t
 * @param {string}  t.id · t.eyebrow · t.titulo · t.subtitulo → ver seccion()
 * @param {Array}   t.items   [{ titulo, texto, icon?, imagen?, area?, enlace? }]
 * @param {boolean} [t.filtro] Botonera para acotar por `area`.
 * @param {'compacta'|'amplia'} [t.densidad='amplia']
 */
export function renderTarjetas(t) {
  const items = t.items || []

  const tarjeta = item => {
    // Con imagen se pone portada; sin ella, el icono en grande. Nunca los
    // dos: dos elementos gráficos peleando dejan la tarjeta ruidosa.
    const cabecera = item.imagen
      ? `<div class="tarjeta-portada"><img src="${item.imagen.src}" alt="${item.imagen.alt}" loading="lazy"></div>`
      : item.icon
        ? `<div class="tarjeta-icono"><i class="${item.icon}" aria-hidden="true"></i></div>`
        : ''

    const enlace = item.enlace
      ? `
        <p class="tarjeta-accion">
          <a class="btn-linea" href="${item.enlace.href}"
             ${item.enlace.externo ? 'target="_blank" rel="noopener noreferrer"' : ''}>
            ${item.enlace.label}
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </a>
        </p>
      `
      : ''

    return `
      <article class="tarjeta" ${item.area ? `data-area="${item.area}"` : ''} data-anim="subir">
        ${cabecera}
        <div class="tarjeta-cuerpo">
          <h3 class="tarjeta-titulo">${item.titulo}</h3>
          ${item.texto ? `<p class="tarjeta-texto">${item.texto}</p>` : ''}
          ${enlace}
        </div>
      </article>
    `
  }

  // Botonera de filtro. El contador ayuda a decidir antes de pulsar.
  let filtros = ''
  if (t.filtro) {
    const areas = [...new Set(items.map(i => i.area).filter(Boolean))]
    const boton = (valor, etiqueta, n) => `
      <button type="button" class="filtro ${valor === 'todas' ? 'is-active' : ''}"
              data-filtro="${valor}">
        ${etiqueta} <span class="filtro-cuenta">${n}</span>
      </button>
    `
    filtros = `
      <div class="filtros" role="group" aria-label="Filtrar por área" data-anim="subir">
        ${boton('todas', 'Todas', items.length)}
        ${areas.map(a => boton(a, a, items.filter(i => i.area === a).length)).join('')}
      </div>
    `
  }

  const contenido = `
    ${filtros}
    <!-- data-anim-secuencia: las tarjetas entran escalonadas en vez de todas
         a la vez. Va en la rejilla y no en cada tarjeta porque el retardo lo
         calcula reveal.js con la posición del hijo: añadir una tarjeta no
         obliga a renumerar nada. -->
    <div class="rejilla" data-densidad="${t.densidad || 'amplia'}" data-rejilla="${t.id}"
         data-anim-secuencia>
      ${items.map(tarjeta).join('')}
    </div>
    <p class="rejilla-vacia" hidden>No hay nada en esta área todavía.</p>
  `

  return seccion({ ...t, contenido })
}

/**
 * Engancha las botoneras de filtro. Idempotente y sin dependencias: si no
 * hay ninguna rejilla con filtro, no hace nada.
 *
 * El filtrado usa el atributo `hidden` en vez de una clase para que la
 * tarjeta desaparezca también del árbol de accesibilidad: una tarjeta oculta
 * solo con CSS la sigue leyendo el lector de pantalla.
 */
export function initTarjetas() {
  for (const grupo of document.querySelectorAll('.filtros')) {
    const seccionEl = grupo.closest('.section')
    const rejilla = seccionEl?.querySelector('.rejilla')
    const vacia = seccionEl?.querySelector('.rejilla-vacia')
    if (!rejilla) continue

    grupo.addEventListener('click', evento => {
      const boton = evento.target.closest('[data-filtro]')
      if (!boton) return

      for (const b of grupo.querySelectorAll('[data-filtro]')) {
        b.classList.toggle('is-active', b === boton)
      }

      const area = boton.dataset.filtro
      let visibles = 0
      for (const tarjeta of rejilla.querySelectorAll('.tarjeta')) {
        const mostrar = area === 'todas' || tarjeta.dataset.area === area
        tarjeta.hidden = !mostrar
        if (mostrar) visibles++
      }
      if (vacia) vacia.hidden = visibles > 0
    })
  }
}
