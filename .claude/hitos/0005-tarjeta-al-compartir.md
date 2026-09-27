# 0005 — La tarjeta al compartir es una captura del sitio

- **Fecha:** 2026-09-27
- **Estado:** completado
- **Origen:** al compartir el enlace del hub no salía imagen, y el del
  Curriculo enseñaba una firma vieja que no representa el sitio de hoy.

## Contexto

La plantilla pedía un `assets/img/og.webp` sin decir qué debía ser. Cada
sitio lo resolvió distinto: CEDER con una tarjeta de texto hecha a mano, el
hub y `sistemas-gestion` quitando la línea (sin imagen), el Curriculo con la
firma. FinanzasMaker y el gestor de acciones, que no salen de WebMaker, no
tenían ninguna etiqueta `og:`.

## Qué se hizo

- `plantilla/index.html` — `og:image` pasa a `og.jpg` con tipo, ancho y alto
  declarados; el `logo` del JSON-LD apunta al favicon (una captura no es un
  logo).
- `referencia/trampas.md` — trampa 33: la receta de captura con Chrome
  headless + ImageMagick, y cómo refrescar la caché de LinkedIn y WhatsApp.
- `plantilla/_MARCADORES.md` y la skill `generar-andamiaje` — el `og.jpg` se
  hace después del primer deploy, no antes.
- En los sitios: captura nueva en el hub, Curriculo, CEDER,
  `sistemas-gestion`, FinanzasMaker y gestor de acciones.

## Qué se descartó

- **WebP para la tarjeta.** Pesa menos, pero LinkedIn no lo pinta.
- **Tarjetas de texto diseñadas a mano** (como la que tenía CEDER). Envejecen
  en silencio: nadie las rehace cuando cambia el sitio, y una captura se
  rehace con dos comandos.
- **Capturar el catálogo de VentasMaker.** Muestra «Cerrado · abre mañana»,
  que depende de la hora; se queda con la portada de la tienda.

## Qué quedó

- La maqueta de OPCIONES (`docs/`) no tiene etiquetas `og:`. Se genera desde
  WordPress con `publicar-maqueta`, así que se arregla en el generador con
  Local arrancado, no a mano.
- Las capturas no se rehacen solas: si cambia la portada de un sitio, hay que
  volver a capturar (trampa 33).
