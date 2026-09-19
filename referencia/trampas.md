# Trampas conocidas

Errores ya cometidos, con su causa y su arreglo. Destilado de los catorce
hitos del sitio de currículum, más lo aprendido en el primer sitio de cliente
(CEDER SpA, hito [0002](../hitos/0002-correcciones-del-primer-sitio-de-cliente.md)).

Ordenados por lo que más veces ha roto un sitio. **De la 16 a la 21 son las
del primer sitio de cliente: todas salieron en la revisión visual, no del
código.** Esa es la señal de que estas son las que más caro se pagan: el
verificador no las ve.

**De la 22 a la 26 son las del acabado** (hito
[0003](../hitos/0003-sistema-de-acabado.md)), y tienen algo en común: cuatro de
las cinco solo se ven en un teléfono de verdad. Desde un escritorio el sitio
parece correcto.

**De la 27 a la 30 son las de la auditoría de seguridad y tipografía** (hito
[0004](../hitos/0004-endurecimiento-y-tipografia.md)), y tienen algo peor en
común: **ninguna se ve**. El sitio funciona, se ve bien y pasa la revisión
visual con las cuatro puestas. Por eso las cuatro están ahora en
`npm run check` — una regla que no se comprueba es una intención.

---

## 1. El `base` de Vite no coincide con el nombre del repo

**Síntoma:** el sitio publicado carga el texto pero sin estilos, y la consola
está llena de 404 de CSS y JS.

**Causa:** GitHub Pages sirve en `usuario.github.io/REPO/`, así que los assets
están bajo `/REPO/`. Con `base: '/'` el HTML los busca en la raíz del dominio.

**Arreglo:** `base: '/REPO/'` en `vite.config.js`, exactamente igual al nombre
del repositorio. `npm run check` lo compara con `site.url` y falla si no
cuadran, así que ya no puede llegar a producción.

---

## 2. Nombres de archivo con mayúsculas

**Síntoma:** una imagen se ve perfecta en local y da 404 publicada.

**Causa:** GitHub Pages (Linux) distingue mayúsculas. Windows no. `Logo.webp`
y `logo.webp` son el mismo archivo en tu máquina y dos distintos en producción.

**Arreglo:** copiar el nombre con `ls`, nunca de memoria. Y por costumbre,
nombres en minúsculas y sin espacios ni acentos.

---

## 3. Assets que Vite no ve

**Síntoma:** una imagen no aparece ni en `preview` ni publicada, aunque el
archivo existe.

**Causa:** Vite procesa (y hashea) **solo** lo que se importa desde
`main.js`: los CSS y las imágenes referenciadas *dentro* de esos CSS. Las
rutas que van en strings de HTML, los PDFs y las páginas estáticas sueltas no
las ve.

**Arreglo:** declararlas en `scripts/copy-assets.js`, que las copia al `dist/`
después del build. Es el único sitio que lo sabe.

---

## 4. `transform`, `filter` o `isolation` en el contenedor de un modal

**Síntoma:** el modal se abre por debajo de la barra de navegación.

**Causa:** cualquiera de los tres crea un **contexto de apilamiento**. El
modal, aunque tenga un `z-index` altísimo, solo compite dentro de ese
contexto, y el contexto entero queda por debajo de la barra.

**Arreglo en la plantilla:** el modal usa `<dialog>` y `modal.js` lo mueve al
final de `<body>` al abrirlo, así que no hay ancestro que pueda atraparlo. Si
vuelves a un modal normal, la regla es: nada de esas tres propiedades en el
contenedor del contenido.

---

## 5. Un `<a>` suelto dentro de un `<p>` para una fila de botones

**Síntoma:** en móvil, al envolver, las pastillas se solapan.

**Causa:** un elemento inline no reserva alto para su `padding`. El `<p>` se
dimensiona por el texto y los botones se pisan entre líneas.

**Arreglo:** un contenedor flex con `gap` (`.hero-acciones`,
`.contacto-acciones`). Nunca `<a>` sueltos en un párrafo.

---

## 6. Un aviso o pop-up que se recuerda «para siempre»

**Síntoma:** el aviso funcionaba, y de un día para otro dejó de salir.

**Causa:** se marcó como visto en `localStorage` sin caducidad, y uno de los
disparadores era llegar por scroll a la sección. Con visitar el sitio una vez
y bajar hasta abajo, desaparecía para siempre. Parece roto y no lo está.

**Arreglo:** guardar la **fecha**, no un `'1'`, y caducar el recuerdo (30 días
va bien). Ventaja añadida: el `'1'` de la versión vieja da `NaN`, se ignora y
el aviso vuelve solo sin que nadie borre nada.

---

## 7. `localStorage` sin `try/catch`

**Síntoma:** la página entera se queda en blanco en ventana privada o con las
cookies de sitio bloqueadas.

**Causa:** en esos modos `localStorage` **lanza al tocarlo**, no devuelve
`null`. Si la excepción sube, mata el script.

**Arreglo:** envolver cada lectura y cada escritura. Sin almacenamiento, el
peor caso es que el sitio no recuerde algo — mucho menos grave que no cargar.

---

## 8. Una transición que no se dispara tras cambiar `display`

**Síntoma:** el elemento aparece de golpe en vez de animarse.

**Causa:** acaba de pasar de `display: none` a visible. El navegador puede
agrupar ese cambio con el de la clase en el mismo fotograma, y sin estado
inicial no hay nada que interpolar.

**Arreglo:** forzar un reflow leyendo una propiedad de layout entre los dos
cambios: `void el.offsetHeight`. Y dejar el comentario, porque parece una
línea inútil y alguien la borrará.

---

## 9. Carruseles

**Síntoma:** el alto del panel salta entre diapositivas y arrastra el resto de
la página; las flechas se comen el clic del botón que hay debajo; en móvil las
tarjetas se apilan y la maqueta se descuadra.

**Causa:** un carrusel tiene que reconciliar contenidos de alturas distintas
en un contenedor de altura fija, y sus controles flotan sobre el contenido.
Tres hitos de arreglos en el sitio original, y aún así hubo que rehacerlo.

**Arreglo en la plantilla:** **no hay carrusel.** Una rejilla `auto-fill`
enseña todo, se apila sola en móvil, no tiene alto que igualar y no tapa nada.
Si el contenido no cabe, la respuesta es **filtrar**, no esconder detrás de
flechas.

---

## 10. `responsive.css` en cualquier otro sitio del orden de imports

**Síntoma:** los ajustes de móvil no se aplican y hay que ir poniendo
`!important`.

**Causa:** con la misma especificidad gana el último de la cascada. Si
`responsive.css` va antes que `components.css`, los estilos de escritorio lo
sobrescriben.

**Arreglo:** el último de la lista en `main.js`. Si algún día necesitas un
`!important` en un ajuste responsive, casi seguro es que se movió de sitio.

---

## 11. Colores literales fuera de `tokens.css`

**Síntoma:** cambiar la identidad del sitio es una cacería por todo el CSS y
siempre queda un azul viejo en algún borde.

**Arreglo:** todo color es un token. Si hace falta un tono que no está, se
añade con nombre y se usa por nombre.

---

## 12. Credenciales en el proyecto

**Síntoma:** cualquiera lee la clave con «ver código fuente».

**Causa:** GitHub Pages sirve todo en claro, y Vite compila `src/` a un `.js`
público. No hay «archivo de configuración privado».

**Arreglo:** nada de claves. El formulario usa FormSubmit precisamente porque
no necesita ninguna. Si una función pide credenciales, o va detrás de un
backend propio o el sitio se queda sin esa función.

---

## 13. Documentos del cliente dentro de la carpeta que se publica

**Síntoma:** los estatutos con RUT y domicilio de los socios quedan
descargables desde internet.

**Causa:** se dejaron en la raíz del proyecto y algo los copió al `dist/`.

**Arreglo:** los documentos fuente van a `tools/`, que está en el
`.gitignore`. Publicar uno es una decisión explícita: se copia a
`assets/docs/` y se declara en `copy-assets.js`.

---

## 14. Iconos con el prefijo de Font Awesome 5 en la 6

**Síntoma:** en vez del icono sale un cuadrado vacío o nada.

**Causa:** la 5 usa `fas fa-home`; la 6, `fa-solid fa-house`. Algunos nombres
también cambiaron (`fa-home` → `fa-house`).

**Arreglo:** la plantilla carga la 6. Prefijos `fa-solid` / `fa-regular` /
`fa-brands`. Si copias una clase de un ejemplo viejo, compruébala.

---

## 15. Dar por buena la revisión visual

**Síntoma:** se afirma que el sitio se ve bien y el usuario abre el celular y
no.

**Causa:** aquí no hay navegador automatizado. `npm run check`, `npm run
build` y códigos HTTP sobre `npm run preview` prueban que **funciona**, no que
**se ve bien**.

**Arreglo:** pedir la pasada visual y decir explícitamente qué se comprobó y
qué no. Es la diferencia entre un informe útil y uno que hay que verificar
igual.

---

## 16. Colores literales que sobreviven al cambio de paleta

**Síntoma:** se cambia la paleta y el sitio queda casi bien, pero el icono de
las tarjetas y el fondo del enlace activo del menú siguen con el azul de
antes. La barra de navegación se ve más azul que el resto de la página.

**Causa:** la plantilla tenía siete `rgba(37, 99, 235, …)` y
`rgba(10, 14, 26, …)` escritos a mano en `components.css`, `layout.css` y
`responsive.css` — el primario y el fondo de la paleta de fábrica. Al cambiar
`tokens.css` esos valores no se enteran. Es la regla 5 del `CLAUDE.md`
incumplida por la propia plantilla.

**Arreglo (ya en la plantilla):** son tokens derivados con `color-mix()` a
partir de `--primario`, `--bg`, `--bg-2` y `--surface`, así que cambian solos
con la paleta: `--primario-tenue`, `--primario-tenue-fuerte`,
`--superficie-viva`, `--barra-fondo`, `--barra-fondo-opaca`, `--velo`,
`--superficie-velada`. **Si necesitas un lavado nuevo, añádelo ahí con
color-mix; no lo escribas en el componente.**

Para cazarlos en cualquier sitio:

```bash
grep -rn "rgba([0-9]" src/styles/ | grep -v tokens.css | grep -vE "rgba\((0|255), *(0|255)"
```

Blancos y negros neutros (`rgba(255,255,255,…)`, `rgba(0,0,0,…)`) son
legítimos: no pertenecen a ninguna paleta.

---

## 17. `text-shadow` sobre un texto con `background-clip: text`

**Síntoma:** se le quiere dar contorno a un título de degradado y la sombra se
ve **por dentro** de las letras, como suciedad, en vez de rodearlas.

**Causa:** `.hero-titulo` y `.section-title` usan
`-webkit-text-fill-color: transparent`, así que el glifo **no tiene relleno**.
Una `text-shadow` se pinta debajo del texto y, al no haber relleno que la
tape, se ve a través.

**Arreglo:** `filter: drop-shadow(...)`, que actúa sobre el resultado ya
recortado y dibuja el borde por fuera. Dos capas funcionan mejor que una: una
pegada al trazo define el borde, otra abierta da profundidad.

```css
filter: drop-shadow(0 0 1px rgba(0,0,0,0.95)) drop-shadow(0 2px 4px rgba(0,0,0,0.75));
```

En un texto normal (con relleno), `text-shadow` es lo correcto. La diferencia
es si hay relleno o no.

---

## 18. El fondo del hero se corta en una línea recta

**Síntoma:** se ve una franja horizontal separando la portada de la primera
sección, como si fueran dos páginas pegadas.

**Causa:** `.hero` tiene `overflow: hidden` y su fondo (luces y rejilla)
termina exactamente en el borde inferior. Ese canto se lee como una línea.

**Arreglo (ya en la plantilla):** una máscara de desvanecido en `.hero-fondo`:

```css
mask-image: linear-gradient(to bottom, #000 0%, #000 58%, transparent 100%);
```

Dos detalles que importan:

- **Va en el contenedor, no en los pseudo-elementos.** El `::before` y el
  `::after` llevan `transform` animado; una máscara puesta ahí se movería con
  la animación y el punto de desvanecido bailaría.
- **Se desvanece a `transparent`, no a `var(--bg)`.** El fondo de la página no
  es `--bg` puro (tiene los halos de `body::before` encima), así que un
  degradado hacia `--bg` deja una banda oscura visible justo donde querías
  quitar una línea.

`mask` crea contexto de apilamiento: ahí es inofensivo, pero no la subas a un
ancestro del modal (trampa 4).

---

## 19. Un fondo animado que no se percibe

**Síntoma:** hay animación en el fondo, el `will-change` está puesto, y el
cliente dice que el fondo está quieto.

**Causa:** dos cosas a la vez. Las luces usaban los brillos tenues
(`--brillo`, alfa 0.20-0.25): una luz casi transparente se desplaza sin que se
note. Y estaban solo en la mitad superior, así que al bajar no había nada
moviéndose.

**Arreglo:** tokens aparte para esto (`--brillo-movil`,
`--brillo-movil-acento`, `--brillo-movil-frio`, alfa 0.24-0.42) y **un tercer
foco abajo**. No subas `--brillo`: ese token también alimenta bordes, sombras
de tarjeta y brillos de icono, donde tiene que seguir siendo discreto.

Y una regla de oficio: **el ciclo corto se nota, el largo no existe.** 15-22s
funciona; 40s es lo mismo que estático.

**Un patrón repetido se anima con `background-position`, no con `transform`.**
La rejilla se repite cada 54px: desplazarla exactamente 54px deja el dibujo
idéntico y el bucle es invisible. Con `transform` se movería también su máscara
y se vería entrar el borde del recuadro. Y en `linear`: una rejilla que acelera
y frena se lee como un fallo de rendimiento.

---

## 20. El menú de la barra superior se parte en dos líneas

**Síntoma:** con cinco o seis secciones, la barra crece al doble de alto y los
enlaces se reparten en dos filas.

**Causa:** dos, y hay que arreglar las dos:

1. `.nav-link` sin `white-space: nowrap` — una etiqueta de dos palabras se
   parte por dentro antes incluso de que el menú desborde.
2. El **lema de la marca**, que se lleva unos 250px de los 1180 del
   contenedor. Y encima sale cortado con puntos suspensivos, que se ve peor
   que no ponerlo.

**Arreglo (ya en la plantilla):** `nowrap` en el enlace y en la lista, y el
lema oculto en el armazón `topbar` (se lee entero en la portada, que es su
sitio). En `sidebar` hay una columna para él y se conserva.

**Lo que NO hay que hacer:** acortar las etiquetas del menú. Dicen qué hay en
cada sección, y en un sitio institucional el visitante no tiene que adivinar.
Tampoco subir `--ancho-max`: cambiarías el ancho de lectura de todo el sitio
para arreglar la barra.

---

## 21. El breakpoint del armazón vive en dos archivos

**Síntoma:** hay una franja de anchos en la que el cajón del menú se queda
abierto con los estilos de escritorio ya aplicados, y el menú aparece a medio
camino.

**Causa:** el ancho está en `styles/responsive.css` (`@media`) **y** en
`components/shell.js` (`matchMedia`, que cierra el cajón al volver a
escritorio). Se cambió uno y no el otro.

**Arreglo:** cambiar siempre los dos. Están comentados el uno al otro. Y el
criterio para moverlo: con **seis o más secciones de etiqueta larga**, entre
992 y 1200px los enlaces caben pero quedan sin aire, así que conviene subirlo
a 1199.98 / 1200. Con cuatro o cinco secciones cortas, 991.98 va bien.

---

## 22. El `:hover` se queda pegado en el teléfono

**Síntoma:** en el celular se toca una tarjeta, se vuelve atrás, y la tarjeta
sigue levantada y con el borde encendido. O un enlace del pie se queda del
color de hover para siempre.

**Causa:** en una pantalla táctil no existe «pasar por encima». El navegador
aplica el `:hover` al tocar y lo **deja aplicado** hasta que se toca otra cosa.
Un `:hover` escrito sin condición se ejecuta también ahí.

**Arreglo:** todos los `:hover` dentro de `@media (hover: hover)`. Lo que
responde al dedo es `:active`, y ese va **fuera** del bloque — es lo único que
acusa el toque en un teléfono, así que quitarlo deja la interfaz muerta.

Relacionado: si se quita el resaltado gris del navegador
(`-webkit-tap-highlight-color: transparent`) sin poner un `:active` propio, el
resultado es peor que antes: se toca y no pasa absolutamente nada hasta que la
página reacciona.

---

## 23. Safari de iOS hace zoom al tocar un campo del formulario

**Síntoma:** en un iPhone, al tocar el campo «nombre» la pantalla hace zoom
sola, el formulario queda a medio encuadre y el zoom no se deshace al salir del
campo. El visitante escribe su correo mirando media pantalla.

**Causa:** Safari de iOS hace zoom automáticamente sobre cualquier campo con
letra de menos de 16px. En escritorio no pasa nada de esto, así que se publica
sin verlo.

**Arreglo:** los campos suben a 16px en `@media (pointer: coarse)`
(`responsive.css`). No se arregla con `maximum-scale=1` en el viewport: eso
además impide al usuario hacer zoom a mano, que es un problema de
accesibilidad de verdad.

---

## 24. Zonas pulsables medidas con `max-width`

**Síntoma:** en el celular se falla al pulsar los enlaces del pie o los botones
de filtro. En una tableta de 1024px, igual.

**Causa:** dos errores juntos. El primero, que un enlace de texto mide lo que
mide su línea —unos 20px de alto—, y el dedo tapa el objetivo justo antes de
tocarlo. El segundo, medir esto por ancho de pantalla: quien falla es el dedo,
no la pantalla. Una tableta ancha tiene dedos y una ventana estrecha en un
portátil tiene ratón.

**Arreglo:** bloque `@media (pointer: coarse)` con `--toque-min` (44px), que es
el mínimo de las guías de Apple y de Google. A los enlaces de una lista se les
da alto propio (`display: inline-flex; min-height`) en vez de separarlos más,
que solo estiraría el pie.

---

## 25. El escalonado que se cobra después

**Síntoma:** las tarjetas entran escalonadas y muy bien, pero a partir de ese
momento la última tarjeta de la fila tarda medio segundo en reaccionar al
puntero. Y el culpable no está en el CSS de la tarjeta.

**Causa:** el escalonado se hace poniendo `transition-delay` en línea desde el
JS. Ese retardo es **del elemento**, no de la animación de entrada: se queda
puesto para siempre y se aplica a todas las transiciones siguientes, incluido
el levantarse al pasar el puntero.

**Arreglo:** borrar el retardo cuando termina la entrada. `reveal.js` escucha
`transitionend` una vez y limpia `style.transitionDelay`.

---

## 26. Animar algo que no sea `transform` u `opacity`

**Síntoma:** una animación que en el portátil del que la escribió va fina y en
un teléfono de gama media va a tirones.

**Causa:** `transform` y `opacity` las resuelve el compositor, sin tocar la
maqueta. Cualquier otra cosa —`width`, `height`, `top`, `margin`— obliga al
navegador a recalcular posiciones y repintar en cada fotograma.

**Arreglo:** buscarle la vuelta con `transform`. El subrayado del enlace activo
crece con `scaleX(0 → 1)` y no con `width`; la barra del enlace de la columna,
con `scaleY`. Excepción documentada: la rejilla del hero anima
`background-position`, porque con `transform` se movería también su máscara y
se vería entrar el borde del recuadro — y es un patrón que se repite, así que
el bucle es invisible.

---

## 27. Un recurso de un CDN sin `integrity`

**Síntoma:** ninguno. El sitio carga perfectamente durante años.

**Causa:** un `<script src="https://…">` o un `<link rel="stylesheet">` sin
`integrity` le pide al navegador que ejecute **lo que sea** que devuelva ese
CDN, hoy y dentro de tres años. Si la cuenta del CDN se compromete, o alguien
se hace con el dominio caducado de una librería pequeña, tu sitio sirve su
código con tu nombre encima. Es el ataque de cadena de suministro clásico.

**Arreglo:** `integrity` + `crossorigin="anonymous"` en todo lo externo. Si el
archivo no coincide con el hash, el navegador lo descarta en vez de
ejecutarlo. `npm run check` (punto 14) falla si falta.

```bash
curl -s "<url>" | openssl dgst -sha384 -binary | openssl base64 -A
```

Solo se exime lo que sirve contenido **variable** y por tanto no tiene hash
fijo: `fonts.googleapis.com` (devuelve un CSS distinto según el navegador) y
los *kits* de Font Awesome (un loader generado por cuenta).

---

## 28. Un dominio que falta en la Content-Security-Policy

**Síntoma:** un widget de terceros —el selector de idioma, un mapa, un vídeo
incrustado— sale vacío o no sale. Nada más. Ningún error visible, ninguna
alerta, el resto de la página perfecta.

**Causa:** la CSP del `index.html` restringe de qué dominios puede venir cada
tipo de recurso. Un dominio que no está declarado se bloquea **en silencio**:
la única señal es una línea en la consola del navegador.

Y casi nunca es un solo dominio. El traductor de Google, por ejemplo, carga
desde `translate.google.com` **y** pide la lista de idiomas a
`translate-pa.googleapis.com`, que es otro host y no lo cubre ningún comodín
de los otros. Eso se descubrió abriendo la página con el navegador, no
leyendo la documentación del servicio.

**Arreglo:** cada vez que añadas un servicio externo, `npm run preview`, abre
la consola y mira si hay bloqueos **antes** de desplegar. La consola limpia es
parte de la verificación, igual que el código HTTP.

Y dos avisos sobre la CSP en `<meta>`: `frame-ancestors` y `X-Frame-Options`
se **ignoran** ahí (solo valen como cabecera HTTP, que GitHub Pages no deja
poner), y `style-src` necesita `'unsafe-inline'` mientras los componentes
escriban `style="--i:3"`.

---

## 29. Usar en el CSS un peso de letra que no se ha cargado

**Síntoma:** los títulos y los botones se ven **sucios**: el trazo, engordado y
un poco deforme, con los contornos emborronados. Se percibe como «plantilla
barata» sin que se sepa señalar qué falla.

**Causa:** la URL de Google Fonts pide, pongamos, `wght@400;700`, pero el CSS
usa `font-weight: 600` en la navegación y `800` en los títulos. El navegador
**no falla ni avisa**: fabrica el peso que falta engordando artificialmente el
trazo del 400 — la «falsa negrita» (*faux bold*). Es de las cosas que más
delatan un sitio y de las que menos se miran.

**Arreglo:** que la lista de pesos de la URL sea exactamente la que usa el
CSS. La plantilla pide `400;500;600;700;800`. Si añades un peso al CSS,
añádelo a la URL. Para comprobarlo en el navegador ya publicado:

```js
[...new Set([...document.querySelectorAll('h1,h2,h3,a,button')]
  .map(e => getComputedStyle(e).fontWeight))].sort()
```

---

## 30. Texto blanco encima del degradado de marca

**Síntoma:** un botón principal que en el mitad izquierda se lee perfecto y en
la derecha cuesta. Nadie lo reporta: se lee «lo justo».

**Causa:** el degradado de marca va del primario al **acento**, y el acento de
una paleta suele ser un color claro y saturado. Blanco sobre un cyan tipo
`#22d3ee` da **1,81:1** de contraste, cuando el mínimo exigible es 4,5:1. El
extremo azul sí cumple, y eso es justo lo que despista al revisarlo de un
vistazo.

**Arreglo:** dos tokens distintos, que es lo que hace `tokens.css`.
`--degradado` es decorativo (reglas, separadores, barras: **sin texto
encima**) y `--degradado-solido` —derivado con `color-mix`, así que se adapta
al cambiar de paleta— es el único que puede llevar texto. **Si pones texto
sobre `--degradado`, lo has roto.**

---

## Comandos útiles

**Pasar imágenes a WebP** (ImageMagick 7, no siempre en el PATH):

```bash
IM="C:/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick.exe"
"$IM" original.png -resize 1600x -quality 82 assets/img/imagen.webp
```

Anchos que van bien: 1600px para una foto ancha, 800px para media columna,
200px para un avatar, 400px para el `og:image` (mínimo 1200×630 si quieres que
se vea grande al compartir).

**Comprobar qué se publicó de verdad:**

```bash
URL="https://usuario.github.io/repo/"
curl -s -o /dev/null -w "%{http_code}\n" "$URL"
curl -s "$URL" | grep -c "{{"      # 0 = sin marcadores olvidados
```
