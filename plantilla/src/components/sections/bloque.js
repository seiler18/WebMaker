import { seccion } from '../seccion.js'

/* ============================================================
   BLOQUE DE TEXTO (con imagen opcional al lado)

   El caballo de batalla: «Quiénes somos», «Nuestra historia», «Misión y
   visión», «Marco legal». Cualquier sección que sea sobre todo prosa.

   Con `imagen` la maqueta pasa a dos columnas; sin ella, el texto se centra
   con ancho de lectura. En móvil siempre es una columna, con la imagen
   arriba (responsive.css).
   ============================================================ */

/**
 * @param {Object} b
 * @param {string} b.id · b.eyebrow · b.titulo · b.subtitulo  → ver seccion()
 * @param {string} b.cuerpo        HTML del texto principal (<p>, <ul>…).
 * @param {Object} [b.imagen]      { src, alt }. Ruta relativa a la raíz.
 * @param {'izquierda'|'derecha'} [b.ladoImagen='derecha']
 * @param {Array}  [b.destacados]  [{ icon, titulo, texto }] en fila bajo el texto.
 * @param {boolean}[b.sinSeparador]
 */
export function renderBloque(b) {
  const destacados = b.destacados?.length
    ? `
      <ul class="destacados" data-anim-secuencia>
        ${b.destacados
          .map(
            d => `
          <li class="destacado" data-anim="subir">
            ${d.icon ? `<i class="${d.icon}" aria-hidden="true"></i>` : ''}
            <div>
              <strong>${d.titulo}</strong>
              ${d.texto ? `<p>${d.texto}</p>` : ''}
            </div>
          </li>
        `
          )
          .join('')}
      </ul>
    `
    : ''

  const imagen = b.imagen
    ? `
      <figure class="bloque-figura" data-anim="escala">
        <img src="${b.imagen.src}" alt="${b.imagen.alt}" loading="lazy">
        ${b.imagen.pie ? `<figcaption>${b.imagen.pie}</figcaption>` : ''}
      </figure>
    `
    : ''

  // data-lado lo lee el CSS para invertir el orden de las columnas sin
  // cambiar el orden del HTML: quien navega con lector de pantalla o con
  // teclado recorre siempre texto → imagen, que es el orden que tiene sentido.
  const cuerpo = b.imagen
    ? `
      <div class="bloque-dos-columnas" data-lado="${b.ladoImagen || 'derecha'}" data-anim-secuencia>
        <div class="bloque-texto" data-anim="subir">${b.cuerpo}</div>
        ${imagen}
      </div>
      ${destacados}
    `
    : `
      <div class="bloque-texto centrado" data-anim="subir">${b.cuerpo}</div>
      ${destacados}
    `

  return seccion({ ...b, contenido: cuerpo })
}
