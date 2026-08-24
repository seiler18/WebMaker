/* ============================================================
   PORTADA

   Lo primero que se lee. Tres reglas aprendidas:

     · `bajada` en dos frases como máximo. Es lo único que lee alguien que
       llega de un buscador y decide en dos segundos si sigue.
     · Dos acciones, no cinco. La primera es la que de verdad quieres que
       pulsen; la segunda, la alternativa razonable. Tres o más y ninguna
       destaca.
     · `cinta` solo con cifras verificables. Un número inventado se nota y
       cuesta más credibilidad de lo que aporta. Déjala vacía si no hay.
   ============================================================ */

export const hero = {
  antetitulo: '{{ANTETITULO}}',
  bajada: '{{BAJADA}}',

  acciones: [
    { label: 'Conócenos', href: '#nosotros', icon: 'fa-solid fa-arrow-down' },
    { label: 'Contacto', href: '#contacto', icon: 'fa-solid fa-paper-plane' },
  ],

  // [{ dato: '15', pie: 'años de experiencia' }]
  cinta: [],

  // Id de la sección a la que apunta la flecha de «hay más abajo».
  siguiente: 'nosotros',
}
