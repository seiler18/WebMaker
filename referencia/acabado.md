# Acabado

Qué separa un sitio que *funciona* de uno que **parece caro**, en reglas que se
pueden aplicar y —casi todas— comprobar.

## Por qué este archivo existe

Circulan encargos del tipo «hazlo con la calidad de un estudio de élite, que
cada píxel demuestre un trabajo excepcional». Como instrucción no sirve: no se
puede ejecutar, no se puede comprobar y no se puede discutir. Un modelo al que
se le pide eso responde subiendo el volumen —más degradados, más sombras, más
animación— y el resultado se parece más a una plantilla de mercado que a un
sitio caro.

Lo que sí se puede ejecutar son las **propiedades observables** que hacen que
un sitio se lea como caro. Son pocas y bastante aburridas:

| Lo que el visitante siente | Lo que en realidad está pasando |
|---|---|
| «Se entiende de un vistazo» | Hay tres niveles tipográficos y no siete |
| «Está cuidado» | Los mismos papeles usan las mismas medidas en todo el sitio |
| «Responde bien» | Todo acusa recibo en menos de 150 ms, también al dedo |
| «Tiene ritmo» | El contenido entra escalonado, no todo de golpe |
| «Es cómodo» | Las líneas miden 50-70 caracteres y lo pulsable mide 44 px |
| «Está terminado» | No hay ningún elemento que se comporte distinto a su gemelo |

Ninguna de las seis cuesta dinero. Todas cuestan **decidir una vez y no
volver a decidir**, que es exactamente lo que hace la plantilla con sus tokens.

Y una advertencia que vale por todo lo demás: **el acabado es lo último**. Un
sitio con el contenido equivocado y las animaciones perfectas está mal hecho;
un sitio con el contenido correcto y sin animación ninguna está incompleto,
pero sirve. Este archivo se aplica cuando las secciones ya dicen lo que tienen
que decir.

---

## 1 · Jerarquía visual

**El objetivo:** que la mirada recorra la página en el orden en que quieres que
la lea, sin que el visitante note que lo estás guiando.

Lo que dirige la mirada, por orden de fuerza: **tamaño** > **contraste** >
**posición** > **color** > **peso**. El color es el cuarto, muy por detrás de
los dos primeros — por eso un sitio no se arregla cambiando de paleta.

Reglas:

- **Una idea principal por sección.** Si una sección tiene dos cosas que quiere
  que hagas, no tiene ninguna. Se parte en dos secciones.
- **Un solo botón principal por pantalla.** La plantilla lo aplica en el hero:
  el primero de `hero.acciones` sale `primario` y el resto `fantasma`. Dos
  botones primarios juntos es la forma más rápida de que no se pulse ninguno.
- **Tres niveles en la cabecera de sección, y bien separados:** antetítulo
  (13 px, mayúsculas, acento) → título (30-44 px) → bajada (18 px, tenue). Si
  los tres se parecen, el visitante los lee los tres y se cansa antes de llegar
  al contenido.
- **Lo importante, arriba y a la izquierda** en escritorio; **arriba** en
  móvil, donde no hay izquierda que valga.
- **El aire es jerarquía.** Lo que va junto se pega y lo que no, se separa. Un
  título a la misma distancia de su párrafo que del bloque siguiente no
  pertenece a nada.

Dónde vive en la plantilla: `.section-head` (layout.css) y el orden del
`site-map.js`.

---

## 2 · Sistema tipográfico

**El objetivo:** que el texto sea el elemento de diseño, y no algo que se
coloca encima del diseño.

Las decisiones están tomadas en `tokens.css`, y este es el razonamiento:

- **Diez tamaños para todo el sitio**, cada uno con un papel (`--txt-micro`,
  `--txt-menudo`, `--txt-ui`, `--txt-cuerpo`, `--txt-guia`, `--txt-t3`,
  `--txt-t2`, `--txt-t1`, `--txt-cifra`, `--txt-barra`). La versión anterior de
  esta misma plantilla tenía veintidós. Un sitio con veintidós tamaños no se ve
  «variado»: se ve hecho a ojo, porque hay parejas que se diferencian en medio
  píxel y no comunican nada.
- **Se elige por papel, no por tamaño.** «Esto es una etiqueta» → `--txt-micro`.
  «Esto es para leer» → `--txt-guia`. Si ningún papel encaja, casi siempre el
  problema es el diseño y no la escala.
- **Escala apretada abajo, abierta arriba.** Los pasos pequeños son interfaz y
  deben diferenciarse poco; los grandes son lectura y deben diferenciarse
  mucho. Una escala geométrica pura (todo ×1.25) deja la interfaz gritando.
- **Los tres grandes son fluidos** (`clamp`), así que crecen con la ventana en
  vez de saltar en un breakpoint.
- **El interlineado baja cuando el tamaño sube**: 1.06 en un titular, 1.65 en
  prosa. Un titular con interlineado de párrafo se lee como dos frases sueltas.
- **El espaciado entre letras es negativo en lo grande y positivo en las
  mayúsculas.** En el texto corrido no se toca.
- **La medida va en `ch`, no en px**: `--medida-cuerpo` 68ch, `--medida-guia`
  52ch, `--medida-titular` 24ch. Un ancho en píxeles deja de ser correcto en
  cuanto cambia el tamaño de letra.
- **`text-wrap: balance` en los títulos** (base.css): reparte las palabras
  entre las líneas en vez de dejar la última sola. Es lo primero que delata un
  título sin cuidar y no hay forma de arreglarlo a mano, porque depende del
  ancho de cada pantalla.
- **Dos familias como máximo.** Tres se leen como un collage.

Al cambiar de tipografía hay que mirar `--tracking-display`: una fuente
condensada necesita menos negativo que una ancha. Es un ajuste de un número.

Lo comprueba `npm run check` (punto 9): no hay ningún `font-size` literal fuera
de `tokens.css`.

---

## 3 · Interacción

**El objetivo:** que pulsar algo se sienta como pulsar algo.

- **Todo lo pulsable acusa recibo en menos de 150 ms** (`--rapido`). Por encima
  de eso, el botón se hunde después de que el dedo ya se ha levantado, y lo que
  se percibe es retraso, no suavidad.
- **Tres duraciones para todo el sitio:** `--rapido` (respuesta), `--medio`
  (cambio de estado), `--lento` (entrada o apertura). Dos elementos vecinos que
  responden a velocidades distintas no se leen como «uno es más rápido», se
  leen como una página sin terminar.
- **La curva importa tanto como la duración.** `ease` arranca despacio, y en una
  respuesta al puntero eso se siente como lag. `--curva-salida` arranca rápido
  y aterriza suave.
- **Se anima `transform` y `opacity`, y nada más.** Son las dos propiedades que
  resuelve el compositor. Animar `width`, `height`, `top` o `background-position`
  obliga al navegador a recalcular la maqueta en cada fotograma — el subrayado
  del menú activo se anima con `scaleX` justo por eso.
- **El hover NO es la interacción principal.** En un teléfono no existe. Lo que
  existe es `:active`, y va fuera del `@media (hover: hover)`.
- **El movimiento apunta a algo.** La flecha de un enlace se adelanta 3 px
  porque dice hacia dónde lleva. Un elemento que se mueve sin significar nada
  es ruido.
- **Nada se mueve más de lo que hace falta.** `--levanta` son 2 px y
  `--levanta-ficha`, 6. Un botón que sube 8 px al pasar por encima parece que
  se despega de la página.

Lo comprueba `npm run check` (punto 10): no hay duraciones ni curvas literales.

---

## 4 · Revelado del contenido

**El objetivo:** un ritmo que se sienta sin que se piense en él.

- **Escalonado, no simultáneo.** Seis tarjetas que aparecen a la vez son un
  salto de la página; escalonadas 70 ms se leen como una fila que se va
  poniendo. Se activa con `data-anim-secuencia` en el contenedor y lo calcula
  `reveal.js` con la posición del hijo: añadir una tarjeta no obliga a
  renumerar nada.
- **El escalonado tiene techo** (6 pasos, 420 ms). Con doce tarjetas sin techo,
  la última entra 770 ms después de la primera y lo que se percibe ya no es
  ritmo, es lentitud.
- **Una variante por sección.** Hay cuatro (`subir`, `aparecer`, `escala`,
  `lateral`) y usarlas todas en la misma pantalla no da ritmo, da ruido.
- **La animación de entrada no se repite.** Al volver a subir, el contenido ya
  está ahí. `reveal.js` deja de observar en cuanto entra.
- **Nada aparece dos veces.** Si el elemento ya se ve al cargar la página —la
  portada— entra igualmente en secuencia, pero una sola vez.
- **Sin JS, todo se ve.** `reveal.js` marca todo visible si no hay
  `IntersectionObserver` o si el sistema pide menos movimiento. Un sitio cuyo
  contenido depende de que una animación se dispare es un sitio que a veces
  sale en blanco.

---

## 5 · Detalle

**El objetivo:** que alguien que sepa mirar no encuentre nada colocado a ojo.

- **Los gemelos se comportan igual.** Si `.tarjeta` y `.destacado` son los dos
  fichas, reaccionan igual — y por eso comparten una sola regla. La primera
  versión tenía dos, y medio sitio parecía interactivo y medio no. Lo notó el
  cliente.
- **Las medidas se repiten.** Los rellenos van en múltiplos de 0.25rem. Un
  0.42rem suelto no lo ve nadie de uno en uno; de cincuenta en cincuenta, sí.
- **Nada salta al pasar el puntero.** Un borde que engorda mueve la maqueta; se
  usa `box-shadow ... inset`, que no ocupa sitio.
- **Los estados existen todos:** normal, `:hover`, `:active`, `:focus-visible`
  y deshabilitado. El del teclado no es opcional: sin él, quien navega con
  tabulador no sabe dónde está.
- **Las alturas se igualan solas.** `margin-top: auto` empuja la acción de la
  tarjeta al fondo, así que todos los enlaces de una fila quedan a la misma
  altura aunque los textos ocupen una o tres líneas.
- **Cada imagen tiene `alt` con texto de verdad** — lo que se ve, para quien no
  puede verlo (`npm run check`, punto 11).
- **Los textos de una rejilla miden parecido.** Con uno de tres líneas y otro de
  diez, la rejilla se ve descuadrada. Eso se arregla escribiendo, no con CSS.

---

## 6 · Móvil

**El objetivo:** que la primera impresión —que para la mayoría ocurre en un
teléfono— sea la misma que en el monitor del que lo hizo.

- **Lo pulsable mide 44 px** en la dirección en la que el dedo falla
  (`--toque-min`). Un enlace de 20 px de alto en una lista se falla una de cada
  tres veces, y lo que el visitante concluye no es «he apuntado mal».
- **Se mide con `pointer: coarse`, no con `max-width`.** Quien falla es el
  dedo, no la pantalla: una tableta de 1024 px necesita zonas grandes y una
  ventana estrecha en un portátil con ratón, no.
- **Los campos del formulario van a 16 px como mínimo en táctil.** Por debajo,
  Safari de iOS hace zoom al enfocar y deja el formulario a medio encuadre, sin
  deshacerlo solo. Es el detalle que más se nota y el que nunca se ve desde un
  escritorio.
- **El hover se queda pegado en táctil.** Por eso todos los `:hover` de la
  plantilla viven dentro de `@media (hover: hover)`.
- **La franja del gesto existe.** En un iPhone sin botón, la barra inferior de
  navegación queda debajo de la raya si no se reserva
  `env(safe-area-inset-bottom)` — y eso necesita `viewport-fit=cover` en el
  `<meta viewport>`.
- **El texto no encoge en móvil.** Lo que se recorta es el aire, no la letra.
  La bajada del hero es la frase que explica el negocio y el teléfono es donde
  más gente la lee.
- **El teléfono también se gira.** En horizontal quedan unos 380 px de alto: una
  portada de 78vh se convierte en una pantalla de aire con un título en medio.

---

## 7 · El conjunto

Lo que no cabe en ninguna de las seis anteriores y decide igual:

- **Un sitio rápido se ve mejor que uno bonito.** Sin framework, sin librería de
  animación, sin carrusel: un sitio de cuatro secciones son ~20 KB de JS.
  Ninguna animación arregla una portada que tarda dos segundos en pintar.
- **El contenido manda sobre el efecto.** Tres párrafos densos en «Quiénes
  somos» no se leen por muy bien que entren en pantalla. Dos cortos, con los
  datos repartidos en destacados, sí.
- **La coherencia se nota más que la ambición.** Un sitio entero hecho con seis
  decisiones repetidas se ve más caro que uno con veinte ideas buenas sueltas.

---

## Lo que NO es acabado premium

Todo esto aparece cuando se pide «que se vea de élite», y todo esto resta:

| Idea | Qué pasa de verdad |
|---|---|
| Preloader con porcentaje | Se añade una espera a un sitio que cargaba antes. El único sitio que necesita preloader es el que va lento |
| Scroll secuestrado o parallax pesado | Rompe la rueda del ratón, el teclado y el móvil. Se percibe como que la página no obedece |
| Cursor personalizado | Quita al visitante la única referencia que tenía. En táctil, no existe |
| Animar todo lo que entra | Cuando todo se mueve, nada destaca; y bajar por la página se vuelve cansado |
| Texto sobre foto sin contraste | Se ve precioso en la maqueta y no se lee en un teléfono al sol |
| Tres tipografías y dos acentos | Es exactamente lo que hace un sitio barato: variedad en vez de decisión |
| Sombras y degradados en todo | Un degradado que aparece dos veces en la página es identidad; en cada caja, es ruido |
| Vídeo de fondo autoplay | Megabytes, batería y un texto que se lee según el fotograma |
| Micro-animaciones de 800 ms | La suavidad no está en la duración. Lo lento se siente lento |

Regla práctica: si un efecto no se puede explicar en una frase que empiece por
«sirve para que el visitante…», sobra.

---

## Qué se puede prometer

Aquí **no hay navegador automatizado**. De todo lo anterior, la máquina
comprueba:

- que no hay colores, tamaños ni duraciones literales fuera de `tokens.css`
  (`npm run check`, 8-10);
- que las imágenes tienen `alt` (11) y que las variantes de animación existen (12);
- que el sitio compila y que sirve con 200.

Lo que **solo se ve mirando**: si la jerarquía funciona, si el escalonado se
siente o se sufre, si el título parte bien en un móvil concreto, si la foto se
recorta donde importa. Eso lo revisa el usuario, y la lista de preguntas
concretas está en `.claude/skills/pulir-acabado/SKILL.md`.

Decir «quedó impecable» sin esa pasada es exactamente la trampa 15.
