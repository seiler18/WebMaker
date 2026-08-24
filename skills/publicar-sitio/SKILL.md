---
name: publicar-sitio
description: Publicar por primera vez en GitHub Pages un sitio generado con WebMaker, creando el repositorio y verificando que quedó vivo. Úsala cuando el sitio ya tenga contenido y el usuario quiera "subirlo", "publicarlo" o "que se vea en internet", o cuando un deploy haya fallado y haya que diagnosticarlo.
---

# Publicar el sitio

Convierte el proyecto local en una URL que funciona. Solo la **primera vez**
tiene trabajo; después, publicar es `git push` y la skill `desplegar` del
propio proyecto.

## Antes de tocar nada

```bash
npm run check     # rutas, ids, marcadores, base, anclas
npm run build     # incluye check
```

Si `check` falla, **el deploy también fallará**: va dentro de `npm run build`
y el workflow lo ejecuta igual. Arréglalo aquí, no después de ver el Actions
en rojo.

Y confirma que el usuario ya hizo la revisión visual. Publicar es lo primero
que otra gente puede ver: no es el momento de descubrir que el logo está
estirado.

## 1. Crear el repositorio

El nombre tiene que ser **exactamente** el `{{REPO}}` que se usó en el `base`
de `vite.config.js`. Si no coincide, el sitio carga sin estilos.

```bash
cd "C:/Users/IchBi/OneDrive/Desarrollo/<PROYECTO>"
gh repo create <REPO> --public --source=. --remote=origin --description "Sitio web de <NOMBRE>"
```

Comprueba que la autoría de los commits es la correcta antes de empujar:

```bash
git log --format='%an <%ae>' -1
```

## 2. Primer push

```bash
git add .
git commit -m "publico el sitio de <NOMBRE>"
git branch -M main
git push -u origin main
```

El workflow (`.github/workflows/deploy.yml`) arranca solo: `npm ci`,
`npm run build`, y publica `dist/` en la rama `gh-pages`.

## 3. Activar Pages

La primera vez hay que decirle a GitHub que sirva `gh-pages`. El workflow crea
la rama, pero no la activa.

```bash
gh api -X POST repos/:owner/<REPO>/pages -f source[branch]=gh-pages -f source[path]=/ 2>&1
```

Si responde que ya existe, mejor. Si falla, se hace a mano: **Settings →
Pages → Source: Deploy from a branch → `gh-pages` / `/ (root)`**.

## 4. Verificar

```bash
gh run list --limit 3      # el workflow tiene que estar en success
gh run watch               # seguirlo en vivo si está corriendo
```

Ya en verde, comprueba **la URL de producción, no solo el index**: el fallo
clásico deja el HTML sirviendo bien y el CSS en 404.

```bash
URL="https://<usuario>.github.io/<REPO>/"
curl -s -o /dev/null -w "index: %{http_code}\n" "$URL"
CSS=$(curl -s "$URL" | grep -o 'assets/index-[^"]*\.css' | head -1)
curl -s -o /dev/null -w "css:   %{http_code}\n" "$URL$CSS"
curl -s "$URL" | grep -c "{{"     # 0 = no quedaron marcadores
```

El primer deploy puede tardar unos minutos en propagarse; un 404 recién
publicado no siempre es un error. Reintenta antes de diagnosticar.

Comprueba también con caché desactivada (Ctrl+Shift+R): los assets llevan
hash, pero `index.html` no, y GitHub Pages lo cachea unos minutos.

## 5. Cerrar el círculo

- Anota la URL real en `briefing.md` y en el `CLAUDE.md` del proyecto.
- **Confirma el buzón de FormSubmit**: manda un mensaje desde el formulario ya
  publicado y acepta el correo que llega. Hasta hacerlo, el formulario
  responde «pendiente de confirmación». Es el paso que más veces se olvida y
  el que hace que parezca que el sitio está roto.
- Registra el hito `0001` del proyecto (`skills/registrar-hito`).

## Cuando algo va mal

| Síntoma | Causa | Solución |
|---|---|---|
| HTML sin estilos, 404 de CSS y JS | `base` de Vite ≠ nombre del repo | Corregir `base`, `npm run check`, volver a subir |
| 404 en toda la URL tras 10 min | Pages no está activado o apunta a la rama equivocada | Settings → Pages → `gh-pages` / root |
| Actions en rojo | Casi siempre `npm run check` | `gh run view --log-failed` |
| `npm ci` falla en el runner y en local no | `package-lock.json` no está commiteado | Añadirlo. `npm ci` lo exige |
| Imagen que se ve en local y no publicada | Mayúsculas del nombre | Pages distingue, Windows no. Renombrar copiando de `ls` |
| Imagen que no se ve en ningún sitio | No declarada en `scripts/copy-assets.js` | Vite no ve las rutas de los strings de HTML |
| `push` rechazado (*non-fast-forward*) | Hay commits en GitHub que no tienes | `git pull origin main` y volver a empujar |

## Después

El proyecto ya se gobierna solo: tiene su `CLAUDE.md` y sus
`.claude/skills/`. Para los cambios siguientes se trabaja **dentro del
proyecto**, con su skill `desplegar`. WebMaker solo vuelve para el siguiente
sitio.
