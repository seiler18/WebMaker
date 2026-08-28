# WebMaker

**Un taller para fabricar sitios web, no un sitio web.**

WebMaker convierte la documentación de un proyecto o una empresa —unos
estatutos, una presentación comercial, cuatro notas sueltas— en un sitio web
publicado, sin volver a decidir de cero la arquitectura, el build, el deploy ni
los mismos errores que ya se cometieron una vez.

No se despliega en ninguna parte. Produce **proyectos hermanos autónomos**, y
después se aparta.

---

## De dónde sale

De [seiler18.github.io/Curriculo](https://seiler18.github.io/Curriculo/) y de
sus catorce hitos de correcciones.

Aquel sitio llegó a un punto bueno, pero todo lo aprendido estaba atrapado
dentro: la arquitectura, el verificador de integridad y —sobre todo— la lista
de piedras ya pisadas. Al aparecer el proyecto siguiente quedó claro el
problema: sin destilar nada, el próximo sitio se haría decidiendo otra vez lo
mismo y tropezando igual.

WebMaker es esa destilación. Buena parte de sus decisiones son un «esto ya se
probó y salió mal», documentado en
[`referencia/trampas.md`](referencia/trampas.md).

---

## El recorrido

```
   documentos del cliente (PDF, presentación, un logo, una web vieja)
             │
             ▼
   ① recopilar-briefing     lee lo que hay, pregunta SOLO lo que falta
             │
             ▼
       briefing.md          ← el contrato. Todo lo de abajo lee de aquí.
             │
             ▼
   ② definir-identidad      paleta, tipografía, armazón
   ③ generar-andamiaje      materializa la plantilla, deja el check en verde
   ④ construir-secciones    una sección por vez, desde el briefing
   ⑤ pulir-acabado          jerarquía, tipografía, interacción, revelado,
                            detalle y móvil — y el guion de revisión visual
   ⑥ publicar-sitio         repo, GitHub Pages, verificación
   ⑦ registrar-hito         memoria, en el proyecto hijo
```

**La regla que gobierna todo lo demás:** primero el briefing, después el
código. Un sitio construido a base de suposiciones se rehace entero cuando
aparece el primer dato real; uno construido desde un briefing se ajusta.

---

## Qué hay dentro

```
WebMaker/
├── CLAUDE.md          el orquestador: el recorrido y las reglas
├── .claude/
│   ├── skills/        8 procedimientos, uno por paso
│   └── hitos/         qué se decidió y contra qué
├── plantilla/         38 archivos: un sitio Vite 8 que ya funciona
└── referencia/        arquitectura · acabado · trampas · paletas · catálogo
```

### La plantilla

Un sitio de una sola página, listo para publicar en GitHub Pages:

- **Registro único de secciones** (`src/site-map.js`): el enlace del menú y el
  bloque que abre viven en la misma fila. Añadir una sección es añadir una
  fila — el menú, el orden en el DOM y el resaltado de la sección visible
  salen solos.
- **Dos armazones de navegación**, elegidos con un dato: barra superior
  (empresa) o columna lateral que en móvil pasa a barra de iconos
  (currículo, portafolio).
- **Cuatro tipos de bloque** que cubren casi cualquier sitio corporativo:
  portada, prosa con imagen, rejilla de tarjetas filtrable y contacto.
- **Formulario de contacto sin backend**: correo vía FormSubmit o WhatsApp con
  el mensaje ya armado. Sin credenciales, porque GitHub Pages sirve todo en
  claro.
- **Sistema de acabado en tokens**: una paleta, diez pasos tipográficos con un
  papel cada uno, tres duraciones y tres curvas. Cambiar la identidad del sitio
  es editar un bloque, y el resto del CSS no puede salirse del sistema porque
  el verificador lo rechaza.
- **Verificador** (`npm run check`) con doce comprobaciones —siete de
  integridad y cinco de acabado—, y va **dentro** de `npm run build`: un fallo
  rompe el deploy en vez de llegar a producción.
- **Deploy automático** a GitHub Pages por Actions.

### El verificador

Doce cosas que un build correcto no detecta:

| # | Comprueba | Por qué |
|---|---|---|
| 1 | Marcadores `{{…}}` sin rellenar | Publicar con `{{NOMBRE}}` en la portada |
| 2 | Ids duplicados | Rompen las anclas en silencio |
| 3 | Orden de secciones vs. el mapa | El scroll-spy asume que coinciden |
| 4 | Modales que apuntan a la nada | — |
| 5 | Archivos referenciados que no existen | Vite no valida rutas dentro de strings de HTML |
| 6 | `base` de Vite vs. URL de producción | El error más silencioso de Pages: carga sin estilos |
| 7 | Anclas huérfanas | Enlaces de menú que no llevan a ningún sitio |
| 8 | Colores literales fuera de `tokens.css` | Al cambiar de paleta sobrevive el azul anterior |
| 9 | Tamaños de letra literales | Veintidós tamaños no se ven variados, se ven hechos a ojo |
| 10 | Duraciones y curvas literales | Dos fichas vecinas que responden distinto se leen como algo sin terminar |
| 11 | Imágenes sin `alt` | Es lo que se lee en voz alta y lo que se ve si la imagen no carga |
| 12 | Variantes de animación que no existen | Un `data-anim` mal escrito no da error: deja la secuencia a medias |

Los cinco últimos existen porque esas reglas **estaban escritas desde el primer
día y se rompieron igual**: romperlas no falla en ninguna parte, se ve meses
después en una revisión visual. Una regla de acabado que no se comprueba es una
intención.

---

## Qué **no** lleva, a propósito

| Ausencia | Motivo |
|---|---|
| Bootstrap, jQuery, Popper | Buena parte de los hitos del sitio original son arreglos de esas dependencias: modal por debajo de la barra, `.card-deck` descuadrado, viñetas colándose en el menú |
| Carrusel | Costó tres hitos —alto que saltaba, flechas que se comían el clic del botón, maqueta rota en móvil. Una rejilla `auto-fill` no tiene ninguno de esos problemas |
| Librería de animación | 80 líneas con `IntersectionObserver` hacen lo único que se usaba, escalonado incluido |
| Librería de modales | `<dialog>` nativo da el foco atrapado, Escape y fondo inerte gratis |

Resultado: un sitio de cuatro secciones son **~19 KB de JS y ~22 KB de CSS**,
sin CDNs de terceros salvo tipografía e iconos.

---

## Uso

Los sitios viven como **hermanos** de esta carpeta, nunca dentro:

```
OneDrive/Desarrollo/
├── WebMaker/          ← el taller
├── Curriculo/         ← un sitio
└── MiProyecto/        ← el sitio nuevo
```

El punto de entrada es
[`.claude/skills/levantar-sitio/SKILL.md`](.claude/skills/levantar-sitio/SKILL.md).

```bash
# ya dentro del proyecto generado
npm install
npm run check      # integridad + acabado (12 comprobaciones)
npm run build      # check + vite build + copy-assets
npm run preview    # único modo que reproduce las rutas de producción
```

Las skills de `.claude/skills/` **se autodescubren**: se invocan por nombre.
Las de `plantilla/dot-claude/skills/` son otras — las que hereda cada sitio
generado — y aquí no se ejecutan, se copian.

### Lo que hereda cada sitio generado

Un proyecto que se gobierna solo: su propio `CLAUDE.md`, sus `.claude/hitos/`
y seis skills (`editar-contenido`, `agregar-seccion`, `revisar-acabado`,
`desplegar`, `optimizar-imagenes`, `registrar-hito`). Después de publicarlo,
WebMaker ya no hace falta para mantenerlo.

---

## Cómo mejora

Cuando construir un sitio revela un defecto de la plantilla, se anota en
**dos** sitios: el arreglo del sitio en su hito, la corrección de la plantilla
en `.claude/hitos/` de aquí. Sin las dos, el proyecto siguiente repite el error.

Un bloque nuevo sube a la plantilla **cuando lo pide un segundo proyecto**, no
el primero. Así crece con lo demostrado útil y no con lo que pareció buena idea
una vez.

---

## Estado

La plantilla está **verificada**: instalación limpia sin vulnerabilidades,
`npm run check` en verde sobre una materialización de prueba, `npm run build`
correcto, y `preview` sirviendo index, CSS, JS e imágenes con 200. Las doce
comprobaciones del verificador tienen prueba negativa: se inyecta la infracción
y se confirma que sale con código 1.

Lo que todavía **no** está probado: el aspecto. Aquí no hay navegador
automatizado — se comprobó que compila y sirve, no que se ve bien. Del sistema
de acabado, lo que solo se puede confirmar en un teléfono real (la franja del
gesto en iPhone, el zoom de Safari al enfocar un campo, si el escalonado se
siente o se sufre) está **pendiente de la primera revisión visual**, y por eso
`.claude/skills/pulir-acabado/SKILL.md` lleva el guion de preguntas para pedirla.

Las recetas de [`referencia/catalogo-secciones.md`](referencia/catalogo-secciones.md)
(línea de tiempo, preguntas frecuentes, tabla comparativa, galería) están
descritas, no implementadas: se escriben en el proyecto que las pida.

---

## Stack

Vite 8 · HTML/CSS/JS vanilla · Font Awesome 6 · Google Fonts ·
GitHub Actions → GitHub Pages · Node ≥ 20.19

---

Jesús Seiler — [seiler18.github.io/Curriculo](https://seiler18.github.io/Curriculo/)
