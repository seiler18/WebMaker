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
    ⑤  publicar-sitio          ← repo, GitHub Pages, verificación
              │
              ▼
    ⑥  registrar-hito          ← memoria, en el proyecto hijo
```

Los pasos ② a ⑥ se pueden repetir. El ① se hace una vez y se actualiza
cuando el cliente cambia de idea (y entonces se anota en su hito).

## Dónde está cada cosa

| Necesitas… | Ve a |
|---|---|
| Arrancar un sitio nuevo de principio a fin | `skills/levantar-sitio/SKILL.md` |
| Sacarle al usuario la información del sitio | `skills/recopilar-briefing/SKILL.md` |
| Elegir colores, tipografía y armazón | `skills/definir-identidad/SKILL.md` |
| Crear el proyecto y dejarlo compilando | `skills/generar-andamiaje/SKILL.md` |
| Escribir las secciones | `skills/construir-secciones/SKILL.md` |
| Publicar en GitHub Pages | `skills/publicar-sitio/SKILL.md` |
| Dejar memoria de lo hecho | `skills/registrar-hito/SKILL.md` |
| Entender **por qué** el sitio está hecho así | `referencia/arquitectura.md` |
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
