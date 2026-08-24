# Arquitectura de la plantilla

Qué hace cada pieza y **por qué está así**. Si vas a cambiar algo estructural,
lee primero el apartado que le corresponde: casi todas las decisiones raras
tienen detrás un problema concreto.

## El árbol

```
<PROYECTO>/
├── CLAUDE.md                 ← cómo se trabaja en ESTE sitio
├── briefing.md               ← el contrato con el cliente
├── index.html                ← shell mínimo, un solo <div id="app">
├── vite.config.js            ← `base` debe ser /NOMBRE-DEL-REPO/
│
├── src/
│   ├── main.js               ← estilos + markup + conducta
│   ├── site-map.js           ← ★ FUENTE DE VERDAD de la navegación
│   ├── data/                 ← ★ TODO el contenido del cliente
│   │   ├── site.js           ← identidad, armazón, redes, descargas
│   │   ├── hero.js
│   │   ├── contacto.js
│   │   └── <seccion>.js
│   ├── components/
│   │   ├── seccion.js        ← envoltorio común (separador + cabecera)
│   │   ├── shell.js          ← las dos variantes de navegación
│   │   ├── footer.js
│   │   └── sections/         ← una función render*() por tipo de bloque
│   │       ├── hero.js · bloque.js · tarjetas.js · contacto.js
│   ├── lib/
│   │   ├── scrollspy.js      ← resalta la sección visible
│   │   ├── reveal.js         ← animación de entrada (sustituye a AOS)
│   │   └── modal.js          ← <dialog> nativo
│   └── styles/
│       ├── tokens.css        ← ★ paleta y medidas. Ningún color fuera de aquí
│       ├── base.css · layout.css · components.css
│       └── responsive.css    ← ★ SE IMPORTA EL ÚLTIMO
│
├── assets/{img,docs}/        ← lo que se publica
├── scripts/
│   ├── check-integrity.js    ← npm run check
│   └── copy-assets.js        ← post-build
├── tools/                    ← NO se publica (está en .gitignore)
└── .claude/{hitos,skills}/
```

Las tres ★ son las que hay que entender antes de tocar nada.

## Composición

`src/main.js` importa los estilos (en orden), recorre `site-map.js`
concatenando el HTML de cada sección y lo inyecta en `#app`. Después engancha
la conducta: scroll-spy, animaciones, menú móvil, filtros y formulario.

Los componentes son **funciones puras que devuelven strings**. No tocan el DOM.
Eso es lo que permite renderizar el sitio entero en Node y validarlo con
`npm run check` sin navegador.

## El registro único de secciones

En el sitio original el orden de las secciones vivía en un archivo y el render
en otro. Podían desincronizarse, y el scroll-spy —que compara posiciones en el
documento— empezaba a resaltar la sección equivocada. Hizo falta una regla en
el `CLAUDE.md` y una comprobación en el verificador para vigilarlo.

Aquí `site-map.js` lleva el enlace **y** el render en la misma fila. La clase
de error entera desaparece por construcción: no hay dos listas que puedan
discrepar. El verificador sigue comprobando el orden, pero como red de
seguridad, no como necesidad.

Añadir una sección = añadir una fila.

## Las dos variantes de armazón

`site.armazon` vale `'topbar'` o `'sidebar'`. `shell.js` monta una u otra y
`main.js` lo anuncia en `document.body.dataset.armazon`, que es lo que lee el
CSS.

Comparten los enlaces, el scroll-spy, las secciones y los tokens: lo único que
cambia es el chrome de navegación y su forma en móvil (cajón desplegable vs
barra inferior de iconos). Cambiar de una a otra es una línea.

## El scroll-spy no usa IntersectionObserver

Es la decisión que más extraña y la que tiene mejor motivo. Las secciones
tienen alturas muy dispares: el hero ocupa casi una pantalla, «Contacto»
media. Con IO hay momentos en que dos secciones cruzan el umbral a la vez y
otros en que ninguna lo cruza, y el resaltado parpadea.

Comparar la posición de scroll contra el inicio de cada sección da **siempre**
un único ganador. El cálculo va dentro de `requestAnimationFrame` para no leer
el layout en cada evento de scroll.

`reveal.js` **sí** usa IO, y también es correcto: ahí la pregunta es «¿este
elemento concreto ya se ve?», que es exactamente lo que IO responde, sin
ambigüedad entre candidatos.

## Sin framework de UI

El sitio original arrastraba Bootstrap 4 + jQuery + Popper por CDN. Buena
parte de sus hitos son arreglos de eso: peleas de `z-index` entre el modal y
la barra, altos de carrusel que saltaban, `.card-deck` descuadrado entre 576 y
768px, viñetas de lista colándose en los menús.

Lo que se usaba de verdad eran cuatro cosas, y todas caben en poco código:

| De Bootstrap/jQuery | Sustituto | Tamaño |
|---|---|---|
| Rejilla | CSS Grid `auto-fill` | 3 líneas |
| Modal | `<dialog>` nativo + `modal.js` | ~40 líneas |
| Carrusel | *nada* — rejilla filtrable | — |
| AOS (animación) | `reveal.js` con IO | ~40 líneas |

Resultado: el bundle de un sitio de cuatro secciones son ~19 KB de JS y ~22 KB
de CSS, sin CDNs de terceros salvo la tipografía y los iconos.

## Assets y el build

Vite procesa y hashea **solo** lo que se importa desde `main.js`. Las imágenes
que van en strings de HTML y los PDFs no los ve, y por eso
`scripts/copy-assets.js` los copia al `dist/` después del build.

→ Si añades una carpeta que deba llegar a producción, decláralo ahí. Es el
único sitio que lo sabe.

## El verificador

`npm run check` renderiza el sitio en Node y comprueba siete cosas que un
build correcto no detecta: marcadores sin rellenar, ids duplicados, orden de
secciones, modales huérfanos, archivos que no existen, `base` incoherente con
la URL de producción y anclas que no llevan a ningún sitio.

Va **dentro** de `npm run build`, así que un enlace roto hace fallar el deploy
en vez de llegar a producción. Es deliberado: mejor un workflow rojo que un
sitio publicado sin estilos.

## Cascada del CSS

```
tokens.css      variables. Ningún selector.
base.css        reinicio ligero, tipografía, foco, skip-link
layout.css      armazón y secciones
components.css  hero, botones, tarjetas, formulario, pie, modal
responsive.css  ★ EL ÚLTIMO
```

`responsive.css` va al final para que sus overrides ganen por orden de
cascada. Con eso la plantilla no tiene ni un `!important`. Si algún día
necesitas uno en un ajuste responsive, lo más probable es que el archivo se
haya movido de sitio.
