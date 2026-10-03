---
name: fondos-react-bits
description: Añadir un fondo animado (WebGL o canvas 2D) o efectos de interacción tipo React Bits a un sitio —hero con aurora, rejilla, puntos, contadores, brillo en tarjetas, botones magnéticos, chispas, destello en el título—. Úsala cuando el usuario pida "un fondo animado", "un hero con efecto", "algo como React Bits" o quiera animar un proyecto nuevo o existente. Sirve para sitios vanilla (Vite) y para proyectos React.
---

# Fondos y efectos de React Bits

Fuente: <https://github.com/DavidHDev/react-bits> (≈48 mil estrellas, activo).
Los componentes están en `src/content/<Categoría>/<Nombre>/<Nombre>.jsx`.
Categorías útiles: `Backgrounds` (Aurora, Galaxy, Particles, Silk, Waves,
LightRays, DarkVeil, Plasma, Beams, FaultyTerminal, RippleGrid, Radar, DotField,
GridScan…) y
`Animations` (AnimatedContent, FadeContent, Magnet, GlareHover, ClickSpark,
cursores…).

**Implementación de referencia:** `Curriculo/src/lib/fondo-dotField.js` (canvas
2D, sin dependencias) y su uso en `Curriculo/src/components/hero.js`
(`initHero`). Para un efecto WebGL con `ogl`, la envoltura de pausa, fallback por
rendimiento y reducción de movimiento está descrita en los hitos 0019–0021 de
Curriculo (esos archivos se borraron: ver el `git log` si hace falta). Cópiale
la estructura, no el efecto.

## La licencia manda: MIT + Commons Clause

Se puede usar dentro de un sitio, también comercial. **No se puede vender,
sublicenciar ni redistribuir el componente en sí**, ni suelto, ni en un
paquete, ni portado. Consecuencias para el taller:

- **Ningún componente de React Bits va en `plantilla/`.** La plantilla se copia
  a cada proyecto nuevo: sería redistribuirlo. Se trae **al proyecto que lo
  usa**, en el momento, con esta skill.
- Cada archivo derivado lleva en la cabecera el aviso de copyright
  (`Copyright (c) 2026 David Haz`, MIT + Commons Clause) y la advertencia de
  no copiarlo a plantillas ni publicarlo como librería. Copia la cabecera de
  `fondo-dotField.js`.
- Si un sitio generado se **entrega como producto de plantilla** (no como
  sitio), parar y preguntar al usuario: es el caso gris.
- Releer `LICENSE.md` del repo antes de la primera vez de cada sesión larga:
  `gh api repos/DavidHDev/react-bits/license --jq .content | base64 -d`.

**Para un hero con mucho contenido** (título, párrafo, cinta, cifras) elige un
fondo que se lea como textura, no como figura. En Curriculo se probaron cuatro
antes de acertar (hitos 0019–0022): RippleGrid y FaultyTerminal competían con
el texto, Radar «parecía una telaraña», y DotField (matriz de puntos) fue el que
se quedó.

## Procedimiento

### 1. Elegir

**Primero, que el usuario vea las demos**: <https://reactbits.dev/backgrounds>.
Elegir a ciegas por nombre costó cuatro iteraciones; el gusto es suyo y verlo
en movimiento tarda un minuto. Pídele el nombre del que le guste y pórtalo.

El efecto sale del **briefing y la identidad** del sitio, no del catálogo.
Un fondo es tono: una rejilla dice «técnico», una aurora «producto»,
partículas «ambiente». Prefiere, por este orden: canvas 2D sin dependencias (DotField), los que usan
solo `ogl` (ligeros, ~15 KB) y, al final, los de `three` / `@react-three/*`
(cientos de KB). `GridScan` descarga modelos
de `face-api` en ejecución: evítalo.

### 2. Traer el código y revisarlo

```bash
gh api repos/DavidHDev/react-bits/contents/src/content/Backgrounds/<Nombre>/<Nombre>.jsx \
  --jq .content | base64 -d > <scratchpad>/<Nombre>.jsx
```

Léelo entero antes de usarlo. Comprobaciones mínimas: sin `fetch`, `eval`,
`new Function`, `dangerouslySetInnerHTML`, cookies ni `localStorage`; sin
URLs externas (algunos traen imágenes demo de Unsplash/picsum: se sustituyen
por un asset propio); lista de `import` solo de librerías conocidas.

```bash
grep -nE "fetch\(|eval\(|new Function|dangerouslySetInnerHTML|document\.cookie|localStorage|sendBeacon|WebSocket|https?://" <Nombre>.jsx
grep -E "^import" <Nombre>.jsx
```

### 3a. Sitio vanilla (como Curriculo): portar a una función

Los efectos de `ogl` son casi todo JS puro dentro de un `useEffect`. El port:

1. Si es WebGL: `npm install ogl` (queda fijado en el lockfile; el deploy usa
   `npm ci`). Si es canvas 2D no hay nada que instalar. Si luego se cambia de
   efecto y `ogl` queda sin uso, `npm uninstall ogl`.
2. Crea `src/lib/fondo-<nombre>.js` exportando `montar<Nombre>(contenedor,
   opciones, zonaPuntero)` que devuelva `{ destruir() }` o `null`.
3. El cuerpo del `useEffect` pasa a la función; los `useRef` son variables
   locales; los props son `opciones` con valores por defecto; el `return` del
   efecto es `destruir()`.
4. **Añade siempre las salvaguardas** (DotField las lleva; cópialas):
   - `IntersectionObserver`: no animar fuera de pantalla.
   - `visibilitychange`: no animar con la pestaña oculta.
   - `prefers-reduced-motion`: pintar un solo fotograma y no escuchar el puntero.
   - Sin contexto (WebGL o 2D) → devolver `null`; el llamador deja el fondo CSS
     de reserva.
   - **Solo animar mientras haya algo que mover.** Los componentes de React
     Bits redibujan a 60 fps aunque no pase nada: si el efecto queda en reposo
     (sin cursor, sin onda), dormir el `requestAnimationFrame`.
   - **Fallback por rendimiento** si el shader es pesado (ruido fractal,
     varias pasadas): medir ~90 fotogramas tras el calentamiento y, si la
     media pasa de 45 ms, desmontar y avisar con un callback `alLento`.
   - Si el shader pinta fondo opaco: `mix-blend-mode: screen` en el
     contenedor para que el negro sea transparente.
5. El puntero se escucha en el contenedor del hero (no en el canvas, que va
   detrás del texto con `pointer-events: none`).
6. El color sale del token CSS de la marca (`getComputedStyle`), no de un
   literal nuevo.

### 3b. Proyecto React

Se copia el `.jsx` tal cual (más su `.css` si lo trae) a `src/components/` e
instalas solo lo que importe: `npm install ogl` (u otra). Mismas salvaguardas
del paso 3a si el componente original no las trae.

### 4. Integrar en el hero

- Capa propia: `<div class="hero-puntos" aria-hidden="true"></div>` con
  `position:absolute; inset:0; pointer-events:none`. El `z-index` queda
  dentro del contexto de apilamiento del hero (`isolation: isolate`); nunca
  pongas `isolation`/`transform`/`filter` en un ancestro que contenga modales.
- Añade una clase al hero (`hero--puntos`) **solo si el montaje tuvo éxito**, y
  úsala si hay que ocultar el fondo CSS que sobraría. Sin el efecto el sitio se
  ve como antes.
- Una **máscara radial** en la capa (`mask-image`) la desvanece hacia los
  bordes; sin ella el efecto acaba en una línea recta.
- **Legibilidad:** el efecto no debe cruzar el texto con intensidad. Empieza
  tenue (opacidad ≈ 0.4–0.6) y comprueba el párrafo de más abajo del hero.
- La **CSP** no cambia: un canvas (WebGL o 2D) no es un recurso externo. Si el
  componente carga algo de fuera (modelos, imágenes), sí hay que declarar el
  dominio y abrir la página en el navegador para confirmarlo.

### 5. Verificar

`npm run check` + `npm run build`, y probar contra `npm run preview` (no
`dev`: solo preview reproduce las rutas de producción). Con el CLI de
Playwright, en el scratchpad: que `canvas` exista dentro del hero, que no haya
errores de consola y que no haya desborde horizontal a 390 px. Los avisos
`GPU stall due to ReadPixels` son del render por software del headless, no del
sitio. **La revisión visual real la hace el usuario**: pídele que lo mire y no
des el efecto por bueno solo por la captura.

### 6. Dejar memoria

Registra el hito en el proyecto (skill `registrar-hito`): qué efecto, por qué
ese, qué intensidad, y la nota de licencia.

## Efectos de interacción (además del fondo)

Implementación de referencia:  y
 (copia en el hub). Cinco  que se
llaman desde  con un selector:

| Efecto | Función | Dónde aplicarlo |
|---|---|---|
| Cifras que suben de 0 |  | cifras que empiezan por número |
| Resplandor que sigue al cursor |  | fichas / tarjetas |
| Botón que se acerca al cursor |  | CTA del hero, 2–3 botones |
| Chispas al pulsar |  | solo los CTA, nunca toda la página |
| Título que entra por palabras |  | título de color LISO |
| Destello que recorre el texto | solo CSS | un lema o nombre con degradado |

**Reglas, cada una salida de un fallo real** (Curriculo hito 0023, hub 0004):

- Todo se apaga con ; los de puntero solo con
  . Las chispas sí valen en táctil.
- **El título por palabras NO vale con degradado recortado al texto**
  (): las palabras  animadas dejan de
  heredar el recorte y el título queda **invisible**. Probado en el hub.
- **Destello sobre texto con degradado:** propiedades sueltas
  (, , ), NUNCA el
  atajo , que reinicia el . Es una excepción
  deliberada a «solo transform y opacity»: déjalo escrito en el CSS.
- **Imán con la propiedad **, no , y añadirla a la lista
  de  del botón; así convive con el  del hover.
- **Contadores: acota el progreso a [0, 1].** El  de
   puede ser anterior al  y la cifra aparece como
  «-1». El HTML ya trae el valor final: sin JS no se rompe nada.
- Construye las palabras con , no con , y deja el
  texto completo en .
- Duraciones y colores por token. En el hub, además, añade  a
   del verificador para que sus reglas también valgan.
- **CSP estricta (`style-src 'self'` sin `'unsafe-inline'`)**: `canvas.style.cssText = '...'`
  y `setAttribute('style', ...)` se bloquean; asigna propiedades sueltas con
  `Object.assign(canvas.style, {...})` o `el.style.prop = ...` (esas sí valen).
  Pruébalo contra el build con la CSP activa (gestor-acciones, hito 0007).
- **Vistas que se repintan enteras (SPA):** el efecto no debe sobrevivir al
  elemento. `montarDotField` se autodestruye si su canvas sale del DOM, e
  `initMagnetico` suelta su listener cuando ya no queda ningún botón conectado;
  sin eso cada cambio de vista dejaba un intervalo y varios listeners vivos
  (FinanzasMaker, hito 0009).
- **Adapta el efecto a la temática, no copies el conjunto:** CEDER (licitaciones
  públicas, cero cifras no demostrables) y sistemas-gestion (auditoría ISO)
  omitieron chispas y contadores inventados; finanzas usó un chip con la
  diferencia (+$25.000) en vez de un parpadeo verde/rojo, que se lee como error.
  Un efecto que añade un dato que la página no tiene, miente.
- **Las copias divergen:** `efectos.js` y `fondo-dotField.js` están copiados en
  seis proyectos. Quien mejore uno (autodestrucción, CSP) debe revisar los
  demás; no hay paquete compartido por la licencia.
- **Prueba en navegador** cada efecto (Playwright): dos de los errores de arriba
  solo se vieron así; ni el  ni el  los cazan.

## Efectos de interacción (además del fondo)

Implementación de referencia: `Curriculo/src/lib/efectos.js` y
`Curriculo/src/styles/efectos.css` (copia en el hub). Cinco `init*` que se
llaman desde `main.js` con un selector:

| Efecto | Función | Dónde aplicarlo |
|---|---|---|
| Cifras que suben de 0 | `initContadores` | cifras que empiezan por número |
| Resplandor que sigue al cursor | `initBrillo` | fichas / tarjetas |
| Botón que se acerca al cursor | `initMagnetico` | CTA del hero, 2–3 botones |
| Chispas al pulsar | `initChispas` | solo los CTA, nunca toda la página |
| Título que entra por palabras | `initTituloPalabras` | título de color LISO |
| Destello que recorre el texto | solo CSS | un lema o nombre con degradado |

**Reglas, cada una salida de un fallo real** (Curriculo hito 0023, hub 0004):

- Todo se apaga con `prefers-reduced-motion`; los de puntero solo con
  `(hover: hover) and (pointer: fine)`. Las chispas sí valen en táctil.
- **El título por palabras NO vale con degradado recortado al texto**
  (`background-clip: text`): las palabras `inline-block` animadas dejan de
  heredar el recorte y el título queda **invisible**. Probado en el hub.
- **Destello sobre texto con degradado:** propiedades sueltas
  (`background-image`, `background-size`, `background-position`), NUNCA el
  atajo `background`, que reinicia el `background-clip`. Es una excepción
  deliberada a «solo transform y opacity»: déjalo escrito en el CSS.
- **Imán con la propiedad `translate`**, no `transform`, y añadirla a la lista
  de `transition` del botón; así convive con el `translateY` del hover.
- **Contadores: acota el progreso a [0, 1].** El `t` de `requestAnimationFrame`
  puede ser anterior al `t0` y la cifra aparece como «-1». El HTML ya trae el
  valor final: sin JS no se rompe nada.
- Construye las palabras con `createElement`, no con `innerHTML`, y deja el
  texto completo en `aria-label`.
- Duraciones y colores por token. En el hub, además, añade `efectos.css` a
  `CSS_REVISADOS` del verificador para que sus reglas también valgan.
- **Prueba en navegador** cada efecto (Playwright): dos de los errores de arriba
  solo se vieron así; ni el `build` ni el `check` los cazan.

## Qué NO hacer

- No copies el repo entero ni instales su CLI/registro a ciegas: se toma **un
  componente**, se lee y se adapta.
- No metas un componente en `plantilla/` ni en un paquete compartido.
- No dejes un fondo sin pausa fuera de pantalla: en móvil es batería.
- No uses efectos pesados (`three`) para un detalle que un canvas 2D, `ogl` o CSS
  resuelve.
- No elijas el efecto sin que el usuario haya visto las demos.
- No añadas estelas ni efectos de cursor globales: son lo más ruidoso y
  estorban en móvil.
- No añadas estelas ni efectos de cursor globales: son lo más ruidoso y
  estorban en móvil.
