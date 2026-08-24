---
name: levantar-sitio
description: Construir un sitio web nuevo de principio a fin, desde la documentación del cliente hasta el sitio publicado en GitHub Pages. Úsala cuando el usuario diga "hazme la web de X", "quiero un sitio para este proyecto", o señale una carpeta con documentación y pida convertirla en página web. Orquesta las demás skills de WebMaker en orden.
---

# Levantar un sitio de cero

Es el recorrido completo. Cada paso tiene su propia skill con el detalle; esto
es el orden, lo que no se puede saltar y dónde suele torcerse.

## Antes de empezar: ¿dónde va?

El sitio vive en su **propia carpeta hermana**, nunca dentro de WebMaker:

```
OneDrive\Desarrollo\
├── WebMaker\          ← el taller. No se despliega.
├── Curriculo\         ← un sitio
└── <PROYECTO>\        ← el sitio nuevo
```

Si el usuario ya creó la carpeta con documentación dentro (lo habitual), se
trabaja ahí mismo: los documentos fuente se quedan, y se mueven a `tools/`
—que está en el `.gitignore`— para que no se publiquen.

> **Los documentos del cliente no se publican.** Unos estatutos con RUT y
> domicilio de los socios en un sitio servido en claro es una filtración, no
> un asset. Van a `tools/`, y si el usuario quiere publicar alguno, se decide
> explícitamente y se copia a `assets/docs/`.

## Los seis pasos

### ① Briefing — `skills/recopilar-briefing/SKILL.md`

**No se salta.** Lee la documentación que haya, pregunta solo lo que falta,
escribe `briefing.md` y espera aprobación.

Salida: `<PROYECTO>/briefing.md` en estado `aprobado por el usuario`.

### ② Identidad — `skills/definir-identidad/SKILL.md`

Paleta, tipografía y armazón (`topbar` o `sidebar`). Son tres decisiones, se
resuelven en una tanda de preguntas con las opciones ya preparadas.

Salida: tres valores anotados en el briefing.

### ③ Andamiaje — `skills/generar-andamiaje/SKILL.md`

Copia `plantilla/`, sustituye los marcadores, ajusta `site-map.js` a las
secciones del briefing y deja `npm run check` y `npm run build` en verde con
contenido de verdad (aunque falten textos).

Salida: proyecto que compila. Todavía feo, pero vivo.

### ④ Secciones — `skills/construir-secciones/SKILL.md`

Una sección por vez, en el orden del briefing. Tras cada una, `npm run check`.

Salida: el sitio con su contenido real.

### ⑤ Publicar — `skills/publicar-sitio/SKILL.md`

Repo en GitHub, primer push, Actions, verificación en producción.

Salida: URL que funciona.

### ⑥ Hito — `skills/registrar-hito/SKILL.md`

En el proyecto hijo: `.claude/hitos/0001-…`. Qué se construyó, qué se decidió
y qué quedó pendiente.

## Dónde se tuerce esto

| Síntoma | Causa | Qué hacer |
|---|---|---|
| El sitio carga sin estilos en producción | `base` de `vite.config.js` no coincide con el nombre del repo | `npm run check` lo detecta. Corrige y vuelve a subir |
| Imagen que se ve en local y da 404 publicada | Mayúsculas del nombre | GitHub Pages distingue, Windows no. Renombra copiando el nombre con `ls` |
| Imagen que no aparece ni en local | No está declarada en `scripts/copy-assets.js` | Vite no ve las rutas dentro de strings de HTML |
| El formulario dice «pendiente de confirmación» | FormSubmit no tiene el buzón validado | Es lo normal la primera vez. Hay que aceptar el correo que llega |
| El menú móvil se queda abierto al pasar a escritorio | El `@media` de `responsive.css` y el `matchMedia` de `shell.js` no hablan del mismo ancho | Cambiar **los dos**. `referencia/trampas.md` 21 |
| El menú de escritorio ocupa dos líneas | Etiquetas largas + el lema de la marca comiendo espacio | Ya resuelto en la plantilla. Si vuelve, `trampas.md` 20 |
| Una franja recta separa la portada de la primera sección | Se tocó la máscara de `.hero-fondo` | `trampas.md` 18 |
| `npm install` falla por SSL | Proxy corporativo | `npm config set strict-ssl false` |

## Qué se puede prometer y qué no

Aquí **no hay navegador automatizado**. Lo que se puede afirmar con pruebas:

- `npm run check` pasa (rutas, ids, marcadores, `base`, anclas)
- `npm run build` termina sin errores
- `npm run preview` sirve el index, el CSS, el JS y las imágenes con 200
- El workflow de Actions termina en verde

Lo que **no** se puede afirmar sin que lo mire el usuario: que se ve bien.
Alineaciones, saltos de línea de los títulos, si una foto queda recortada
donde importa, cómo se siente en un celular real. Pídele esa pasada y dilo
claramente en vez de darlo por bueno.

## Lo que el cliente comenta en la primera revisión

Del primer sitio de cliente (CEDER SpA) salieron seis observaciones y **las
seis eran visuales**: ninguna la habría detectado `npm run check`. Todas están
ya resueltas en la plantilla, pero conviene mirarlas antes de entregar, porque
son justo lo que se ve en los dos primeros segundos:

- **¿El menú cabe en una línea?** Con cinco o seis secciones de etiqueta larga,
  míralo en un portátil de 1366px, no solo en tu monitor. `trampas.md` 20.
- **¿Se ve un canto recto entre la portada y la primera sección?** Entonces la
  máscara de `.hero-fondo` se ha tocado. `trampas.md` 18.
- **¿El fondo se mueve de verdad?** Si hay que fijarse para notarlo, no se
  mueve. `trampas.md` 19.
- **¿Los títulos se leen sobre el fondo?** Los de degradado necesitan su
  contorno `drop-shadow`. `trampas.md` 17.
- **¿Reaccionan al puntero TODAS las fichas?** Tarjetas y destacados.
- **¿Sobra texto?** Tres párrafos densos en «Quiénes somos» se saltan. Dos
  cortos, con los datos repartidos en los destacados, se leen.

Y una que no es estética pero salió en la misma tanda: **¿el sitio se limita a
una zona sin querer?** Una frase como «con base en <ciudad>» en la portada se
lee como el límite del área de trabajo del cliente. El domicilio es un dato de
Contacto, etiquetado como tal — y si atiende a todo el país, hay que decirlo.

## Si el proyecto ya tiene sitio

Esto es para sitios nuevos. Para tocar uno ya generado, trabaja **dentro del
proyecto**: tiene su propio `CLAUDE.md` y sus `.claude/skills/`
(`agregar-seccion`, `editar-contenido`, `desplegar`…). WebMaker solo vuelve a
entrar si hay que mejorar la plantilla para todos los sitios futuros — y eso
se registra como hito de WebMaker.
