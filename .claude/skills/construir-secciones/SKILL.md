---
name: construir-secciones
description: Escribir el contenido real de las secciones de un sitio generado con WebMaker, a partir del briefing. Úsala después del andamiaje, cuando haya que rellenar los datos de cada sección, redactar los textos o añadir una sección que no venía en la plantilla.
---

# Construir las secciones

El andamiaje ya compila. Ahora se rellena, **una sección por vez**, en el
orden del briefing, con `npm run check` después de cada una.

Por qué de una en una: si rellenas cinco y algo falla, no sabes cuál. Y en un
sitio de cinco secciones no cuesta nada.

## El reparto: datos y presentación

```
src/data/<seccion>.js       ← TODO el texto del cliente
src/components/sections/    ← cómo se ve. No se toca para poner contenido.
```

**Ningún texto del cliente dentro de un componente.** Es la regla que hace que
cambiar «Servicios» por «Áreas de trabajo» sea editar una línea y no buscar
por todo el proyecto.

## Una idea por sección

Antes de escribir nada: **cada sección tiene UNA cosa que quiere que el
visitante entienda.** Si tiene dos, no tiene ninguna, y la respuesta es partirla
en dos secciones (una fila más en `site-map.js`), no apretar más contenido.

La cabecera que devuelve `seccion()` tiene tres niveles y están pensados para
leerse en cascada: `eyebrow` dice dónde estoy (13px, mayúsculas), `titulo` de
qué va (30-44px), `subtitulo` por qué me importa (18px, tenue). Úsalos los
tres o el título queda suelto; y no metas la idea principal en el subtítulo,
que es el que menos gente lee.

Los tamaños salen todos de la escala de `tokens.css` y `npm run check` no deja
escribir ninguno a mano. Si al rellenar una sección te dan ganas de agrandar un
texto, casi siempre lo que falla es la jerarquía de la sección, no el tamaño.
El porqué completo está en `referencia/acabado.md`.

## Rellenar un bloque de texto

`renderBloque` — para «Quiénes somos», «Historia», «Misión y visión», «Marco
legal». Cualquier sección que sea sobre todo prosa.

```js
export const quienesSomos = {
  id: 'nosotros',              // igual que en site-map.js
  eyebrow: 'Quiénes somos',
  titulo: 'Una empresa de ingeniería en el sur de Chile',
  subtitulo: 'Constituida en 2024 en Puerto Montt.',
  sinSeparador: true,          // primera sección tras el hero

  // `prosa` enciende las viñetas ▹ de las listas. Sin esa clase, un <ul>
  // sale sin marcador: es lo correcto en menús, no en texto.
  cuerpo: `
    <div class="prosa">
      <p>…</p>
      <ul><li>…</li></ul>
    </div>
  `,

  imagen: { src: 'assets/img/oficina.webp', alt: 'Descripción real de la foto' },
  ladoImagen: 'derecha',

  destacados: [
    { icon: 'fa-solid fa-bullseye', titulo: 'Misión', texto: '…' },
    { icon: 'fa-solid fa-eye',      titulo: 'Visión', texto: '…' },
  ],
}
```

La prosa se pinta en el tamaño de lectura (18px) y con ancho de medida: son
los dos ajustes que hacen que un texto largo se lea de corrido. No los toques
por sección.

Sin `imagen`, el texto se centra con ancho de lectura — también queda bien, y
es mejor que una foto de banco de imágenes que no dice nada.

El `alt` describe **lo que se ve**, para quien no puede verlo. No es un sitio
para repetir palabras clave: `alt="oficina"` no ayuda a nadie.

## Rellenar una rejilla de tarjetas

`renderTarjetas` — «Servicios», «Valores», «Equipo», «Proyectos», «Planes».

```js
export const servicios = {
  id: 'servicios',
  eyebrow: 'Qué hacemos',
  titulo: 'Servicios',
  subtitulo: '…',
  filtro: false,               // true solo con más de ~12 tarjetas
  densidad: 'amplia',          // 'compacta' con muchas tarjetas cortas

  items: [
    {
      titulo: 'Gestión de sistemas ISO',
      texto: 'Una o dos frases. Qué es y para quién.',
      icon: 'fa-solid fa-certificate',
      // area: 'Gestión',      // solo si filtro: true
      // enlace: { label: 'Ver detalle', href: '#…' },
    },
  ],
}
```

Reglas que se aprendieron a base de rehacerlo:

- **Icono O imagen, nunca los dos.** Dos elementos gráficos peleando dejan la
  tarjeta ruidosa.
- **Textos de largo parecido.** Con uno de tres líneas y otro de diez, la
  rejilla se ve descuadrada. Recorta el largo; el detalle va en un modal o en
  otra sección.
- **`filtro: true` solo por encima de ~12.** Con seis tarjetas el filtro
  estorba: ya se ven todas.
- **Iconos de Font Awesome 6**, con su prefijo: `fa-solid`, `fa-brands`.
  Con el prefijo de la 5 (`fas`, `fab`) el icono sale como un cuadrado vacío.

Las tarjetas entran **escalonadas** solas: la rejilla lleva
`data-anim-secuencia` y `reveal.js` calcula el retardo por la posición del
hijo. Añadir o quitar una tarjeta no obliga a tocar nada.

## El hero

Lo único que lee alguien que llega de un buscador. Tres reglas:

- **Bajada de dos frases.** No tres. Y no encoge en móvil: es la frase que
  explica el negocio y el teléfono es donde más gente la lee.
- **Dos botones.** El primero es el que de verdad quieres que pulsen; el
  segundo, la alternativa razonable. Con cuatro no destaca ninguno.
- **`cinta` solo con cifras verificables.** Un «+500 clientes» inventado se
  huele y cuesta más credibilidad de la que aporta. Déjala vacía si no hay
  números reales — el hero funciona igual.

## Contacto

`src/data/contacto.js`. Lo importante:

- `correo` es el buzón de FormSubmit. **La primera vez hay que confirmarlo**:
  se manda un envío desde el sitio publicado y se acepta el correo que llega.
  Hasta entonces el formulario responde «pendiente de confirmación», y eso es
  lo que se le enseña al visitante en vez de un «enviado» que sería mentira.
- `whatsapp` en formato internacional sin signos (`56912345678`). Vacío hace
  desaparecer el botón solo.
- `canales` es lo que se ve al lado del formulario. Un sitio de empresa sin
  dirección visible genera desconfianza; si no hay oficina, pon comuna y
  región.
- **Nunca una clave de API aquí.** Esto se compila a un `.js` que GitHub Pages
  sirve en claro.

## Una sección que no encaja en ningún bloque

Antes de escribir un componente nuevo, comprueba que de verdad no sirve
`bloque` ni `tarjetas` — la mayoría de secciones de un sitio corporativo son
uno de los dos.

Si de verdad hace falta, `referencia/catalogo-secciones.md` tiene las recetas
(línea de tiempo, preguntas frecuentes, tabla comparativa, galería) con el
componente y los estilos.

Al crear uno nuevo:

1. `src/components/sections/<nombre>.js`, envolviendo con `seccion()`.
2. Estilos en `src/styles/components.css`, **solo con tokens**: sin colores,
   sin tamaños de letra y sin duraciones escritos a mano. `npm run check`
   (puntos 8, 9 y 10) rechaza los tres, así que esto no es una recomendación.
3. Si hay hermanos que entran juntos, `data-anim-secuencia` en el contenedor y
   `data-anim` en cada hijo. Variantes: `subir`, `aparecer`, `escala`,
   `lateral` — una por sección, no las cuatro.
4. Si algo es pulsable: los cuatro estados (normal, `:hover` **dentro de**
   `@media (hover: hover)`, `:active` fuera, `:focus-visible`), y 44px de alto
   mínimo en el bloque `@media (pointer: coarse)` de `responsive.css`.
5. Si necesita conducta, una función `init<Nombre>()` y llamarla en `main.js`.
6. Fila en `src/site-map.js`.
7. `npm run check`.

## Al terminar cada sección

```bash
npm run check
```

Y al terminar todas:

```bash
npm run build && npm run preview
```

Después pídele la revisión visual al usuario. Lo que tú puedes afirmar es que
compila, que las rutas existen y que responde 200 — no que se ve bien.
