# WebMaker — cómo se hacen los sitios web aquí

WebMaker no es un sitio web: es el **taller** donde se fabrican. Vive en
`OneDrive\Desarrollo\WebMaker\` y no se despliega en ninguna parte.

Su trabajo es convertir **documentación de un cliente o proyecto** en un
**sitio web publicado**, sin volver a decidir de cero la arquitectura, el
build, el deploy ni los mismos errores que ya se cometieron una vez.

Sale destilado del sitio de currículum de Jesús Seiler
(`Desarrollo\Curriculo\`), que tras catorce hitos de correcciones dejó claro
qué partes de esa arquitectura merecían repetirse y cuáles no. Las que no,
están explicadas en `referencia/trampas.md`.

## La regla que gobierna todo lo demás

**Primero el briefing, después el código.** No se escribe una línea de HTML
sin un `briefing.md` aprobado por el usuario. Un sitio construido a base de
suposiciones se rehace entero cuando aparece el primer dato real; uno
construido desde un briefing se ajusta.

Si el usuario dice «hazme la web de X» y no hay briefing, la respuesta no es
empezar a maquetar: es invocar `recopilar-briefing`.

## El recorrido

```
    documentos del cliente (PDF, Word, notas, un logo, una web vieja)
              │
              ▼
    ①  recopilar-briefing      ← el "preagente": lee lo que hay,
              │                   pregunta SOLO lo que falta
              ▼
        briefing.md  ← contrato. Todo lo de abajo lee de aquí.
              │
              ▼
    ②  definir-identidad       ← paleta, tipografía, armazón
              │
              ▼
    ③  generar-andamiaje       ← copia plantilla/, sustituye marcadores,
              │                   deja `npm run check` en verde
              ▼
    ④  construir-secciones     ← una sección por vez, desde el briefing
              │
              ▼
    ⑤  pulir-acabado           ← jerarquía, tipografía, interacción,
              │                   revelado, detalle y móvil. Y el guion
              │                   de preguntas para la revisión visual
              ▼
    ⑥  publicar-sitio          ← repo, GitHub Pages, verificación
              │
              ▼
    ⑦  registrar-hito          ← memoria, en el proyecto hijo
```

Los pasos ② a ⑦ se pueden repetir. El ① se hace una vez y se actualiza
cuando el cliente cambia de idea (y entonces se anota en su hito).

## Dónde está cada cosa

| Necesitas… | Ve a |
|---|---|
| Arrancar un sitio nuevo de principio a fin | `skills/levantar-sitio/SKILL.md` |
| Sacarle al usuario la información del sitio | `skills/recopilar-briefing/SKILL.md` |
| Elegir colores, tipografía y armazón | `skills/definir-identidad/SKILL.md` |
| Crear el proyecto y dejarlo compilando | `skills/generar-andamiaje/SKILL.md` |
| Escribir las secciones | `skills/construir-secciones/SKILL.md` |
| Dar la pasada de acabado antes de entregar | `skills/pulir-acabado/SKILL.md` |
| Publicar en GitHub Pages | `skills/publicar-sitio/SKILL.md` |
| Dejar memoria de lo hecho | `skills/registrar-hito/SKILL.md` |
| Entender **por qué** el sitio está hecho así | `referencia/arquitectura.md` |
| Qué hace que un sitio se lea como caro | `referencia/acabado.md` |
| Recetas de secciones que no vienen de fábrica | `referencia/catalogo-secciones.md` |
| Paletas listas para usar | `referencia/paletas.md` |
| Errores ya cometidos, para no repetirlos | `referencia/trampas.md` |
| Qué se hizo en WebMaker y por qué | `hitos/` (empieza por su `README.md`) |
| Los archivos que se copian a cada proyecto | `plantilla/` |

Las skills de aquí **no se autodescubren**: viven en `skills/`, no en
`.claude/skills/`. Se invocan leyendo su `SKILL.md` por ruta. Es a propósito —
son una biblioteca que se copia, no comandos de un proyecto.

## Qué produce WebMaker

Un proyecto hermano en `OneDrive\Desarrollo\<PROYECTO>\` que **se gobierna
solo**: lleva su propio `CLAUDE.md`, sus `.claude/hitos/` y sus
`.claude/skills/`. Después de publicarlo, WebMaker ya no hace falta para
mantenerlo: se trabaja dentro del proyecto, con sus propias skills.

WebMaker vuelve a entrar en juego solo para **el siguiente sitio**, o para
mejorar la plantilla cuando un proyecto enseña algo nuevo (y eso se registra
como hito de WebMaker, no del proyecto).

## Reglas de la plantilla

Estas no son preferencias, son las conclusiones de los catorce hitos del
Curriculo. Cambiarlas es posible, pero hay que saber qué se está pagando —
está explicado en `referencia/trampas.md`.

1. **Sin framework de UI, sin jQuery.** La plantilla es HTML/CSS/JS vanilla.
   El Curriculo arrastraba Bootstrap 4 + jQuery + Popper y buena parte de sus
   hitos son arreglos de eso: peleas de `z-index` entre modal y barra de
   navegación, altos de carrusel que saltaban, `.card-deck` descuadrado en
   móvil, viñetas de lista colándose en el menú.
2. **Un solo registro de secciones.** `src/site-map.js` es la fuente de
   verdad: de ahí salen el orden en el DOM, los enlaces del menú, el
   scroll-spy y el verificador. Añadir una sección es añadir una fila.
3. **Contenido en `src/data/`, presentación en `src/components/`.** Ningún
   texto del cliente dentro de un componente. Si un dato lo usan dos
   componentes, sube a `src/data/`.
4. **`responsive.css` se importa el último.** Sus overrides ganan por orden
   de cascada, sin un solo `!important`. Si lo mueves, empezarás a
   necesitarlos.
5. **Ningún color literal fuera de `src/styles/tokens.css`.** Cambiar la
   identidad del sitio debe ser editar un bloque, no buscar por todo el CSS.
   Los lavados y translúcidos (fondo del enlace activo, barra difuminada,
   ficha con el puntero encima) son **tokens derivados con `color-mix()`** de
   los colores base: cambian solos con la paleta. Si falta uno, se añade a ese
   bloque — no al componente. Excepciones: blancos y negros neutros
   (`rgba(0,0,0,…)` de una sombra) no pertenecen a ninguna paleta.
   **Lo comprueba `npm run check`** (punto 8): se rompió estando escrita, así
   que ahora falla el build.
   → Cómo se rompió esto la primera vez: `referencia/trampas.md`, trampa 16.
6. **Rejillas, no carruseles.** Una rejilla `auto-fill` enseña todo, se apila
   sola en móvil y no tiene alto que igualar ni flechas que tapen botones.
   Si no cabe, la respuesta es filtrar, no esconder.
7. **`npm run check` antes de cualquier push.** Va dentro de `npm run build`,
   así que un marcador sin rellenar, una imagen que no existe o un `base` mal
   puesto hacen fallar el deploy en vez de llegar a producción.
8. **Ninguna credencial en el proyecto.** GitHub Pages sirve todo en claro.
   El formulario de contacto usa FormSubmit precisamente porque no necesita
   clave. Si algo pide una, o va detrás de un backend propio o el sitio se
   queda sin esa función.
9. **Nombres de archivo exactos.** GitHub Pages distingue mayúsculas y
   Windows no: un nombre que funciona en local da 404 en producción. Copia el
   nombre con `ls`, nunca de memoria.
10. **La revisión visual la hace el usuario.** Aquí no hay navegador
    automatizado. Lo verificable es `npm run check`, `npm run build` y
    códigos HTTP sobre `npm run preview`. Si no comprobaste algo, dilo — no
    lo des por bueno.
11. **El fondo se mueve, y con tokens propios.** Los halos de página
    (`body::before`) y las luces de la portada (`.hero-fondo::before`) se
    animan con `transform`; la rejilla, con `background-position`. Tres reglas
    que ya costaron una revisión: la animación va **en el pseudo-elemento**
    (un `transform` en el `body` atrapa el modal), usa los `--brillo-movil*` y
    no los brillos tenues (si no, el movimiento no se percibe) y el ciclo va
    en 15-22s (más largo es lo mismo que estático).
12. **El fondo de la portada se desvanece por abajo.** La máscara de
    `.hero-fondo` no es decoración: sin ella el `overflow: hidden` del hero
    corta el fondo en una línea recta que parte la página en dos. Va en el
    contenedor, no en los pseudos, y desvanece a `transparent`, no a `--bg`.
13. **Un solo hover para todas las fichas.** `.tarjeta` y `.destacado`
    comparten una regla en `components.css`. Si se retoca una, se retocan las
    dos: tenerlas separadas es cómo se llega a que dos rejillas del mismo
    sitio se comporten distinto.
14. **Un tamaño de letra = un papel.** Los diez pasos de la escala
    (`--txt-*`) están en `tokens.css` y se eligen por el papel del texto
    —etiqueta, interfaz, cuerpo, lectura, título— no por parecido. Un sitio
    con veintidós tamaños no se ve variado, se ve hecho a ojo: hay parejas que
    se diferencian en medio píxel y no comunican nada. Lo comprueba
    `npm run check` (punto 9). El razonamiento completo, en
    `referencia/acabado.md`.
15. **Tres duraciones y tres curvas para todo el sitio.** `--rapido` es la
    respuesta a una acción (por encima de 150ms deja de sentirse instantánea),
    `--medio` un cambio de estado, `--lento` una entrada. Dos elementos vecinos
    que responden a distinta velocidad no se leen como «uno es más rápido»,
    se leen como una página sin terminar. Punto 10 del verificador. Y se anima
    `transform` u `opacity`: lo demás repinta la maqueta en cada fotograma.
16. **Todo `:hover` va dentro de `@media (hover: hover)`.** En pantalla táctil
    el hover se aplica al tocar y se queda pegado hasta el toque siguiente. Lo
    que responde al dedo es `:active`, que va fuera. Y lo pulsable mide
    `--toque-min` (44px) en `pointer: coarse`, con los campos del formulario a
    16px como mínimo — por debajo, Safari de iOS hace zoom al enfocarlos.
    → `referencia/trampas.md`, trampas 22 a 24.

## Convenciones

- **Idioma:** todo en español — comentarios, commits, documentación, UI.
- **Comentarios:** explican *por qué*, no *qué*. Si algo está hecho de forma
  no obvia (un orden, un `z-index`, un reflow forzado), el comentario dice
  qué se rompe si se cambia.
- **Commits:** una línea, en español, con el qué concreto («agrego sección de
  servicios», no «cambios»).
- **Ids de sección:** minúsculas, sin acentos ni espacios. Van en la URL y se
  comparten como enlaces: una vez publicados, no se cambian.

## Entorno

- **Node** ≥ 20.19. **Vite 8.**
- `gh` instalado para crear repos y verificar deploys.
- **ImageMagick 7** en `C:\Program Files\ImageMagick-7.1.2-Q16-HDRI` (no
  siempre en el PATH). No hay conversor de PDF a imagen: las portadas y
  capturas las aporta el usuario.
- Red con proxy: si `npm install` falla por SSL,
  `npm config set strict-ssl false`.
