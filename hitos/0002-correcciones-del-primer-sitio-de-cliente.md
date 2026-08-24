# 0002 — Correcciones que trajo el primer sitio de cliente

- **Fecha:** 2026-08-23
- **Estado:** completado
- **Commits:** pendiente de commit — los cambios están en el árbol de trabajo,
  sin commitear ni empujar a `origin` (`seiler18/WebMaker`).
- **Origen:** CEDER SpA (`../CEDER_SPA/`), hitos
  [0002](../../CEDER_SPA/.claude/hitos/0002-ajustes-visuales-y-alcance-nacional.md)
  y [0003](../../CEDER_SPA/.claude/hitos/0003-fondo-vivo-y-publicacion.md) de
  ese proyecto.

## Contexto

CEDER SpA fue el primer sitio construido con la plantilla para un cliente real
—el Curriculo del que salió WebMaker era otra cosa: una sola persona, cinco
secciones cortas, sin revisión de terceros—. Llegó a producción en un día, pero
las **dos revisiones visuales del cliente sacaron seis defectos**, y ninguno lo
detectaba `npm run check`.

Eso es el dato importante de este hito: el verificador cubre lo estructural
(rutas, ids, marcadores, `base`) y no cubre nada de lo que un cliente mira en
los dos primeros segundos. Cuatro de los seis defectos eran de la plantilla y
se los habría comido igual el siguiente proyecto.

## Qué se hizo

### Plantilla — `plantilla/src/styles/tokens.css`

Bloque nuevo de **tokens derivados con `color-mix()`**, que se recalculan solos
al cambiar de paleta: `--primario-tenue`, `--primario-tenue-fuerte`,
`--superficie-viva`, `--barra-fondo`, `--barra-fondo-opaca`, `--velo`,
`--superficie-velada`, `--brillo-movil`, `--brillo-movil-acento`,
`--brillo-movil-frio`.

Y se sustituyeron los **siete literales** que había en `components.css`,
`layout.css` y `responsive.css` por esos tokens.

### Plantilla — fondo vivo

- `base.css`: los halos pasan de `background-image` del `body` a
  **`body::before` animado** con `transform`, con un tercer halo abajo.
- `components.css`: las luces del hero, a `.hero-fondo::before` animado; la
  rejilla, animada con `background-position`; y **máscara de desvanecido en
  `.hero-fondo`** para matar el canto recto del borde inferior del hero.

### Plantilla — legibilidad y armazón

- Contorno `drop-shadow` en `.hero-titulo` y `.section-title`; el degradado del
  título de portada arranca en blanco.
- `.nav-link` con `white-space: nowrap`, tamaños más ajustados, y el **lema de
  la marca oculto en el armazón `topbar`**.
- Comentarios cruzados entre el `@media` de `responsive.css` y el `matchMedia`
  de `shell.js`, con el criterio de cuándo subir el corte a 1200px.
- **Hover común** de `.tarjeta` y `.destacado` en una sola regla, con
  `:focus-within`.

### Documentación

- `referencia/trampas.md`: seis trampas nuevas (16 a 21).
- `referencia/paletas.md`: nota de que los derivados no se copian, y la
  advertencia de Papel Claro reescrita — mencionaba código que ya no existe y
  se le añadieron los dos casos nuevos.
- `CLAUDE.md`: regla 5 ampliada y reglas 11, 12 y 13 nuevas.
- `skills/definir-identidad`: qué no tocar al cambiar de paleta.
- `skills/levantar-sitio`: sección **«Lo que el cliente comenta en la primera
  revisión»** y tres filas nuevas en la tabla de síntomas.

## Decisiones y alternativas descartadas

- **`color-mix()` en vez de escribir los siete tokens en cada paleta.** La
  alternativa era añadirlos a los siete bloques de `paletas.md`: cero riesgo de
  compatibilidad, pero 49 líneas nuevas que hay que mantener a mano y que
  alguien copiará mal. Derivarlos deja `paletas.md` **exactamente como estaba**
  y hace imposible el error original. `color-mix` es Baseline desde 2023.
  Comprobado además que el minificador de Vite 8 (lightningcss) **no lo
  destruye**: los diez derivados salen intactos al CSS compilado.
- **Se descartó dejar un respaldo literal antes de cada `color-mix`** para
  navegadores antiguos: el respaldo tendría que ser un color concreto, o sea el
  azul de la paleta de fábrica, que es justo el problema que se estaba
  arreglando.
- **El breakpoint del armazón se queda en 991.98px.** Subirlo a 1200 fue lo
  correcto *para CEDER*, que tiene seis secciones de etiqueta larga, pero
  imponérselo a un sitio de cuatro secciones cortas le quitaría el menú de
  escritorio sin motivo. Lo que se sube a la plantilla es el **criterio**, no
  el número: está en el comentario de `responsive.css`.
- **El lema se oculta solo en `topbar`.** En `sidebar` hay una columna entera
  para él, así que no molesta. Regla acotada con
  `body[data-armazon="topbar"]`, verificada en el CSS compilado de las dos
  variantes.
- **Los brillos intensos son tokens aparte, no se subió `--brillo`.** Ese token
  alimenta bordes, sombras de tarjeta y brillos de icono, donde tiene que
  seguir siendo discreto.
- **La máscara del hero desvanece a `transparent`, no a `var(--bg)`.** El fondo
  de la página no es `--bg` puro: lleva los halos de `body::before` encima, así
  que un degradado hacia `--bg` dejaría una banda oscura visible justo donde se
  quería quitar una línea.
- **No se tocó el proyecto CEDER para alinearlo con `color-mix`.** Sus tokens
  están escritos con valores explícitos y ya están publicados y funcionando;
  los nombres son los mismos, así que las skills de la plantilla siguen
  valiendo allí. Cambiarlo solo por coherencia obligaría a republicar sin
  ganancia visible.

## Consecuencias

- **Cambiar de paleta vuelve a ser editar un bloque**, que era la promesa de la
  regla 5 y no se cumplía.
- **La plantilla ya no entrega un fondo estático.** Un sitio nuevo nace con los
  halos, las luces y la rejilla en movimiento. Si un cliente no lo quiere, se
  quitan las tres `animation` — pero el punto de partida es el que se demostró
  que el cliente pide.
- **Papel Claro es ahora más caro de lo que decía la referencia.** Antes se
  contaba media hora; con las luces animadas y los contornos oscuros son cuatro
  ajustes y una hora. Está dicho en `paletas.md` y en la skill, para no
  prometer plazos falsos.
- **La revisión visual tiene por fin una lista concreta.** Estaba dicho que la
  hace el usuario, pero no qué mirar; ahora `levantar-sitio` lleva las seis
  cosas que el primer cliente comentó.

## Pendiente

- **Verificación visual de la plantilla:** se comprobó que
  `npm run check` y `npm run build` pasan materializándola en una carpeta
  temporal (con las dos variantes de armazón, `topbar` y `sidebar`) y que los
  `color-mix` sobreviven al minificador. **Cómo se ve** solo se sabrá con el
  próximo sitio real, o mirando CEDER, que lleva los mismos cambios.
- El workflow de la plantilla usa `actions/checkout@v4` y
  `actions/setup-node@v4`, que apuntan a Node 20 y ya salen con aviso de
  deprecación en los runners. Toca subir a `@v5` — no rompe nada todavía, así
  que no se metió en esta tanda para no mezclar temas.
- Sigue sin resolverse lo de siempre: aquí no hay navegador automatizado, así
  que las trampas 16 a 21 se han documentado pero **nada impide volver a
  cometerlas**. Un verificador de estilo (por ejemplo, un grep de literales de
  color en `npm run check`) las cazaría; queda como idea para un hito futuro.
