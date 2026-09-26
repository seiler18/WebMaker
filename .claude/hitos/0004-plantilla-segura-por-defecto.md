# 0004 — Plantilla segura por defecto

- **Fecha:** 2026-09-26
- **Estado:** completado
- **Origen:** auditoría de seguridad de todos los repositorios del
  portafolio. Los hallazgos de los sitios ya generados (CEDER,
  `seiler18.github.io`, `sistemas-gestion`) y del Curriculo se remontaron
  aquí para que el siguiente sitio no los repita.

## Contexto

La plantilla ya salía con SRI, `rel="noopener"` vigilado por el verificador y
permisos mínimos en el workflow. Lo que quedaba abierto eran concesiones
hechas «por si acaso» que nadie volvió a comprobar, y dos huecos que solo se
ven al mirar sitios hijos reales.

## Qué se hizo

- `plantilla/index.html` — la CSP pierde `'unsafe-inline'` en `script-src`.
  Se justificaba por un polyfill en línea que Vite 8 no genera: se comprobó
  materializando la plantilla, construyendo y abriendo el build y el modo dev.
- `plantilla/scripts/check-integrity.js` — el punto 13 cubre también los
  `window.open` sin `noopener` de `src/`; el punto 17 falla si falta la CSP y
  avisa si `script-src` vuelve a llevar `'unsafe-inline'`.
- `plantilla/dot-github/workflows/deploy.yml` — acciones fijadas por SHA (con
  la versión en comentario) y Node 24: Node 20 dejó de recibir parches en
  abril de 2026.
- `plantilla/dot-gitignore` — ignora `.env*`, `.claude/settings.local.json`
  y `.playwright-cli/`.
- `referencia/seguridad.md` — CSP de ejemplo al día, acciones por SHA,
  `window.open` y una sección sobre pintar datos externos como texto.
- `referencia/trampas.md` — trampas 31 (datos de una API pintados con
  `innerHTML`) y 32 (acción de terceros fijada por etiqueta).

## Decisiones y alternativas descartadas

**SHA y no etiqueta, pero sin subir de versión mayor.** Se fijó cada acción a
la misma versión que ya se usaba. Subir `checkout` y `setup-node` a sus
mayores nuevas es un cambio de comportamiento y va aparte.

**`'unsafe-inline'` en `style-src` se queda.** Los componentes escriben
propiedades personalizadas en línea (`style="--i:3"`) y el riesgo de un estilo inyectado es muy inferior al de un
script. Lo que se cierra es `script-src`, que es donde está el XSS.

## Consecuencias

- Los sitios ya generados no heredan esto solos. CEDER,
  `seiler18.github.io` y `sistemas-gestion` recibieron a mano la CSP sin
  `'unsafe-inline'` y Node 24 el mismo día; las acciones por SHA siguen
  pendientes en ellos.
- Un sitio nuevo que meta un script en línea no pasa `npm run check`.

## Pendiente

- Subir `actions/checkout` y `actions/setup-node` a sus versiones mayores
  actuales: las v4 corren sobre el runtime Node 20 que GitHub está retirando.
