# Seguridad de un sitio estático

Qué se puede endurecer en un sitio que no tiene servidor, y por qué merece la
pena hacerlo aunque «sea solo una web informativa».

Se lee por ruta, no se invoca. Lo que aquí se describe **ya viene puesto en
`plantilla/`**: este archivo explica el porqué y qué hacer cuando haya que
tocarlo.

---

## Por qué este archivo existe

Un sitio de WebMaker no tiene base de datos, ni sesión, ni panel de
administración. La tentación es concluir que no hay nada que proteger. Lo que
sí hay:

- **La reputación de quien firma el sitio.** Si el CDN del que cuelga una
  librería sirve código distinto un martes, lo sirve *tu* dominio, con tu
  logotipo encima.
- **El visitante.** Una pestaña abierta sin `rel="noopener"` puede redirigir
  la pestaña de origen. El visitante vuelve creyendo que sigue en tu sitio.
- **El repositorio.** Un token de Actions que se queda escrito en el
  `.git/config` del runner lo puede leer el script de instalación de
  cualquier dependencia.

Ninguna de las tres se ve. El sitio funciona igual de bien con las tres mal, y
por eso las tres están en `npm run check` (puntos 13 a 16): una regla que no
se comprueba es una intención.

---

## 1 · Integridad de lo que viene de fuera

Todo `<script src="https://…">` y todo `<link rel="stylesheet">` externo lleva
`integrity` + `crossorigin="anonymous"`. Si el archivo servido no coincide con
el hash, el navegador **lo descarta** en vez de ejecutarlo.

```bash
curl -s "<url>" | openssl dgst -sha384 -binary | openssl base64 -A
```

Se exime únicamente lo que sirve contenido **variable**, que por definición no
tiene un hash estable:

| Dominio | Por qué |
|---|---|
| `fonts.googleapis.com` | devuelve un CSS distinto según el navegador que pregunta |
| `kit.fontawesome.com` | es un loader generado por cuenta, cambia al tocar el kit |

Regla práctica: **si puedes fijar la versión en la URL, puedes fijar el
hash.** Si la URL no lleva versión, desconfía de meterla en el sitio.

---

## 2 · Content-Security-Policy en `<meta>`

GitHub Pages no deja poner cabeceras HTTP, así que la política va en un
`<meta http-equiv>`. Es menos potente que la cabecera, pero corta lo que
importa: **de dónde puede venir el código**.

La de la plantilla, en una línea:

```
default-src 'self'; base-uri 'self'; object-src 'none';
script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
style-src  'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;
font-src   'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
img-src    'self' data:;
connect-src 'self' https://formsubmit.co;
form-action 'self' https://formsubmit.co;
upgrade-insecure-requests
```

**Tres cosas que hay que saber antes de tocarla:**

1. **`frame-ancestors` y `X-Frame-Options` se ignoran en `<meta>`.** Solo
   valen como cabecera. No los pongas creyendo que impiden que te metan en un
   iframe: no lo hacen.

2. **`'unsafe-inline'` en `style-src` es obligatorio** mientras los
   componentes escriban `style="--i:3"` para el escalonado. En `script-src`
   está por el polyfill de módulos que Vite puede insertar; si tu sitio no lo
   necesita —compruébalo con `npm run preview` y la consola abierta— quítalo,
   que es donde la política gana de verdad.

3. **Un dominio que falta se bloquea EN SILENCIO.** El widget no sale y no
   pasa nada más. La única señal es una línea en la consola. Por eso, al
   añadir cualquier servicio externo: `npm run preview`, consola abierta, y la
   consola limpia cuenta como parte de la verificación igual que el código
   HTTP. Es así como se descubrió que el traductor de Google no solo usa
   `translate.google.com`, sino también `translate-pa.googleapis.com`.

### Qué directiva toca a cada cosa

| Lo que añades | Directiva |
|---|---|
| Una librería JS de un CDN | `script-src` |
| Una hoja de estilos o una tipografía | `style-src` + `font-src` |
| Un mapa, un vídeo o un formulario incrustado | `frame-src` |
| Una llamada `fetch`/XHR a una API | `connect-src` |
| Imágenes de otro dominio | `img-src` |
| Un `<form action>` que sale fuera | `form-action` |

---

## 3 · Enlaces que salen del sitio

Todo `target="_blank"` lleva `rel="noopener noreferrer"`. `noopener` corta el
acceso a `window.opener` (tabnabbing); `noreferrer` evita además mandar la URL
completa de origen.

A nivel de documento, `<meta name="referrer" content="strict-origin-when-cross-origin">`
hace que al salir a cualquier sitio externo se mande solo el origen y nunca la
ruta completa.

---

## 4 · Nada de código en los atributos

Ni `onclick=""` ni `href="javascript:"`. Dos motivos, y el segundo es el que
manda:

1. Mezcla conducta con markup, que es lo que separa esta plantilla.
2. **La CSP los bloquea.** Funcionarían en local y morirían en silencio en
   producción, que es la peor forma posible de que algo falle.

La conducta va en un módulo de `src/lib/` con `addEventListener`.

---

## 5 · El workflow de despliegue

```yaml
permissions:
  contents: read        # a nivel de workflow: lo que no se declara, no se hereda

jobs:
  deploy:
    permissions:
      contents: write   # solo el job que publica

    steps:
      - uses: actions/checkout@v4
        with:
          persist-credentials: false   # el token no se queda en .git/config
      - run: npm ci                    # no `npm install`
```

- **`npm ci` y no `npm install`.** `ci` instala exactamente lo que fija el
  `package-lock.json`. Con `install`, una dependencia transitiva puede subir
  de versión sola entre dos deploys y publicar algo que nunca se probó.
- **`persist-credentials: false`.** Por defecto, `checkout` deja el token de
  Actions escrito en `.git/config` del runner, legible por cualquier paso
  posterior — el script de instalación de una dependencia incluido. El paso de
  publicar recibe el token explícitamente, así que ahí no hace falta.

---

## 6 · Credenciales

Ninguna, nunca, en el repositorio. Un sitio de GitHub Pages se sirve **en
claro**: una clave escrita en un `.js` la lee cualquiera con Ctrl+U.

Si un sitio necesita una clave:

- o va detrás de un backend propio (y entonces la clave vive en la variable de
  entorno del proveedor, con `sync: false` en Render o como secreto de
  Actions),
- o la sección se queda en modo demostración con datos locales y se dice que
  lo es.

Ver también `trampas.md`, punto 12.

---

## Verificación antes de publicar

```bash
npm run check      # puntos 13 a 16: noopener, integrity, inline, JSON-LD
npm run build
npm run preview    # y CON LA CONSOLA ABIERTA: ni un bloqueo de CSP
```

Y sobre el sitio ya publicado:

```bash
URL="https://usuario.github.io/repo/"
curl -s -o /dev/null -w "%{http_code}\n" "$URL"
curl -sI "$URL" | grep -i "content-type\|cache"
curl -s "$URL" | grep -o 'integrity="[^"]*"' | wc -l   # debe ser > 0
```

Lo que **no** se puede verificar desde aquí es el aspecto: eso lo mira el
usuario. Si no tienes su visto bueno, dilo en vez de darlo por bueno.
