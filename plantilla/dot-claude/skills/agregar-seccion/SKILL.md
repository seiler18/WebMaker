---
name: agregar-seccion
description: Crear una sección nueva del sitio, integrada con el menú y el scroll-spy, o quitar una existente. Úsala cuando el usuario pida "agregar una sección", "una parte nueva a la página", "poner un apartado de X", mover contenido a su propio bloque, o quitar una sección que ya no aplica.
---

# Agregar (o quitar) una sección

`src/site-map.js` es la fuente de verdad. Una fila ahí y la sección aparece
en el DOM, en el menú, en el pie y en el scroll-spy. **No hay ningún otro
archivo que mantener sincronizado.**

## 1. ¿Hace falta un componente nuevo?

Casi nunca. Comprueba primero:

| El contenido es… | Usa | Copia de partida |
|---|---|---|
| Sobre todo prosa, con o sin imagen | `renderBloque` | `src/data/quienes-somos.js` |
| Una lista de cosas comparables | `renderTarjetas` | `src/data/servicios.js` |

La mayoría de secciones de un sitio corporativo son una de las dos. Para lo
que de verdad no encaja (línea de tiempo, preguntas frecuentes, tabla
comparativa, galería), las recetas están en
`../WebMaker/referencia/catalogo-secciones.md`.

## 2. El archivo de datos

`src/data/<seccion>.js`. El `id` de dentro tiene que ser **el mismo** que el
de la fila del mapa.

```js
export const proyectos = {
  id: 'proyectos',
  eyebrow: 'Qué hemos hecho',
  titulo: 'Proyectos',
  subtitulo: 'Una frase de contexto.',
  items: [
    { titulo: '…', texto: '…', icon: 'fa-solid fa-diagram-project' },
  ],
}
```

## 3. La fila en el mapa

En `src/site-map.js`, **en la posición vertical que tendrá en la página**:

```js
import { renderTarjetas } from './components/sections/tarjetas.js'
import { proyectos } from './data/proyectos.js'

// …dentro de `mapa`, en su sitio:
{
  id: 'proyectos',
  label: 'Proyectos',
  short: 'Proyectos',        // ~8 caracteres: es la etiqueta de móvil
  icon: 'fa-solid fa-diagram-project',
  render: () => renderTarjetas(proyectos),
},
```

Sobre el `id`: minúsculas, sin acentos ni espacios. **Va en la URL** y se
comparte como enlace, así que una vez publicado no se cambia.

Sobre `short`: es lo que se ve en la barra inferior de móvil (armazón
`sidebar`) y en el cajón. Más de ~8 caracteres y se parte en dos líneas.

Con `enMenu: false` la sección existe en la página pero no se enlaza. Útil
para un aviso legal al que solo se llega desde el pie.

## 4. Comprobar

```bash
npm run check
```

El verificador confirma que la sección está en el DOM, que el orden coincide
con el mapa, que no hay ids duplicados y que sus rutas de imagen existen.

```bash
npm run dev
```

## Quitar una sección

Borra su fila del mapa y su archivo de datos. Nada más — y **revisa que no
quede un `import` huérfano** en `site-map.js`, que es un error de módulo y deja
la página en blanco.

Antes de quitarla, comprueba si algo la enlaza:

```bash
grep -rn "#el-id-que-vas-a-quitar" src/
```

`npm run check` avisa igual de las anclas que quedan huérfanas, pero es mejor
saberlo antes.

## Si hay que escribir un componente

1. `src/components/sections/<nombre>.js`, envolviendo con `seccion()` para
   heredar separador, contenedor de ancho y cabecera.
2. Estilos en `src/styles/components.css`, **solo con tokens**: ni un color, ni
   un tamaño de letra, ni una duración escritos a mano. El verificador rechaza
   los tres (puntos 8, 9 y 10), así que no es una recomendación. Los tamaños se
   eligen por PAPEL entre los `--txt-*`, no por parecido.
3. Si hay hermanos que entran juntos, `data-anim-secuencia` en el contenedor y
   `data-anim` en cada hijo (`subir`, `aparecer`, `escala`, `lateral`). Sin eso
   aparecen todos a la vez, que se lee como un salto de la página.
4. Si algo es pulsable: los cuatro estados —normal, `:hover` **dentro de**
   `@media (hover: hover)`, `:active` fuera, `:focus-visible`— y 44px de alto
   mínimo en el bloque `@media (pointer: coarse)` de `responsive.css`. En
   táctil no hay hover: lo que acusa el toque es `:active`.
5. Anima `transform` u `opacity`. Cualquier otra propiedad repinta la maqueta
   en cada fotograma y se nota en un teléfono de gama media.
6. Si necesita conducta, exporta `init<Nombre>()` y llámala en `src/main.js`.
7. Fila en el mapa.
8. `npm run check`, y después la skill `revisar-acabado`.

Y si el bloque nuevo podría servirle a otro sitio, dilo: sube a la plantilla
de WebMaker y se registra como hito allí.

## Después

Una sección nueva **sí** es un hito: skill `registrar-hito`. Anota también por
qué se añadió — dentro de seis meses la pregunta será si sigue haciendo falta.
