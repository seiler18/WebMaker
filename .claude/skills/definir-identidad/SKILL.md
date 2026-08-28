---
name: definir-identidad
description: Elegir la paleta de color, la tipografía y el armazón de navegación de un sitio web antes de construirlo. Úsala tras el briefing y antes de generar el andamiaje, o cuando el usuario quiera cambiar el aspecto de un sitio ya hecho ("cámbiale los colores", "no me gusta cómo se ve", "quiero que se vea más serio").
---

# Definir la identidad

Tres decisiones. Se resuelven en **una** tanda de preguntas, con las opciones
ya preparadas — no en una conversación abierta sobre gustos.

Entrada: `briefing.md` (el público y el objetivo mandan aquí).
Salida: paleta, tipografía y armazón anotados en el briefing.

## Decisión 1 — Armazón

| | `topbar` | `sidebar` |
|---|---|---|
| Escritorio | Barra superior fija | Columna fija a la izquierda |
| Móvil | Menú desplegable | Barra inferior de iconos |
| Se espera en | Sitios de empresa, servicios, productos | Currículos, portafolios, fichas técnicas |
| Fuerte en | Familiaridad. Nadie tiene que aprender nada | Recorrer muchas secciones de un tirón |
| Flojo en | Con 7+ secciones los enlaces se aprietan | Se come 250px de ancho; poco convencional para una empresa |

Regla práctica: **una empresa que quiere parecer seria, `topbar`.** Una
persona o un proyecto que quiere destacar y tiene 5-7 secciones, `sidebar`.

Cambiar de opinión después cuesta una línea (`site.armazon`), así que no es
una decisión para agonizar.

## Decisión 2 — Paleta

Las paletas listas están en `referencia/paletas.md`, con sus tokens ya
escritos. Preséntale dos o tres al usuario según el sector, no las ocho.

Si el usuario tiene logo, **la paleta sale del logo**, no del catálogo: saca
los dos o tres colores dominantes y ajusta los tokens. Un sitio con colores
que pelean con el logo se ve amateur por muy bonitos que sean por separado.

Lo que no se negocia, sea cual sea la paleta:

- **Contraste suficiente.** Texto tenue sobre fondo oscuro tiene que llegar a
  4.5:1. La plantilla lo cumple; si aclaras los fondos, revísalo.
- **Ningún color literal fuera de `tokens.css`.**
- **Un solo acento.** Dos colores de acento compitiendo dejan la página sin
  jerarquía: deja de saberse qué es lo importante.

**Cambiar la paleta es sustituir el bloque de color base y nada más.** Los
tokens derivados (`--primario-tenue`, `--superficie-viva`, `--barra-fondo`,
`--velo`, `--superficie-velada`, los `--brillo-movil*`) salen con `color-mix()`
de esos colores y se recalculan solos: no los copies ni los edites. Si hace
falta un lavado nuevo, se añade a ese mismo bloque.

**Si eliges Papel Claro**, la única en claro, lee la advertencia al pie de
`referencia/paletas.md` antes de prometer plazos: hay cuatro cosas que ajustar
a mano —las luces animadas del fondo, los contornos oscuros de los títulos, los
degradados de texto y `--superficie-viva`— y **ninguna la detecta
`npm run check`**. Cuenta una hora, no dos minutos.

## Decisión 3 — Tipografía

Dos familias como máximo (títulos y texto). Tres se leen como un collage.

| Combinación | Se siente | Bien para |
|---|---|---|
| Raleway / Raleway | Limpio, técnico, neutro | Casi todo. Es la de la plantilla |
| Montserrat / Open Sans | Corporativo clásico | Consultoría, ingeniería, legal |
| Playfair Display / Lato | Con oficio, algo señorial | Estudios, arquitectura, salud privada |
| Space Grotesk / Inter | Actual, producto digital | Software, startups |

Se cambian en dos sitios y nada más:

1. El `<link>` de Google Fonts en `index.html`
2. `--fuente-titulos` y `--fuente-texto` en `src/styles/tokens.css`

Las variables llevan siempre un respaldo del sistema (`system-ui, sans-serif`)
para que el texto se lea aunque Google Fonts no cargue.

**Lo que NO se elige es la escala.** Los tamaños, interlineados y medidas de
línea están decididos en `tokens.css` —diez pasos, cada uno con un papel— y son
los mismos para cualquier tipografía. Cambiar de familia no es motivo para
tocarlos: si con la fuente nueva algo se ve pequeño, se cambia el paso que usa
ese elemento, no el valor del paso. El razonamiento está en
`referencia/acabado.md` y `npm run check` (punto 9) no deja escribir tamaños a
mano.

Lo único que **sí** conviene revisar al cambiar de familia es
`--tracking-display`, el espaciado entre letras de los títulos grandes: una
fuente ancha necesita más negativo que una condensada. Es un número, y se juzga
mirando el título de la portada.

## Cómo preguntar

Una tanda, tres preguntas, opciones concretas. Y una recomendación marcada:
«da igual, elige tú» es una respuesta frecuente y perfectamente válida para
esto — es estética, no un hecho de la empresa.

Lo que **no** hay que hacer es enseñarle ocho paletas y pedirle que compare.
Elige dos que encajen con su sector, di por qué, y ofrece la lista completa
solo si ninguna le convence.

## Anotarlo

En el briefing, en la tabla de Identidad: armazón, nombre de la paleta,
combinación tipográfica. Así `generar-andamiaje` no vuelve a preguntar y, seis
meses después, se sabe por qué el sitio es azul.
