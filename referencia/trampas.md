# Trampas conocidas

Errores ya cometidos, con su causa y su arreglo. Destilado de los catorce
hitos del sitio de currículum. Cada uno costó al menos una tarde.

Ordenados por lo que más veces ha roto un sitio.

---

## 1. El `base` de Vite no coincide con el nombre del repo

**Síntoma:** el sitio publicado carga el texto pero sin estilos, y la consola
está llena de 404 de CSS y JS.

**Causa:** GitHub Pages sirve en `usuario.github.io/REPO/`, así que los assets
están bajo `/REPO/`. Con `base: '/'` el HTML los busca en la raíz del dominio.

**Arreglo:** `base: '/REPO/'` en `vite.config.js`, exactamente igual al nombre
del repositorio. `npm run check` lo compara con `site.url` y falla si no
cuadran, así que ya no puede llegar a producción.

---

## 2. Nombres de archivo con mayúsculas

**Síntoma:** una imagen se ve perfecta en local y da 404 publicada.

**Causa:** GitHub Pages (Linux) distingue mayúsculas. Windows no. `Logo.webp`
y `logo.webp` son el mismo archivo en tu máquina y dos distintos en producción.

**Arreglo:** copiar el nombre con `ls`, nunca de memoria. Y por costumbre,
nombres en minúsculas y sin espacios ni acentos.

---

## 3. Assets que Vite no ve

**Síntoma:** una imagen no aparece ni en `preview` ni publicada, aunque el
archivo existe.

**Causa:** Vite procesa (y hashea) **solo** lo que se importa desde
`main.js`: los CSS y las imágenes referenciadas *dentro* de esos CSS. Las
rutas que van en strings de HTML, los PDFs y las páginas estáticas sueltas no
las ve.

**Arreglo:** declararlas en `scripts/copy-assets.js`, que las copia al `dist/`
después del build. Es el único sitio que lo sabe.

---

## 4. `transform`, `filter` o `isolation` en el contenedor de un modal

**Síntoma:** el modal se abre por debajo de la barra de navegación.

**Causa:** cualquiera de los tres crea un **contexto de apilamiento**. El
modal, aunque tenga un `z-index` altísimo, solo compite dentro de ese
contexto, y el contexto entero queda por debajo de la barra.

**Arreglo en la plantilla:** el modal usa `<dialog>` y `modal.js` lo mueve al
final de `<body>` al abrirlo, así que no hay ancestro que pueda atraparlo. Si
vuelves a un modal normal, la regla es: nada de esas tres propiedades en el
contenedor del contenido.

---

## 5. Un `<a>` suelto dentro de un `<p>` para una fila de botones

**Síntoma:** en móvil, al envolver, las pastillas se solapan.

**Causa:** un elemento inline no reserva alto para su `padding`. El `<p>` se
dimensiona por el texto y los botones se pisan entre líneas.

**Arreglo:** un contenedor flex con `gap` (`.hero-acciones`,
`.contacto-acciones`). Nunca `<a>` sueltos en un párrafo.

---

## 6. Un aviso o pop-up que se recuerda «para siempre»

**Síntoma:** el aviso funcionaba, y de un día para otro dejó de salir.

**Causa:** se marcó como visto en `localStorage` sin caducidad, y uno de los
disparadores era llegar por scroll a la sección. Con visitar el sitio una vez
y bajar hasta abajo, desaparecía para siempre. Parece roto y no lo está.

**Arreglo:** guardar la **fecha**, no un `'1'`, y caducar el recuerdo (30 días
va bien). Ventaja añadida: el `'1'` de la versión vieja da `NaN`, se ignora y
el aviso vuelve solo sin que nadie borre nada.

---

## 7. `localStorage` sin `try/catch`

**Síntoma:** la página entera se queda en blanco en ventana privada o con las
cookies de sitio bloqueadas.

**Causa:** en esos modos `localStorage` **lanza al tocarlo**, no devuelve
`null`. Si la excepción sube, mata el script.

**Arreglo:** envolver cada lectura y cada escritura. Sin almacenamiento, el
peor caso es que el sitio no recuerde algo — mucho menos grave que no cargar.

---

## 8. Una transición que no se dispara tras cambiar `display`

**Síntoma:** el elemento aparece de golpe en vez de animarse.

**Causa:** acaba de pasar de `display: none` a visible. El navegador puede
agrupar ese cambio con el de la clase en el mismo fotograma, y sin estado
inicial no hay nada que interpolar.

**Arreglo:** forzar un reflow leyendo una propiedad de layout entre los dos
cambios: `void el.offsetHeight`. Y dejar el comentario, porque parece una
línea inútil y alguien la borrará.

---

## 9. Carruseles

**Síntoma:** el alto del panel salta entre diapositivas y arrastra el resto de
la página; las flechas se comen el clic del botón que hay debajo; en móvil las
tarjetas se apilan y la maqueta se descuadra.

**Causa:** un carrusel tiene que reconciliar contenidos de alturas distintas
en un contenedor de altura fija, y sus controles flotan sobre el contenido.
Tres hitos de arreglos en el sitio original, y aún así hubo que rehacerlo.

**Arreglo en la plantilla:** **no hay carrusel.** Una rejilla `auto-fill`
enseña todo, se apila sola en móvil, no tiene alto que igualar y no tapa nada.
Si el contenido no cabe, la respuesta es **filtrar**, no esconder detrás de
flechas.

---

## 10. `responsive.css` en cualquier otro sitio del orden de imports

**Síntoma:** los ajustes de móvil no se aplican y hay que ir poniendo
`!important`.

**Causa:** con la misma especificidad gana el último de la cascada. Si
`responsive.css` va antes que `components.css`, los estilos de escritorio lo
sobrescriben.

**Arreglo:** el último de la lista en `main.js`. Si algún día necesitas un
`!important` en un ajuste responsive, casi seguro es que se movió de sitio.

---

## 11. Colores literales fuera de `tokens.css`

**Síntoma:** cambiar la identidad del sitio es una cacería por todo el CSS y
siempre queda un azul viejo en algún borde.

**Arreglo:** todo color es un token. Si hace falta un tono que no está, se
añade con nombre y se usa por nombre.

---

## 12. Credenciales en el proyecto

**Síntoma:** cualquiera lee la clave con «ver código fuente».

**Causa:** GitHub Pages sirve todo en claro, y Vite compila `src/` a un `.js`
público. No hay «archivo de configuración privado».

**Arreglo:** nada de claves. El formulario usa FormSubmit precisamente porque
no necesita ninguna. Si una función pide credenciales, o va detrás de un
backend propio o el sitio se queda sin esa función.

---

## 13. Documentos del cliente dentro de la carpeta que se publica

**Síntoma:** los estatutos con RUT y domicilio de los socios quedan
descargables desde internet.

**Causa:** se dejaron en la raíz del proyecto y algo los copió al `dist/`.

**Arreglo:** los documentos fuente van a `tools/`, que está en el
`.gitignore`. Publicar uno es una decisión explícita: se copia a
`assets/docs/` y se declara en `copy-assets.js`.

---

## 14. Iconos con el prefijo de Font Awesome 5 en la 6

**Síntoma:** en vez del icono sale un cuadrado vacío o nada.

**Causa:** la 5 usa `fas fa-home`; la 6, `fa-solid fa-house`. Algunos nombres
también cambiaron (`fa-home` → `fa-house`).

**Arreglo:** la plantilla carga la 6. Prefijos `fa-solid` / `fa-regular` /
`fa-brands`. Si copias una clase de un ejemplo viejo, compruébala.

---

## 15. Dar por buena la revisión visual

**Síntoma:** se afirma que el sitio se ve bien y el usuario abre el celular y
no.

**Causa:** aquí no hay navegador automatizado. `npm run check`, `npm run
build` y códigos HTTP sobre `npm run preview` prueban que **funciona**, no que
**se ve bien**.

**Arreglo:** pedir la pasada visual y decir explícitamente qué se comprobó y
qué no. Es la diferencia entre un informe útil y uno que hay que verificar
igual.

---

## Comandos útiles

**Pasar imágenes a WebP** (ImageMagick 7, no siempre en el PATH):

```bash
IM="C:/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick.exe"
"$IM" original.png -resize 1600x -quality 82 assets/img/imagen.webp
```

Anchos que van bien: 1600px para una foto ancha, 800px para media columna,
200px para un avatar, 400px para el `og:image` (mínimo 1200×630 si quieres que
se vea grande al compartir).

**Comprobar qué se publicó de verdad:**

```bash
URL="https://usuario.github.io/repo/"
curl -s -o /dev/null -w "%{http_code}\n" "$URL"
curl -s "$URL" | grep -c "{{"      # 0 = sin marcadores olvidados
```
