---
name: revisar-acabado
description: Revisar el acabado del sitio — jerarquía visual, tipografía, interacción, revelado, detalle y calidad en móvil — y preparar la revisión visual que hace el usuario. Úsala antes de publicar un cambio grande, o cuando el usuario diga que el sitio "se ve plano", "parece plantilla", "no se siente premium" o pida más nivel de diseño.
---

# Revisar el acabado

El sitio ya dice lo que tiene que decir. Esta pasada decide si se lee como un
trabajo de estudio o como una plantilla rellenada.

**Lo primero: no lo reescribas.** El acabado ya está montado en el sistema de
tokens de `src/styles/tokens.css`. Esta revisión busca lo que **se salió del
sistema**, no rehace el sistema. Si acabas editando la escala tipográfica para
«mejorarla», casi seguro que el problema estaba en un componente que dejó de
usarla.

## Empieza por la máquina

```bash
npm run check
```

De sus doce comprobaciones, tres son exactamente las del acabado:

| Sale | Significa | Se arregla |
|---|---|---|
| Color literal | Un `#…` o `rgba(…)` en un componente | Token en `tokens.css`; si es un lavado, derivado con `color-mix()` |
| Tamaño de letra literal | Un `font-size` fuera de la escala | Elige el paso por PAPEL (`--txt-*`), no por parecido |
| Duración o curva literal | Un `0.3s` o un `cubic-bezier(…)` a mano | `--rapido` / `--medio` / `--lento` y las tres curvas |

No hay forma de tapar ninguna de las tres con CSS nuevo, y es a propósito: son
reglas que ya se rompieron una vez cuando solo estaban escritas.

## Los seis ejes

En este orden: la jerarquía manda sobre la tipografía, la tipografía sobre el
detalle, y el móvil hereda todo lo anterior.

**① Jerarquía.** Mira cada sección dos segundos y anota qué viste primero. Si
no es lo que querías, la sección está mal ordenada, no mal maquetada. ¿Una sola
idea por sección? ¿Un solo botón principal por pantalla? ¿La cabecera usa sus
tres niveles (antetítulo → título → bajada)?

**② Tipografía.** ¿Hay prosa que se quedó en `--txt-ui` (15px) en vez de
`--txt-guia` (18px)? ¿Algún título de tarjeta mide lo mismo que su texto?
¿Alguna línea pasa de ~75 caracteres sin una medida (`--medida-cuerpo`,
`--medida-guia`)?

**③ Interacción.** ¿Todo lo pulsable tiene los cuatro estados —normal, hover,
`:active`, `:focus-visible`—? ¿Los `:hover` nuevos están dentro de
`@media (hover: hover)`? En táctil el hover se queda pegado hasta el toque
siguiente. ¿Se anima algo que no sea `transform` u `opacity`?

**④ Revelado.** ¿Cada grupo de hermanos animados cuelga de un contenedor con
`data-anim-secuencia`? Sin él entran todos a la vez, que se lee como un salto
de la página. Ya lo traen la portada, la rejilla, los destacados y las dos
columnas de bloque y contacto. ¿Más de dos variantes de `data-anim` en la misma
pantalla? Eso no es ritmo, es ruido.

**⑤ Detalle.** ¿Reaccionan igual **todas** las fichas del sitio, tarjetas y
destacados? ¿Algo salta de sitio al pasar el puntero? ¿Los textos de una misma
rejilla miden parecido —eso se arregla escribiendo, no con CSS—? ¿Todas las
imágenes tienen `alt` con lo que se ve?

**⑥ Móvil.** ¿Lo pulsable nuevo entra en el bloque `@media (pointer: coarse)`
con `--toque-min` (44px)? Los peores casos son los enlaces de una lista: como
son texto, miden lo que mide la línea. ¿Algún campo de formulario nuevo por
debajo de 16px en táctil? Safari de iOS haría zoom al enfocarlo. Con la ventana
a 360px de ancho, ¿aparece barra horizontal?

## Cierra con la máquina y con el usuario

```bash
npm run check && npm run build
npm run preview
```

Y pide la revisión visual con **preguntas numeradas**, no con «échale un
vistazo» —que devuelve «se ve bien» y luego aparecen seis correcciones—:

> **En el computador:** 1) ¿El menú cabe en una línea? 2) ¿Se ve un canto recto
> entre la portada y la primera sección? 3) ¿El fondo se mueve? 4) ¿Los títulos
> se leen sobre el fondo? 5) ¿Reaccionan todas las fichas por igual? 6) ¿Las
> tarjetas entran una detrás de otra o de golpe? 7) ¿Algún título parte mal,
> con una palabra sola abajo?
>
> **En el teléfono:** 8) ¿Cuál es la primera frase que lees? ¿Es la que
> debería? 9) ¿Los botones responden en el momento? 10) Al volver atrás, ¿se
> queda algo «encendido»? 11) ¿La pantalla hace zoom al tocar un campo?
> 12) En iPhone sin botón, ¿la barra de abajo queda por encima de la raya del
> gesto? 13) Girado, ¿la portada sigue teniendo sentido? 14) ¿Fallas al pulsar
> algo?

De la 8 a la 14 es donde ocurre la primera impresión de la mayoría de los
visitantes, y es lo único que no se puede verificar desde aquí. Lo que tú
puedes afirmar es que compila, que las rutas existen y que responde 200 — no
que se ve bien.

## Después

Anota lo que cambiaste en `.claude/hitos/`. Y si lo que encontraste le pasaría
a **cualquier** sitio —una regla que faltaba, una comprobación que lo habría
cazado—, díselo al usuario: eso sube a la plantilla de WebMaker, no se queda
aquí. Si no sube, el siguiente sitio repite el error.
