# 0006 — La cinta inferior del celular es el estándar

- **Fecha:** 2026-09-30
- **Estado:** completado
- **Origen:** FinanzasMaker y el Curriculo ya enseñaban en el celular una
  cinta fija de navegación abajo, y el usuario quiso que fuera la norma de
  todos los proyectos, empezando por la plantilla.

## Contexto

La plantilla tenía dos comportamientos móviles: el armazón `sidebar` se
convertía en cinta inferior, pero el `topbar` (el que usan CEDER, el hub y
`sistemas-gestion`) escondía los enlaces en un cajón desplegable con botón
hamburguesa.

## Qué se hizo

- `plantilla/src/styles/responsive.css` — bajo 991.98px los dos armazones
  comparten la misma cinta inferior (`:is(.topbar-nav, .sidenav)`), con
  `.topbar` sin `backdrop-filter` para que el `fixed` cuelgue de la pantalla.
- `plantilla/src/components/shell.js` — fuera el botón de menú y `initShell()`;
  las descargas salen del `<nav>` para quedarse arriba en móvil.
- `plantilla/src/styles/layout.css`, `main.js` — se quitan `.menu-boton` y la
  llamada a `initShell`.
- `referencia/trampas.md` (21), `arquitectura.md`, skills — al día.
- Propagado a CEDER, el hub (`seiler18.github.io`) y `sistemas-gestion`.

## Qué se descartó

- **Dejar el cajón como opción** (`site.movil: 'cajon' | 'cinta'`). Dos
  comportamientos son dos cosas que mantener; en ningún proyecto se ha
  querido el cajón.

## Qué quedó

- Al añadir elementos flotantes abajo (avisos, botón de WhatsApp…) hay que
  subirlos sobre `--barra-movil-h` más `env(safe-area-inset-bottom)`.
