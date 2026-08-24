---
name: editar-contenido
description: Cambiar textos, datos, tarjetas, imágenes o datos de contacto del sitio. Úsala cuando el usuario diga "cambia este texto", "corrige el teléfono", "añade un servicio", "quita esta tarjeta" o aporte contenido nuevo para una sección que ya existe.
---

# Editar el contenido

Casi todo lo que se pide a diario es esto, y casi siempre es **un archivo de
`src/data/`**. Si te encuentras editando algo en `src/components/`, párate: o
es un cambio de presentación (y entonces sí va ahí) o te has equivocado de
archivo.

## Dónde vive cada cosa

| Lo que quieren cambiar | Archivo |
|---|---|
| Nombre, lema, logo, armazón, redes, descargas | `src/data/site.js` |
| Portada: antetítulo, bajada, botones, cifras | `src/data/hero.js` |
| Correo, WhatsApp, teléfono, dirección, motivos | `src/data/contacto.js` |
| El texto de una sección de prosa | `src/data/<seccion>.js` → `cuerpo` |
| Una tarjeta (servicio, proyecto, persona) | `src/data/<seccion>.js` → `items` |
| Título o bajada de una sección | `src/data/<seccion>.js` → `titulo` / `subtitulo` |
| El orden de las secciones o su etiqueta en el menú | `src/site-map.js` |

Si no encuentras un texto:

```bash
grep -rn "el texto que buscas" src/
```

## Reglas al escribir contenido

- **HTML permitido en `cuerpo`**, y solo ahí. Los `<ul>` van dentro de
  `<div class="prosa">` para que salgan las viñetas ▹; sin esa clase el
  marcador no aparece (es lo correcto en menús, no en texto).
- **`alt` que describa lo que se ve.** Es para quien no puede ver la imagen,
  no para meter palabras clave. `alt="oficina"` no ayuda a nadie.
- **Iconos con prefijo de Font Awesome 6:** `fa-solid fa-house`. Con el
  prefijo de la 5 (`fas fa-home`) sale un cuadrado vacío.
- **Textos de tarjetas de largo parecido.** Con uno de tres líneas y otro de
  diez la rejilla se ve descuadrada.
- **Ningún dato inventado.** Si el usuario pide «pon algo» para una cifra o
  una dirección, pregunta o déjalo fuera. Un número falso en el sitio de una
  empresa es un problema real, no un placeholder.

## Añadir una imagen

1. A `assets/img/`, en **WebP** y con nombre en minúsculas sin espacios.
   Si viene pesada, ver skill `optimizar-imagenes`.
2. Referenciarla desde el archivo de datos: `assets/img/nombre.webp`.
3. `npm run check` — confirma que la ruta existe de verdad.

No hace falta tocar `copy-assets.js`: `assets/img` ya está declarada.

## Quitar contenido

- **Una tarjeta:** borra su objeto de `items`.
- **Una sección entera:** su fila de `src/site-map.js` y su archivo de datos.
  El menú, el scroll-spy y el pie se ajustan solos.
- **El botón de WhatsApp:** deja `contacto.whatsapp` en cadena vacía. El botón
  desaparece solo.

## Comprobar

```bash
npm run check
npm run dev        # para ver el cambio mientras lo haces
```

Antes de publicar, `npm run preview` (no `dev`): es el único modo que
reproduce las rutas de producción.

Y si el cambio afecta a cómo se ve, pídele la pasada visual al usuario. Tú
puedes afirmar que compila y que las rutas existen, no que se ve bien.

## Después

Un cambio de texto no es un hito. Una tanda de contenido nuevo que cambia lo
que el sitio cuenta, sí: skill `registrar-hito`.
