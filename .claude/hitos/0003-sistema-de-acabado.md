# 0003 — Sistema de acabado: escala tipográfica, movimiento y un verificador que los defiende

- **Fecha:** 2026-08-24
- **Estado:** completado
- **Commits:** pendiente de commit — los cambios están en el árbol de trabajo,
  sin commitear ni empujar a `origin` (`seiler18/WebMaker`).
- **Origen:** una petición del usuario para incorporar al taller siete
  encargos del tipo «actúa como especialista de élite y haz un sitio
  ultrapremium» (jerarquía visual, sistema tipográfico, interacción,
  animaciones de revelado, perfeccionamiento de detalle y calidad móvil).

## Contexto

El encargo original venía escrito como siete prompts de rol: *«actúa como
especialista en sitios ultrapremium de calidad equivalente a $45.000, que cada
píxel demuestre un trabajo excepcional»*. Como instrucción no se puede
ejecutar, no se puede comprobar y no se puede discutir: un modelo al que se le
pide eso responde subiendo el volumen —más degradados, más sombras, más
animación— y el resultado se parece **más** a una plantilla de mercado, no
menos.

Lo que sí se puede ejecutar son las propiedades observables que hay debajo. Al
traducirlas, quedó claro que la plantilla ya cumplía la mitad sin nombrarlas, y
que la otra mitad tenía agujeros concretos:

- **veintidós tamaños de letra** distintos repartidos por cuatro archivos, con
  parejas separadas por medio píxel (0.94 y 0.95rem) que no comunican nada;
- **siete duraciones** de transición escritas a mano (0.2, 0.25, 0.28, 0.6…),
  así que fichas vecinas respondían a velocidades distintas;
- **`data-anim-espera` existía y no lo usaba nadie**: las seis tarjetas de una
  rejilla aparecían exactamente a la vez, y la portada no tenía animación
  ninguna;
- **todos los `:hover` sin condición**, que en pantalla táctil se quedan
  pegados hasta el toque siguiente;
- **campos de formulario a 15px**, que hacen que Safari de iOS haga zoom solo
  al enfocarlos;
- **zonas pulsables de 20-34px** en el pie, las redes y el cierre del modal.

Los tres últimos solo se ven en un teléfono de verdad. Desde el escritorio en
el que se hizo, el sitio parecía correcto.

Y una deuda declarada: el hito
[0002](0002-correcciones-del-primer-sitio-de-cliente.md) terminaba proponiendo
«un verificador de estilo (por ejemplo, un grep de literales de color en
`npm run check`)» como idea para un hito futuro. Es este.

## Qué se hizo

### Plantilla — `src/styles/tokens.css`

Dos bloques nuevos, con su razonamiento dentro:

- **Escala tipográfica de diez pasos**, cada uno con **un papel**:
  `--txt-barra`, `--txt-micro`, `--txt-menudo`, `--txt-ui`, `--txt-cuerpo`,
  `--txt-guia`, `--txt-t3`, y tres fluidos con `clamp` (`--txt-t2`,
  `--txt-t1`, `--txt-cifra`). Apretada abajo (papeles de interfaz) y abierta
  arriba (jerarquía de lectura). Con ella: cuatro interlineados
  (`--interlinea-*`, que bajan al subir el tamaño), tres espaciados entre
  letras (`--tracking-*`, negativo en lo grande y positivo en mayúsculas), tres
  medidas de línea en `ch` (`--medida-titular/guia/cuerpo`) y tres tamaños de
  icono, aparte de la escala de texto.
- **Movimiento**: tres duraciones (`--rapido` 120ms, `--medio` 240ms,
  `--lento` 420ms), tres curvas, el paso de escalonado (`--escalonado` 70ms),
  los desplazamientos de respuesta (`--levanta`, `--levanta-ficha`, `--hunde`)
  y los cuatro ciclos del fondo animado —que ahora hacen visible la regla 11
  del proyecto: entre 15 y 22s—.

Más dos tokens de color derivados que faltaban y estaban escritos a mano:
`--velo-modal` y `--texto-marca`.

### Plantilla — los cuatro CSS

Migrados **enteros** a los tokens: ningún color, tamaño de letra, duración ni
curva literal fuera de `tokens.css`. Y con ello:

- Todos los `:hover` dentro de `@media (hover: hover)`, con `:active` **fuera**
  para lo que responde al dedo, `touch-action: manipulation` en los botones y
  `-webkit-tap-highlight-color: transparent` acompañado siempre de su `:active`
  propio.
- Bloque nuevo `@media (pointer: coarse)`: 44px (`--toque-min`) en todo lo
  pulsable y 16px en los campos del formulario. Va por tipo de puntero y no por
  ancho, porque quien falla es el dedo, no la pantalla.
- `env(safe-area-inset-*)` en la barra inferior de móvil y en los rellenos
  laterales, con `viewport-fit=cover` en el `<meta viewport>` que es lo que lo
  activa.
- Bloque nuevo para **teléfono en horizontal** (`max-height: 520px`), donde una
  portada de 78vh se convertía en una pantalla de aire.
- `text-wrap: balance` en los títulos y `pretty` en los párrafos.
- Medidas de línea en `ch` donde había píxeles (bajada del hero, subtítulo de
  sección), prosa a 18px y título de tarjeta a 18px sobre texto de 15px — antes
  eran 1.08 y 0.94rem, que se ven iguales.

### Plantilla — `src/lib/reveal.js`

- **Escalonado automático**: `data-anim-secuencia` en un contenedor y sus hijos
  entran uno detrás de otro. El retardo se calcula por la posición del hijo, así
  que añadir una tarjeta no obliga a renumerar nada.
- **Techo de 6 pasos / 420ms**: sin él, la duodécima tarjeta entra 770ms después
  de la primera y lo que se percibe ya no es ritmo, es lentitud.
- **Cuatro variantes** (`subir`, `aparecer`, `escala`, `lateral`).
- **El retardo se borra al terminar la entrada.** Es el defecto que tenía la
  idea original: `transition-delay` es del elemento, no de la animación, así que
  una tarjeta que entra con 420ms de retardo se quedaba con esos 420ms para
  siempre — y su hover empezaba medio segundo tarde, con la causa en otro
  archivo. → trampa 25.
- La portada estrena secuencia de entrada: antetítulo → nombre → lema → bajada
  → botones → cifras.

### Plantilla — `scripts/check-integrity.js`

Cinco comprobaciones nuevas (van de la 8 a la 12): colores literales, tamaños
de letra literales, duraciones y curvas literales, imágenes sin `alt` y
variantes de `data-anim` que no existen. Ignora comentarios y el bloque de
`prefers-reduced-motion` —ahí los literales son obligatorios— **borrando en
blanco**, sin recortar, para que el número de línea que informa sea el del
archivo real.

### Taller

- `referencia/acabado.md` (nuevo): el estándar completo en siete ejes, con la
  tabla de «lo que el visitante siente / lo que en realidad está pasando» y una
  lista explícita de **lo que NO es acabado premium** (preloader, scroll
  secuestrado, cursor personalizado, animarlo todo, tres tipografías…). Es la
  parte que evita que «hazlo premium» se convierta en subir el volumen.
- `skills/pulir-acabado/SKILL.md` (nuevo): el paso ⑤ del recorrido. Seis ejes en
  orden y el **guion de revisión**: catorce preguntas numeradas, siete de ellas
  para el teléfono.
- `plantilla/dot-claude/skills/revisar-acabado/SKILL.md` (nuevo): la misma
  pasada, autocontenida, para el proyecto hijo.
- Trampas 22 a 26; reglas 14, 15 y 16 del proyecto; y actualizados
  `CLAUDE.md`, `README.md`, `arquitectura.md`, `levantar-sitio`,
  `definir-identidad`, `construir-secciones`, `agregar-seccion`,
  `PROYECTO-CLAUDE.md` y `_MARCADORES.md`.

## Decisiones y alternativas descartadas

- **Traducir los prompts a reglas, no incorporarlos como prompts.** Un
  `skills/` con «actúa como especialista de élite» habría producido un sitio
  distinto en cada ejecución. Lo que se repite es el sistema de tokens; lo que
  no se puede repetir no sirve para un taller.
- **No se añadió una escala de espaciado.** Es el candidato obvio para el
  siguiente paso, pero migrar los cincuenta rellenos de la plantilla no se
  puede verificar sin ver el resultado, y una escala aplicada a medias produce
  exactamente la incoherencia que quiere evitar. Queda como pendiente.
- **El escalonado se calcula en JS y no con `nth-child` en CSS.** Con CSS haría
  falta una regla por posición y un tope escrito a mano en cada rejilla.
- **44px por `pointer: coarse` y no por `max-width`.** Una tableta de 1024px
  tiene dedos; una ventana estrecha en un portátil, ratón.
- **Los tamaños de icono no entran en la escala de texto.** Mezclarlos obliga a
  elegir entre «el icono se ve bien» y «el texto se lee bien» cada vez que se
  ajusta uno de los dos.
- **Las comprobaciones 8-10 son errores, no avisos.** Un aviso en un verificador
  que pasa todos los días se convierte en parte del paisaje. Estas tres reglas
  ya se rompieron una vez estando escritas.

## Verificado

Sobre una materialización de prueba de la plantilla (marcadores rellenados, en
carpeta temporal):

- `npm run check` en verde.
- `npm install` limpio y `npm run build` correcto (25 módulos, 30.2 KB de CSS y
  20.6 KB de JS).
- **Pruebas negativas** de las cinco comprobaciones nuevas: se inyectó un color
  literal, un `font-size` literal, un `0.3s`, un `cubic-bezier()` a mano, una
  imagen sin `alt` y un `data-anim="fade"`; las seis se detectaron y el
  verificador salió con código 1.

## Pendiente

- **Nada de esto está verificado visualmente.** Sigue sin haber navegador
  automatizado. En concreto, lo que solo se puede confirmar en un teléfono
  real: la franja del gesto en un iPhone sin botón, el zoom de Safari al
  enfocar un campo, y si el escalonado de 70ms se siente o se sufre. El guion
  de preguntas de `pulir-acabado` existe justamente para pedirlo en el próximo
  sitio.
- **Escala de espaciado**, por lo dicho arriba.
- La portada ahora entra con opacidad 0 y aparece por JS: es correcto y tiene
  respaldo si el JS falla, pero **retrasa el LCP** unos 400ms. Con el primer
  sitio real habrá que mirar si compensa, o si el título debe entrar sin
  retardo.
- Sigue vivo lo del hito 0002: `actions/checkout@v4` y `setup-node@v4` en el
  workflow, con aviso de deprecación.
