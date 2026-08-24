---
name: pulir-acabado
description: Dar la pasada de acabado a un sitio ya construido — jerarquía visual, sistema tipográfico, interacción, revelado del contenido, detalle y calidad en móvil — y preparar la revisión visual que hace el usuario. Úsala cuando las secciones ya tengan su contenido y antes de publicar, o cuando el usuario diga que el sitio "se ve plano", "parece plantilla", "no se siente premium", "quiero que se vea de más nivel" o pida calidad de estudio de diseño.
---

# Pulir el acabado

El sitio ya dice lo que tiene que decir. Esta es la pasada que decide si se
lee como un trabajo de estudio o como una plantilla rellenada.

Entrada: un proyecto con sus secciones construidas y `npm run check` en verde.
Salida: el mismo sitio con el acabado revisado eje por eje, más una lista de
preguntas concretas para que el usuario haga la revisión visual.

El criterio completo, con el porqué de cada regla, está en
`referencia/acabado.md`. Esto es el procedimiento.

## Lo primero: no lo reescribas

La plantilla ya trae aplicado casi todo lo de `acabado.md`. Esta pasada es
**buscar lo que se salió del sistema**, no rehacer el sistema. Si terminas
tocando `tokens.css` para «mejorar» la escala tipográfica, casi seguro que el
problema estaba en un componente que dejó de usarla.

Y el orden importa: se pule cuando el contenido ya está. Ajustar la jerarquía
de una sección cuyo texto va a cambiar es trabajo que se tira.

## Antes de empezar

```bash
npm run check
```

Si sale rojo, se arregla antes. Los puntos 8, 9 y 10 son justamente los del
acabado, y ninguno de los tres se puede tapar con CSS nuevo:

| Sale | Significa | Se arregla |
|---|---|---|
| Color literal | Alguien escribió `#…` o `rgba(…)` en un componente | Token en `tokens.css`, derivado con `color-mix()` si es un lavado |
| Tamaño de letra literal | Un `font-size` fuera de la escala | Elegir el paso por PAPEL (`--txt-*`), no por parecido |
| Duración o curva literal | Un `0.3s` o un `cubic-bezier(…)` a mano | `--rapido` / `--medio` / `--lento` y las tres curvas |

---

## Los seis ejes

Se recorren en este orden. No es arbitrario: la jerarquía manda sobre la
tipografía, la tipografía sobre el detalle, y el móvil se revisa al final
porque hereda todo lo anterior.

### ① Jerarquía — ¿se lee en el orden correcto?

Abre el sitio, mira cada sección **dos segundos** y anota qué viste primero.
Si no es lo que querías que vieran primero, la sección está mal ordenada, no
mal maquetada.

- ¿Cada sección tiene **una** idea principal? Si tiene dos, se parte en dos
  secciones (una fila más en `site-map.js`).
- ¿Hay **un solo** botón principal por pantalla? En el hero lo garantiza el
  orden de `hero.acciones`: el primero sale `primario`.
- ¿La cabecera de sección usa sus tres niveles —`eyebrow`, `titulo`,
  `subtitulo`— o hay secciones que se saltan el antetítulo y quedan sueltas?
- ¿El orden de las secciones cuenta una historia? Quién eres → qué haces →
  por qué tú → cómo te contacto. Si «Contacto» no es la última, tiene que
  haber un motivo.

### ② Tipografía — ¿hay sistema o hay tamaños?

`npm run check` ya garantiza que todos los tamaños salen de la escala. Lo que
queda es comprobar que salen los **correctos**:

- ¿Algún texto de lectura larga se quedó en `--txt-ui` (15px)? La prosa va en
  `--txt-guia`.
- ¿Algún título de tarjeta quedó del mismo tamaño que su texto? El salto tiene
  que verse sin leer.
- ¿Alguna línea supera los ~75 caracteres? Se le pone una de las medidas
  (`--medida-cuerpo`, `--medida-guia`), no un `max-width` en píxeles.
- Si se cambió la tipografía, ¿sigue bien `--tracking-display`? Una fuente
  ancha necesita más negativo que una condensada. Es un número.

### ③ Interacción — ¿responde?

- ¿Todo lo pulsable tiene los cuatro estados: normal, hover, `:active` y
  `:focus-visible`?
- ¿Los `:hover` nuevos están dentro de `@media (hover: hover)`? Un hover suelto
  se queda pegado en el teléfono (trampas 22).
- ¿Se está animando algo que no sea `transform` u `opacity`? Si sí, hay que
  buscarle la vuelta: animar `width` o `top` repinta la maqueta en cada
  fotograma.
- ¿Cada efecto se puede explicar con «sirve para que el visitante…»? Si no,
  fuera.

### ④ Revelado — ¿tiene ritmo?

- ¿Cada grupo de hermanos animados cuelga de un contenedor con
  `data-anim-secuencia`? Sin él aparecen todos a la vez.
  Los que ya lo traen: la portada, la rejilla de tarjetas, los destacados, las
  dos columnas de un bloque y las de contacto.
- ¿Se usan más de dos variantes en la misma pantalla? Con las cuatro a la vez
  no hay ritmo, hay ruido.
- ¿Alguna sección larga entera aparece de golpe? Suele faltarle la secuencia al
  contenedor.

### ⑤ Detalle — ¿hay gemelos que se comportan distinto?

- ¿Reaccionan igual **todas** las fichas del sitio? Es el fallo que el cliente
  detectó en el primer sitio: tarjetas que se levantaban y destacados que no.
- ¿Alguna cosa salta de sitio al pasar el puntero? Un borde que engorda mueve
  la maqueta.
- ¿Los textos de una misma rejilla miden parecido? Eso se arregla escribiendo,
  no con CSS: recorta el largo y manda el detalle a un modal.
- ¿Todas las imágenes tienen `alt` con lo que se ve? (`npm run check`, 11.)
- ¿Quedan medidas raras (`0.42rem`) de algún ajuste a ojo?

### ⑥ Móvil — ¿sobrevive al teléfono?

Lo que se puede revisar sin teléfono, leyendo el CSS:

- ¿Lo pulsable nuevo entra en el bloque `@media (pointer: coarse)` con
  `--toque-min`? Los peores casos son los enlaces de una lista: como son texto,
  miden lo que mide la línea.
- ¿Algún campo de formulario nuevo se queda por debajo de 16px en táctil? Safari
  de iOS haría zoom al enfocarlo.
- ¿Alguna sección nueva se sale a lo ancho? En el navegador, con la ventana en
  360px de ancho, no debe aparecer barra horizontal.

Lo que **no** se puede revisar sin teléfono va en el guion de abajo.

---

## Al terminar los seis

```bash
npm run check && npm run build
npm run preview
```

`preview` es el único modo que reproduce las rutas de producción.

---

## El guion de revisión

La revisión visual la hace el usuario — aquí no hay navegador automatizado
(regla 10 del proyecto, trampa 15). Pídesela así: **preguntas concretas,
numeradas y respondibles con sí o no**, en vez de «échale un vistazo», que
siempre devuelve «se ve bien» y luego aparecen seis correcciones.

Mándale esto, adaptado al sitio:

> **En el computador:**
> 1. ¿El menú cabe en una sola línea? (míralo también en una ventana estrecha,
>    tipo portátil de 1366px)
> 2. ¿Se ve un canto recto entre la portada y la primera sección?
> 3. ¿El fondo se mueve? Si tienes que fijarte para notarlo, la respuesta es no.
> 4. ¿Los títulos se leen bien sobre el fondo?
> 5. Al pasar el mouse por encima: ¿reaccionan **todas** las fichas, tarjetas y
>    destacados por igual?
> 6. ¿Las tarjetas de cada fila entran una detrás de otra, o todas de golpe?
> 7. ¿Algún título parte mal, con una palabra sola en la última línea?
>
> **En el teléfono** (esto es lo que no se puede comprobar de otra forma):
> 8. ¿Cuál es la primera frase que lees al abrir? ¿Es la que debería ser?
> 9. Al tocar un botón, ¿notas que responde en el momento?
> 10. Después de tocar un enlace y volver atrás, ¿se queda algo «encendido»?
> 11. Al tocar un campo del formulario, ¿la pantalla hace zoom sola?
> 12. Si es un iPhone sin botón: ¿la barra de abajo queda por encima de la raya
>     del gesto, o pisada por ella?
> 13. Gira el teléfono: ¿la portada sigue teniendo sentido o es una pantalla de
>     aire?
> 14. ¿Fallas al pulsar algo? ¿Qué?

Las de la 8 a la 14 son las que de verdad importan: es donde ocurre la primera
impresión de la mayoría de los visitantes y es lo único que no se puede
verificar desde aquí.

## Al cerrar

Lo que se cambió en el **sitio** se anota en su hito
(`.claude/skills/registrar-hito`). Si la pasada descubre algo que le pasaría a
cualquier sitio —una regla que faltaba en la plantilla, una comprobación que
habría cazado el fallo—, eso sube a WebMaker y se registra como hito **del
taller**, no del sitio. Sin las dos anotaciones, el proyecto siguiente repite
el error.
