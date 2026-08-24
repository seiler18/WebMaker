# {{NOMBRE}} — sitio web

<!-- Al materializar la plantilla este archivo se renombra a CLAUDE.md
     (ver plantilla/_MARCADORES.md). -->

Sitio de una sola página desplegado en GitHub Pages.
Producción: <{{URL_PRODUCCION}}>

Generado con **WebMaker** (`../WebMaker/`). Este archivo describe **el estado
actual y cómo se trabaja aquí**. No lleva historial: eso vive en
`.claude/hitos/`.

## Dónde está cada cosa

| Necesitas… | Ve a |
|---|---|
| Cambiar un texto, un dato, una tarjeta | `src/data/` — y la skill `editar-contenido` |
| Añadir o quitar una sección | skill `agregar-seccion` |
| Publicar los cambios | skill `desplegar` |
| Saber qué se hizo antes y por qué | `.claude/hitos/` (empieza por su `README.md`) |
| Qué pidió el cliente y qué quedó fuera | `briefing.md` |
| Entender por qué el sitio está hecho así | `../WebMaker/referencia/arquitectura.md` |
| Errores ya cometidos | `../WebMaker/referencia/trampas.md` |

**Antes de una tarea, comprueba si hay una skill que la cubra.** Al terminar
algo con sustancia, registra el hito (skill `registrar-hito`).

## Stack

- **Build:** Vite 8 (`vite.config.js` → `base: '/{{REPO}}/'`)
- **Frontend:** HTML/CSS/JS vanilla. Sin framework, sin jQuery. Los
  componentes son funciones que devuelven strings de HTML.
- **Iconos:** Font Awesome 6 por CDN (prefijos `fa-solid` / `fa-brands`)
- **Tipografía:** Google Fonts
- **Deploy:** GitHub Actions → rama `gh-pages` → GitHub Pages
- **Node:** ≥ 20.19

## Comandos

```bash
npm run dev      # http://localhost:5173/{{REPO}}/
npm run check    # integridad: rutas, ids, marcadores, base, anclas
npm run build    # check + vite build + copy-assets
npm run preview  # sirve dist/ — único modo que reproduce rutas de producción
```

## Cómo funciona

**`src/site-map.js` es la fuente de verdad de la navegación.** De ahí salen a
la vez el orden de las secciones en el DOM, los enlaces del menú, el
scroll-spy y el verificador. Añadir una sección es añadir una fila.

`src/main.js` importa los estilos (en orden), recorre el mapa concatenando el
HTML de cada sección y lo inyecta en `#app`. Después engancha la conducta.

Los componentes son **funciones puras**: no tocan el DOM. Eso permite
renderizar el sitio en Node y validarlo con `npm run check` sin navegador.

### Assets y el build

Vite procesa (y hashea) solo lo que se importa desde `main.js`. Las imágenes
que van en strings de HTML y los PDFs **no** los ve, y por eso
`scripts/copy-assets.js` los copia al `dist/` después del build.
→ Si añades una carpeta que deba llegar a producción, decláralo ahí.

### Deploy

`git push origin main` → Actions → `npm ci && npm run build` → `dist/`
publicado en `gh-pages`. ~2 minutos. Ver skill `desplegar`.

## Reglas del proyecto

1. **Contenido en `src/data/`, presentación en `src/components/`.** Ningún
   texto del cliente dentro de un componente.
2. **Ningún color literal fuera de `src/styles/tokens.css`.**
3. **`responsive.css` se importa el último** en `main.js`: sus overrides ganan
   por orden de cascada, sin `!important`.
4. **Rejillas, no carruseles.** Si el contenido no cabe, se filtra.
5. **`npm run check` antes de cualquier push.** Va dentro de `npm run build`,
   así que un fallo hace fallar el deploy en vez de llegar a producción.
6. **Ninguna credencial en el proyecto.** GitHub Pages sirve todo en claro.
7. **Los documentos del cliente van en `tools/`**, que está en el
   `.gitignore`. Publicar uno es una decisión explícita: se copia a
   `assets/docs/` y se declara en `copy-assets.js`.
8. **Nombres de archivo exactos.** GitHub Pages distingue mayúsculas y
   Windows no. Copia el nombre con `ls`, no de memoria.
9. **Los ids de sección no se cambian** una vez publicados: van en la URL y
   se comparten como enlaces.

## Convenciones

- **Idioma:** todo en español — comentarios, commits, documentación, UI.
- **Comentarios:** explican *por qué*, no *qué*.
- **Commits:** una línea, en español, con el qué concreto.

## Herramientas

- **No hay navegador automatizado.** Lo verificable es `npm run check`,
  `npm run build` y códigos HTTP sobre `npm run preview`. La revisión
  **visual** la hace el usuario: si no la hiciste, dilo en vez de darla por
  buena.
- **ImageMagick 7** en `C:\Program Files\ImageMagick-7.1.2-Q16-HDRI` (no
  siempre en el PATH). Ver skill `optimizar-imagenes`.
- Red con proxy: si `npm install` falla por SSL,
  `npm config set strict-ssl false`.
