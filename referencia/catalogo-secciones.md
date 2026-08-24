# Catálogo de secciones

La plantilla trae cuatro tipos de bloque. **Casi todo cabe en dos de ellos.**
Antes de escribir un componente nuevo, comprueba esta tabla.

## Lo que ya existe

| Tipo | Componente | Para |
|---|---|---|
| Portada | `renderHero` | Lo primero que se ve. Uno por sitio |
| Prosa | `renderBloque` | Quiénes somos, historia, misión, marco legal, metodología |
| Rejilla | `renderTarjetas` | Servicios, valores, equipo, proyectos, planes, clientes, certificaciones |
| Contacto | `renderContacto` | Formulario + datos. Uno por sitio |

Secciones típicas de un sitio corporativo y con qué se hacen:

| Sección que pide el cliente | Se hace con |
|---|---|
| Quiénes somos / Nosotros | `bloque` |
| Misión, visión y valores | `bloque` con `destacados`, o `tarjetas` |
| Servicios / Áreas de trabajo | `tarjetas` |
| Equipo | `tarjetas` con `imagen` |
| Proyectos / Portafolio | `tarjetas` con `imagen` y `enlace` |
| Clientes | `tarjetas` `densidad: 'compacta'` |
| Certificaciones | `tarjetas` con `filtro: true` si son muchas |
| Metodología / Cómo trabajamos | `bloque` con `destacados` |
| Marco legal / Estatutos | `bloque` con `prosa` |
| Ubicación | `contacto` (los `canales` lo cubren) |

---

## Recetas para lo que no encaja

Estas hay que escribirlas. Cada una son ~30 líneas de componente y ~25 de CSS.
Están descritas, no implementadas: se añaden al proyecto que las necesite, no
a la plantilla, hasta que un segundo sitio pida la misma.

### Línea de tiempo

Para «Nuestra historia» o «Trayectoria» cuando el orden cronológico **es** el
contenido. Si no lo es, un `bloque` cuenta lo mismo con menos ruido.

- Datos: `[{ año, titulo, texto }]`
- Maqueta: una columna con línea vertical y un punto por hito. En móvil, línea
  a la izquierda y contenido a la derecha — **nunca alternando lados**: en una
  pantalla estrecha el zigzag se lee fatal.
- El punto va con `--degradado` y `box-shadow` de `--brillo-acento`, como el
  rombo del `.section-divider`, para que se vea de la misma familia.

### Preguntas frecuentes

- Datos: `[{ pregunta, respuesta }]`
- Maqueta: `<details>` + `<summary>` nativos. **No escribas un acordeón con
  JS**: `<details>` ya da el plegado, el estado y el teclado gratis, y funciona
  sin JavaScript.
- Estilo: quita el triángulo por defecto (`summary::marker`) y pon un chevron
  de Font Awesome que gire con `[open]`.
- Ojo: si necesitas que solo uno esté abierto a la vez, `name` compartido en
  los `<details>` lo hace sin JS.

### Tabla comparativa

Para planes o alternativas.

- Maqueta: `<table>` de verdad, no divs. Es una tabla: los lectores de
  pantalla la anuncian como tal y se puede recorrer por columnas.
- **Debe ir dentro de un contenedor con `overflow-x: auto`**, o en móvil
  desborda y hace que la página entera se desplace en horizontal.
- En móvil, si son más de tres columnas, mejor convertirla en tarjetas
  apiladas — una tabla de cinco columnas en 360px no se salva con scroll.

### Galería de imágenes

- Datos: `[{ src, alt, pie }]`
- Maqueta: rejilla `auto-fill` con `aspect-ratio` fijo y `object-fit: cover`.
  Al pulsar, abre `<dialog>` con la imagen grande (ya tienes `modal.js`).
- **`loading="lazy"` en todas menos las dos primeras.** Con veinte fotos sin
  eso, el sitio tarda una eternidad en el móvil de alguien con mala señal.
- Pásalas todas a WebP antes (`referencia/trampas.md` tiene el comando).

### Cifras destacadas

Números grandes con etiqueta.

- Ya existe como `hero.cinta`. Si hace falta fuera del hero, se extrae ese
  markup a su propio componente.
- **Solo cifras verificables.** Un número inventado se huele y cuesta más
  credibilidad de la que aporta.

### Testimonios

- Datos: `[{ cita, autor, cargo, empresa, foto? }]`
- Maqueta: `tarjetas` sirve casi tal cual — usa `<blockquote>` para la cita.
- **Con menos de tres, no hagas la sección.** Un testimonio solo se lee como
  «solo tenemos uno». Mejor meterlo dentro de `nosotros` como refuerzo.

---

## Al crear un componente nuevo

1. `src/components/sections/<nombre>.js`, envolviendo con `seccion()` para
   heredar separador, contenedor y cabecera.
2. Estilos en `src/styles/components.css`. Con tokens; ningún color literal.
3. Si necesita conducta, exporta `init<Nombre>()` y llámala en `main.js`.
4. Fila en `src/site-map.js`.
5. `npm run check`.

Y una regla de higiene: **si el bloque nuevo lo pide un segundo proyecto, sube
a la plantilla** y regístralo como hito de WebMaker. Si lo pidió solo uno, se
queda en ese proyecto. Así la plantilla crece con lo que se demuestra útil y
no con lo que pareció buena idea una vez.
