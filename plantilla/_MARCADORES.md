# Cómo se materializa la plantilla

Este archivo es para quien copia `plantilla/` a un proyecto nuevo. **No se
copia**: se borra al terminar (junto con esta línea).

## 1. Copiar y renombrar

Todo el contenido de `plantilla/` va a la raíz del proyecto nuevo, con dos
renombrados obligatorios:

| En la plantilla | En el proyecto |
|---|---|
| `dot-gitignore` | `.gitignore` |
| `dot-github/` | `.github/` |
| `dot-claude/` | `.claude/` |
| `PROYECTO-CLAUDE.md` | `CLAUDE.md` |
| `_MARCADORES.md` | *(se borra)* |

El prefijo `dot-` existe porque un `.gitignore`, un `.github/workflows/` o un
`.claude/skills/` dentro de `plantilla/` afectarían al propio repositorio de
WebMaker. Y `PROYECTO-CLAUDE.md` no se llama ya `CLAUDE.md` para que no se
cargue como instrucciones al trabajar dentro de WebMaker.

`dot-claude/` trae el `hitos/README.md` y las cinco skills que hereda cada
proyecto: `editar-contenido`, `agregar-seccion`, `desplegar`,
`optimizar-imagenes` y `registrar-hito`.

## 2. Sustituir los marcadores

Todos tienen la forma `{{NOMBRE}}`. `npm run check` **falla** si queda alguno
sin rellenar, así que no hay riesgo de publicar con ellos a la vista.

**Sustituye solo en `index.html`, `package.json`, `vite.config.js`, `src/` y
`PROYECTO-CLAUDE.md`.** En `scripts/` y en `dot-claude/` los `{{…}}` que
aparecen son parte de la documentación y del propio verificador — salvo
`{{URL_PRODUCCION}}` en la skill `desplegar`, que sí conviene rellenar a
mano.

| Marcador | Qué es | Ejemplo |
|---|---|---|
| `{{NOMBRE}}` | Nombre completo de la organización | `CEDER SpA` |
| `{{NOMBRE_CORTO}}` | Versión corta para móvil | `CEDER` |
| `{{MONOGRAMA}}` | 2-3 letras, si no hay logo | `CD` |
| `{{LEMA}}` | Frase de marca, sin comillas (las pone el CSS) | `Ingeniería que sostiene` |
| `{{DESCRIPCION}}` | Meta description. 150-160 caracteres | — |
| `{{TITULO_SEO}}` | Lo que va tras el nombre en el `<title>` | `Consultoría en gestión` |
| `{{URL_PRODUCCION}}` | Con barra final | `https://seiler18.github.io/ceder/` |
| `{{REPO}}` | Nombre del repositorio, para el `base` de Vite | `ceder` |
| `{{SLUG}}` | `name` del package.json: minúsculas y guiones | `ceder-web` |
| `{{CORREO}}` | Buzón del formulario de contacto | — |
| `{{WHATSAPP}}` | Internacional sin signos. Vacío = sin botón | `56912345678` |
| `{{ANTETITULO}}` `{{BAJADA}}` | Portada | — |
| `{{EYEBROW_*}}` `{{TITULO_*}}` `{{SUBTITULO_*}}` | Cabeceras de sección | — |
| `{{PARRAFO_1}}` `{{PARRAFO_2}}` | Cuerpo de «Quiénes somos» | — |
| `{{SERVICIO_N}}` `{{SERVICIO_N_TEXTO}}` | Tarjetas de servicios | — |

`{{URL_PRODUCCION}}` y `{{REPO}}` tienen que cuadrar entre sí: el `base` de
`vite.config.js` debe ser la ruta de la URL. `npm run check` lo compara — es
el error más silencioso de GitHub Pages y con la comprobación ya no llega a
producción.

## 3. Ajustar el esqueleto al proyecto

La plantilla trae cuatro secciones de ejemplo (`inicio`, `nosotros`,
`servicios`, `contacto`). Lo normal es que el briefing pida otras:

- **Quitar una sección:** borra su fila de `src/site-map.js` y su archivo de
  `src/data/`. Nada más.
- **Añadir una sección:** una fila en `src/site-map.js` + un archivo de datos.
  Si encaja en `bloque` o `tarjetas`, no hace falta ningún componente nuevo.
- **Cambiar el armazón:** `site.armazon` a `'topbar'` o `'sidebar'`.

## 4. Crear las carpetas de assets

`scripts/copy-assets.js` declara `assets/img` y `assets/docs`. Créalas, aunque
sea con un `.gitkeep`: si no existen, el build avisa (no falla).

El `favicon.webp` y el `og.webp` que pide `index.html` **sí** hacen falta, o
`npm run check` los marcará como rutas rotas. Si todavía no hay imágenes,
quita esas dos líneas del `<head>` y déjalo anotado como pendiente.

## 5. Comprobar

```bash
npm install
npm run check     # debe pasar en verde
npm run build
npm run preview   # único modo que reproduce las rutas de producción
```
