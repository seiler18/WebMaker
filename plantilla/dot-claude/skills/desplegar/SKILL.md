---
name: desplegar
description: Publicar los cambios del sitio en producción (GitHub Pages) y verificar que el deploy salió bien. Úsala cuando el usuario diga "sube los cambios", "publica", "deploy", "que se vea en la web", o pregunte por qué el sitio no se actualizó.
---

# Desplegar a producción

## Cómo funciona

```
git push origin main
   └─> GitHub Actions (.github/workflows/deploy.yml)
         └─> npm ci && npm run build     (check + vite build + copy-assets)
               └─> publica dist/ en la rama gh-pages
                     └─> GitHub Pages sirve gh-pages
```

Tarda ~2 minutos. No hay nada que hacer a mano en `gh-pages`.

## Antes de subir

```bash
npm run check     # rutas, ids, marcadores, base, anclas
npm run build     # ya incluye check
```

Si `check` falla, **el deploy también fallará**: el workflow lo ejecuta igual.
Arréglalo antes de hacer push, no después de ver el Actions en rojo.

Revisión mínima con `npm run preview` (**no `dev`**): es el único modo que
reproduce las rutas de producción y donde se ven los assets mal referenciados.

- [ ] El menú marca la sección correcta al hacer scroll
- [ ] Las imágenes cargan todas
- [ ] El formulario valida y responde
- [ ] En móvil (DevTools ~390px) el menú funciona y no tapa el contenido

Esa lista **la mira el usuario**. Aquí no hay navegador automatizado: lo que
tú puedes comprobar son códigos HTTP.

## Subir

```bash
git status
git add .
git commit -m "descripción concreta del cambio"
git push origin main
```

Mensajes de commit: en español, una línea, con el **qué** concreto («agrego
sección de proyectos», no «cambios»).

## Verificar

```bash
gh run list --limit 3
gh run watch              # seguir el actual en vivo
```

Sin `gh`: GitHub → pestaña **Actions**.

Ya en verde, comprueba la URL de producción — y **no solo el index**: el fallo
clásico deja el HTML bien y el CSS en 404.

```bash
URL="{{URL_PRODUCCION}}"
curl -s -o /dev/null -w "index: %{http_code}\n" "$URL"
CSS=$(curl -s "$URL" | grep -o 'assets/index-[^"]*\.css' | head -1)
curl -s -o /dev/null -w "css:   %{http_code}\n" "$URL$CSS"
```

Con caché desactivada en el navegador (Ctrl+Shift+R): los assets llevan hash,
pero `index.html` no, y GitHub Pages lo cachea unos minutos.

## Problemas frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| `push` rechazado (*non-fast-forward*) | Hay commits en GitHub que no tienes | `git pull origin main` y volver a `push` |
| El sitio no cambia tras 5 min | El workflow falló | Actions; casi siempre es `npm run check` |
| HTML sin estilos, 404 de CSS | `base` de Vite ≠ nombre del repo | `npm run check` lo detecta. Corregir y resubir |
| Imagen rota solo en producción | Mayúsculas del nombre | Pages distingue, Windows no. Renombrar copiando de `ls` |
| Imagen rota también en local | No declarada en `copy-assets.js` | Vite no ve las rutas de los strings de HTML |
| `npm ci` falla en el runner y no en local | Falta `package-lock.json` commiteado | Añadirlo. `npm ci` lo exige |
| El formulario dice «pendiente de confirmación» | FormSubmit sin buzón validado | Normal la primera vez: aceptar el correo que llega |
| Se abre Vim al hacer `pull` | Git pide mensaje de merge | `:wq` + Enter |

## Después

Si el cambio fue relevante (no un typo), registra el hito: skill
`registrar-hito`.
