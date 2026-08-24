---
name: optimizar-imagenes
description: Reducir el peso de las imágenes del sitio (convertir a WebP, redimensionar) sin perder calidad visible. Úsala cuando el usuario aporte fotos o capturas pesadas, cuando el sitio cargue lento, o al añadir cualquier imagen que venga en tamaño original de cámara, escáner o captura de pantalla.
---

# Optimizar imágenes

Una foto de celular son 4-6 MB. En el sitio no hace falta ni el 3% de eso, y
la diferencia se nota mucho en un móvil con mala señal.

## La herramienta

ImageMagick 7, instalado pero **no siempre en el PATH**:

```bash
IM="C:/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick.exe"
"$IM" -version     # comprobar antes de empezar
```

No hay conversor de PDF a imagen (`pdftoppm`, `gs`). Si hace falta la portada
de un PDF, la aporta el usuario como captura.

## El comando

```bash
"$IM" entrada.jpg -resize 1600x -quality 82 assets/img/salida.webp
```

- `-resize 1600x` → 1600px de ancho, alto proporcional. **Nunca amplía**: si
  la original es más estrecha, la deja como está.
- `-quality 82` → el punto donde WebP deja de notarse a simple vista. Por
  debajo de 75 aparecen artefactos en los degradados.

## Qué ancho usar

| Para qué | Ancho | Peso esperado |
|---|---|---|
| Foto ancha de sección | 1600px | 100-250 KB |
| Imagen a media columna (`bloque`) | 900px | 60-140 KB |
| Portada de tarjeta | 600px | 30-80 KB |
| Avatar / logo de la cabecera | 200px | 5-15 KB |
| `og:image` (al compartir) | 1200×630 | 50-120 KB |
| Favicon | 64px | 2-5 KB |

Si algo sale por encima del doble de lo esperado, casi siempre es una captura
de pantalla guardada como PNG: bájale la calidad o recórtala.

## Reglas

- **WebP siempre.** Lo soportan todos los navegadores actuales y pesa la mitad
  que un JPEG equivalente.
- **Nombres en minúsculas, sin espacios ni acentos.** GitHub Pages distingue
  mayúsculas y Windows no: `Logo Empresa.webp` funciona en local y da 404
  publicado.
- **Guarda el original.** A `tools/img-originales/`, que está en el
  `.gitignore`. Cuando haga falta otro recorte, no querrás partir del WebP ya
  comprimido.
- **Logos con transparencia:** WebP la conserva. No los pases por JPEG.
- **Un logo apaisado no se recorta.** Si la caja donde va es cuadrada, se usa
  `object-fit: contain`, no `cover`. Recortar un logo lo mutila.

## Después de añadir una imagen

```bash
npm run check     # confirma que la ruta existe de verdad
```

Y comprueba el peso total de la carpeta antes de publicar:

```bash
du -sh assets/img
```

Por encima de ~3 MB en total, hay algo que revisar.
