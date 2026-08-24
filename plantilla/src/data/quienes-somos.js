/* ============================================================
   QUIÉNES SOMOS

   Ejemplo de bloque de texto. Se le pasa entero a renderBloque().
   El `cuerpo` admite HTML: párrafos, listas, <strong>.
   ============================================================ */

export const quienesSomos = {
  id: 'nosotros',
  eyebrow: '{{EYEBROW_NOSOTROS}}',
  titulo: '{{TITULO_NOSOTROS}}',
  subtitulo: '{{SUBTITULO_NOSOTROS}}',

  // La primera sección tras el hero no lleva separador: el propio corte del
  // hero ya marca el cambio de zona y dos marcas seguidas sobran.
  sinSeparador: true,

  cuerpo: `
    <p>{{PARRAFO_1}}</p>
    <p>{{PARRAFO_2}}</p>
  `,

  // Quita el bloque entero si no hay imagen: sin `imagen` el texto se centra
  // con ancho de lectura, que también queda bien.
  imagen: null,
  ladoImagen: 'derecha',

  destacados: [
    // { icon: 'fa-solid fa-bullseye', titulo: 'Misión', texto: '…' },
  ],
}
