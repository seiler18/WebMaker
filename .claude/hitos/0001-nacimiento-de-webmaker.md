# 0001 — Nacimiento de WebMaker: plantilla destilada del sitio de currículum

- **Fecha:** 2026-08-23
- **Estado:** completado
- **Commits:** pendiente de commit

## Contexto

El sitio de currículum de Jesús Seiler (`Desarrollo/Curriculo/`) llegó a un
punto bueno tras catorce hitos de trabajo, pero todo lo aprendido estaba
atrapado en ese proyecto: la arquitectura, el build, el deploy, el verificador
de integridad y —sobre todo— la lista de errores ya cometidos.

Al aparecer un proyecto nuevo (`CEDER_SPA`, del que solo había unos estatutos
en PDF) quedó claro el problema: sin destilar nada, el sitio siguiente se
haría decidiendo otra vez la arquitectura de cero y tropezando con las mismas
piedras. Los hitos del Curriculo son en buena parte arreglos de cosas que hoy
se sabe cómo evitar desde el principio.

El encargo fue construir el taller: un `CLAUDE.md` orquestador, `hitos/`,
`skills/`, y un «preagente» que pida la documentación del sitio para después
ejecutar sobre ella.

## Qué se hizo

Se creó `Desarrollo/WebMaker/`, que **no se despliega**: es el taller donde se
fabrican sitios, y produce proyectos hermanos autónomos.

**Orquestación**
- `CLAUDE.md` — el recorrido de seis pasos, el reparto de responsabilidades y
  las diez reglas de la plantilla, cada una con su motivo.
- `hitos/` con este archivo y su índice.

**Skills (`skills/`)** — siete, en el orden del recorrido:
- `levantar-sitio` — el pipeline completo, punto de entrada.
- `recopilar-briefing` — **el preagente**: lee la documentación que haya,
  pregunta solo lo que falta, produce `briefing.md`.
- `definir-identidad` — paleta, tipografía, armazón.
- `generar-andamiaje` — materializa la plantilla y la deja compilando.
- `construir-secciones` — el contenido real, sección por sección.
- `publicar-sitio` — repo, Pages, verificación.
- `registrar-hito` — memoria, con la regla de a quién pertenece cada hito.

**Plantilla (`plantilla/`)** — 26 archivos, un sitio Vite 8 funcionando:
- `src/site-map.js` — registro único de secciones.
- Cuatro tipos de bloque: `hero`, `bloque`, `tarjetas`, `contacto`, más el
  envoltorio común `seccion.js`.
- Dos armazones de navegación en `shell.js`, elegidos con un solo dato.
- `lib/` — `scrollspy.js`, `reveal.js`, `modal.js`.
- `styles/` — cinco archivos, con `tokens.css` como única fuente de color.
- `scripts/check-integrity.js` — siete comprobaciones.
- `dot-claude/` — el `CLAUDE.md`, los `hitos/` y las cinco skills que hereda
  cada proyecto hijo (`editar-contenido`, `agregar-seccion`, `desplegar`,
  `optimizar-imagenes`, `registrar-hito`).

**Referencia (`referencia/`)**
- `arquitectura.md` — qué hace cada pieza y por qué.
- `trampas.md` — quince errores ya cometidos, con causa y arreglo.
- `paletas.md` — seis paletas con contraste comprobado.
- `catalogo-secciones.md` — qué cabe en los bloques existentes y recetas para
  lo que no.

## Decisiones y alternativas descartadas

**Fuera Bootstrap, jQuery y Popper.** Es el cambio más grande respecto al
Curriculo y el mejor justificado: buena parte de sus catorce hitos son
arreglos de esas dependencias — peleas de `z-index` entre el modal y la barra
de navegación, altos de carrusel que saltaban, `.card-deck` descuadrado entre
576 y 768px, viñetas de lista colándose en los menús. Lo que se usaba de
verdad eran cuatro cosas, y todas caben en poco código propio: la rejilla es
CSS Grid, el modal es `<dialog>` nativo (~40 líneas), la animación de entrada
sustituye a AOS con IntersectionObserver (~40 líneas) y el carrusel
simplemente no existe. Un sitio de cuatro secciones sale en ~19 KB de JS y
~22 KB de CSS.

**Sin carrusel, y es una decisión, no un olvido.** El carrusel de Experiencia
del Curriculo costó tres hitos: el alto saltaba entre diapositivas y arrastraba
las secciones de abajo, las flechas se comían el clic del botón «Ver más», y
en móvil la maqueta se descuadraba. Una rejilla `auto-fill` no tiene ninguno
de esos problemas, lo enseña todo de un vistazo y se apila sola. Cuando el
contenido no cabe, la respuesta es filtrar (como ya hacía la sección de
Certificados), no esconder detrás de flechas.

**Un solo registro de secciones en vez de dos listas.** En el Curriculo el
orden vivía en `navigation.js` y el render en `main.js`; podían discrepar y el
scroll-spy empezaba a resaltar la sección equivocada. Hizo falta una regla en
el `CLAUDE.md` y una comprobación en el verificador para vigilarlo. En
`site-map.js` el enlace y el render van en la misma fila: la clase de error
desaparece por construcción. El verificador sigue comprobando el orden, pero
como red, no como necesidad.

**Dos armazones, no uno.** Se planteó llevar solo la sidebar del Curriculo,
pero habría hecho que WebMaker solo sirviera para currículos: una empresa que
quiere parecer seria espera una barra superior. Y se descartó hacer dos
plantillas separadas, que habría duplicado el mantenimiento. La solución es un
dato (`site.armazon`) que cambia el chrome de navegación y su forma en móvil
—cajón desplegable frente a barra inferior de iconos— compartiendo scroll-spy,
secciones y tokens.

**El briefing es un archivo, no una conversación.** Podría haberse dejado que
cada sitio se construyera preguntando sobre la marcha. Se descartó porque un
sitio hecho a base de suposiciones se rehace entero cuando aparece el primer
dato real. `briefing.md` se versiona con el proyecto: es el contrato del que
leen todas las skills, y seis meses después explica por qué el sitio es como
es.

**El preagente lee antes de preguntar.** La regla explícita de no preguntar
nada que ya esté en un documento aportado, con una tabla de qué se saca de
cada tipo de material (estatutos → razón social, giro, domicilio; tarjeta →
correo y teléfono). Es la diferencia entre un interrogatorio de veinte turnos
y tres tandas de cuatro preguntas.

**`{{MARCADORES}}` verificados en el build.** La plantilla usa marcadores en
vez de valores por defecto plausibles. Un valor por defecto plausible se queda
publicado sin que nadie lo note; un `{{NOMBRE}}` hace fallar `npm run check`,
que va dentro de `npm run build`, así que no puede llegar a producción.

**El verificador comprueba el `base` de Vite contra la URL.** Es el error más
silencioso de GitHub Pages: con `base` mal puesto el sitio carga el HTML y
busca el CSS en la raíz del dominio. Se ve el texto desnudo y la consola llena
de 404. Ahora es un error de build, no un descubrimiento en producción.

**Los documentos del cliente van a `tools/`, en el `.gitignore`.** Unos
estatutos con RUT y domicilio de los socios en un sitio servido en claro es
una filtración, no un asset. Publicar uno tiene que ser una decisión
explícita: copiarlo a `assets/docs/` y declararlo en `copy-assets.js`.

**Las skills de WebMaker viven en `skills/`, no en `.claude/skills/`.** Así no
se autodescubren, que era el precio a pagar; se invocan leyendo su ruta. A
cambio son una biblioteca visible y portable —parte se copia a cada proyecto
hijo— en vez de comandos de un proyecto concreto. Fue además lo pedido.

## Consecuencias

- Para un sitio nuevo, el punto de entrada es
  `skills/levantar-sitio/SKILL.md`. **No se escribe código sin briefing
  aprobado.**
- Los proyectos que salen de aquí **se gobiernan solos**: llevan su
  `CLAUDE.md`, sus `.claude/hitos/` y cinco skills. WebMaker no hace falta
  para mantenerlos.
- Cuando un proyecto revele un defecto de la plantilla, hay que anotarlo en
  **dos** sitios: el arreglo del sitio en su hito, la corrección de la
  plantilla aquí. Es el mecanismo por el que WebMaker mejora.
- Un bloque nuevo sube a la plantilla **cuando lo pide un segundo proyecto**,
  no el primero. Así crece con lo demostrado útil.
- El Curriculo **no se toca**. Sigue con Bootstrap y con su carrusel: migrarlo
  no aporta nada y arriesga un sitio que funciona. WebMaker es para los
  siguientes.

## Verificación hecha

La plantilla se materializó en un proyecto de prueba desechable y se comprobó:

- `npm install` limpio, 0 vulnerabilidades.
- `npm run check` en verde, y **cuatro pruebas negativas**: marcador sin
  rellenar, imagen inexistente, `base` incoherente y ancla huérfana. Las
  cuatro se detectan con el mensaje correcto.
- `npm run build` correcto en los **dos** armazones (`topbar` y `sidebar`).
- `npm run preview` sirviendo index, CSS, JS y favicon con **200**, y cero
  marcadores en el HTML servido.

## Pendiente

- **Ningún sitio real construido todavía.** `CEDER_SPA` es el primero y se
  hará en una sesión aparte; es la prueba de verdad del recorrido.
- **Sin revisión visual.** Aquí no hay navegador automatizado: se comprobó que
  la plantilla compila y sirve, no que se ve bien. La primera pasada visual
  será con CEDER_SPA, y es probable que ajuste espaciados del hero y del pie.
- Las recetas de `catalogo-secciones.md` (línea de tiempo, preguntas
  frecuentes, tabla comparativa, galería) están **descritas, no
  implementadas**. Se escriben en el proyecto que las pida.
- La paleta «Papel Claro» avisa de que necesita media hora de ajustes (halos
  del `body` y degradados de texto): no está probada en un sitio real.
