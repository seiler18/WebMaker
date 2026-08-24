---
name: generar-andamiaje
description: Crear el proyecto de un sitio web nuevo a partir de la plantilla de WebMaker y dejarlo compilando. Úsala después de tener el briefing y la identidad decididos, cuando haya que materializar la plantilla, sustituir los marcadores y ajustar las secciones. También si un proyecto existente necesita rehacerse sobre la plantilla.
---

# Generar el andamiaje

Convierte `plantilla/` en un proyecto real que compila. Al terminar, el sitio
existe y se puede ver; falta el contenido de verdad, que es el paso siguiente.

Entrada: `briefing.md` aprobado, con identidad decidida.
Salida: `npm run check` y `npm run build` en verde.

## 1. Copiar

```bash
cd "C:/Users/IchBi/OneDrive/Desarrollo/<PROYECTO>"
cp -r "../WebMaker/plantilla/." .
```

Y los tres renombrados obligatorios (`plantilla/_MARCADORES.md` los detalla):

```bash
mv dot-gitignore .gitignore
mv dot-github .github
mv dot-claude .claude
mv PROYECTO-CLAUDE.md CLAUDE.md
rm _MARCADORES.md
```

El prefijo `dot-` existe porque un `.gitignore` o un `.github/workflows/`
dentro de `plantilla/` afectarían al repositorio de WebMaker.

Si en la carpeta ya había documentación del cliente, muévela ahora:

```bash
mkdir -p tools && mv *.pdf *.docx tools/ 2>/dev/null
```

`tools/` está en el `.gitignore`: es material de trabajo, no se publica.

## 2. Sustituir los marcadores

Todos son `{{MAYUSCULAS}}` y están tabulados en `plantilla/_MARCADORES.md`.

**Sustituye solo en `index.html`, `package.json`, `vite.config.js` y `src/`.**
No en `scripts/` ni en `.claude/`: ahí los `{{…}}` que aparecen son parte de
la documentación y del propio verificador.

Los dos que tienen que cuadrar entre sí:

- `{{REPO}}` → el `base` de Vite queda `'/<REPO>/'`
- `{{URL_PRODUCCION}}` → `https://<usuario>.github.io/<REPO>/` (con barra final)

`npm run check` compara los dos. Es el error más silencioso de GitHub Pages:
con el `base` mal, el sitio carga el HTML y busca el CSS en la raíz del
dominio — se ve el texto desnudo y la consola llena de 404.

## 3. Ajustar las secciones al briefing

La plantilla trae cuatro de ejemplo: `inicio`, `nosotros`, `servicios`,
`contacto`. El briefing casi siempre pide otras.

**Quitar una sección:** borra su fila de `src/site-map.js` y su archivo de
`src/data/`. Nada más — el menú, el scroll-spy y el pie se ajustan solos.

**Añadir una sección:** decide primero si encaja en un bloque que ya existe.

| El contenido es… | Usa | Archivo de datos |
|---|---|---|
| Sobre todo prosa, con o sin imagen | `renderBloque` | copia `quienes-somos.js` |
| Una lista de cosas comparables | `renderTarjetas` | copia `servicios.js` |
| Formulario y datos de contacto | `renderContacto` | `contacto.js` |
| Otra cosa | ver `referencia/catalogo-secciones.md` | — |

La mayoría de secciones de un sitio corporativo son bloque o tarjetas. No
crees un componente nuevo hasta comprobar que ninguno de los dos sirve.

Fila nueva en `src/site-map.js`:

```js
{
  id: 'proyectos',
  label: 'Proyectos',
  short: 'Proyectos',          // ~8 caracteres: es la etiqueta de móvil
  icon: 'fa-solid fa-diagram-project',
  render: () => renderTarjetas(proyectos),
},
```

El `id` va en la URL y se comparte como enlace: minúsculas, sin acentos ni
espacios, y una vez publicado no se cambia.

## 4. Crear las carpetas de assets

```bash
mkdir -p assets/img assets/docs
```

`index.html` referencia `assets/img/favicon.webp` y `assets/img/og.webp`. Si
el usuario todavía no los ha aportado, tienes dos opciones honestas:

- Quitar esas dos líneas del `<head>` y anotarlo en el briefing como
  pendiente.
- Poner un placeholder y **decir que es un placeholder**.

Lo que no vale es dejar la referencia apuntando a un archivo que no existe:
`npm run check` lo marcará como error y el deploy fallará.

Si el usuario aporta imágenes pesadas, pásalas a WebP antes de meterlas
(`referencia/trampas.md` tiene el comando de ImageMagick).

## 5. Comprobar

```bash
npm install
npm run check     # tiene que pasar en verde
npm run build
```

Si `check` se queja de marcadores, es que quedó alguno: los lista por nombre.

Revisión mínima con **`preview`, no `dev`**: es el único modo que reproduce
las rutas de producción, y por tanto el único donde se ven los assets mal
referenciados.

```bash
npm run preview
```

Comprueba con `curl` que el index, el CSS, el JS y las imágenes responden 200.
Y dile al usuario que le eche un ojo: la revisión visual no la puedes hacer tú.

## 6. Primer commit

```bash
git init 2>/dev/null
git add .
git commit -m "genero el andamiaje del sitio desde la plantilla de WebMaker"
```

Todavía **no** se publica: eso es `publicar-sitio`, y conviene tener el
contenido real antes de que exista una URL que alguien pueda abrir.

## Errores que se cometen aquí

| Síntoma | Causa |
|---|---|
| `check` dice que faltan marcadores tras sustituir | Quedaron en un archivo de `src/data/` que no habías abierto |
| `check` dice que el `base` no coincide | `{{REPO}}` y `{{URL_PRODUCCION}}` se rellenaron con nombres distintos |
| El menú sale vacío | Se borraron filas de `site-map.js` pero se dejó el `import` de un componente que ya no se usa → error de módulo |
| Una sección no aparece | Su fila está en el mapa pero el `render` apunta a datos con otro `id` que el de la fila |
| El pie no enlaza una sección | Está con `enMenu: false` — es lo esperado |
