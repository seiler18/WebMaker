/* ============================================================
   SERVICIOS

   Ejemplo de rejilla de tarjetas. Se le pasa entero a renderTarjetas().

   `area` solo hace falta si activas `filtro: true`. Por debajo de una docena
   de tarjetas el filtro estorba más que ayuda: se ven todas de un vistazo.
   ============================================================ */

export const servicios = {
  id: 'servicios',
  eyebrow: '{{EYEBROW_SERVICIOS}}',
  titulo: '{{TITULO_SERVICIOS}}',
  subtitulo: '{{SUBTITULO_SERVICIOS}}',
  filtro: false,
  densidad: 'amplia',

  items: [
    {
      titulo: '{{SERVICIO_1}}',
      texto: '{{SERVICIO_1_TEXTO}}',
      icon: 'fa-solid fa-diagram-project',
    },
    {
      titulo: '{{SERVICIO_2}}',
      texto: '{{SERVICIO_2_TEXTO}}',
      icon: 'fa-solid fa-shield-halved',
    },
    {
      titulo: '{{SERVICIO_3}}',
      texto: '{{SERVICIO_3_TEXTO}}',
      icon: 'fa-solid fa-chart-line',
    },
  ],
}
