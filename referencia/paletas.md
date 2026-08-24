# Paletas

Sustituye el bloque de color de `src/styles/tokens.css` por uno de estos. Las
medidas, los nombres de las variables y todo lo demás no cambian, así que nada
se rompe.

Todas están comprobadas para que el texto principal supere 4.5:1 sobre su
fondo. Si aclaras los fondos por tu cuenta, vuelve a comprobarlo.

**Si el cliente tiene logo, la paleta sale del logo**, no de aquí. Estas son
para cuando no hay marca previa o el usuario dice «elige tú».

> **Los tokens DERIVADOS no se copian aquí, y no hay que tocarlos.**
> `--primario-tenue`, `--superficie-viva`, `--barra-fondo`,
> `--barra-fondo-opaca`, `--velo`, `--superficie-velada` y los
> `--brillo-movil*` salen con `color-mix()` de los colores de abajo, así que se
> recalculan solos al cambiar de paleta. Viven en su propio bloque de
> `tokens.css`. Si necesitas un lavado que no está, **añádelo a ese bloque con
> color-mix**: escribirlo en el componente es la trampa 16 de
> `referencia/trampas.md`, y ya costó una revisión visual.

---

## Tech Corporate (la de fábrica)

Negro azulado + azul + cyan. Técnica, actual, con brillo. Es la del sitio de
currículum del que sale la plantilla.

**Bien para:** tecnología, ingeniería, ciberseguridad, datos, perfiles TI.

```css
--bg: #0a0e1a;  --bg-2: #0d1117;  --surface: #111827;  --surface-2: #0f172a;
--primario: #2563eb;  --primario-claro: #60a5fa;  --acento: #22d3ee;
--texto: #e5e7eb;  --texto-tenue: #94a3b8;  --texto-fuerte: #ffffff;
--borde: rgba(255,255,255,0.08);      --borde-vivo: rgba(34,211,238,0.45);
--brillo: rgba(37,99,235,0.25);       --brillo-acento: rgba(34,211,238,0.45);
```

---

## Pizarra Institucional

Grises azulados profundos con un azul sobrio. Sin brillos de neón. Se lee como
un documento serio.

**Bien para:** consultoría, legal, auditoría, servicios a empresas,
licitaciones públicas.

```css
--bg: #0f1419;  --bg-2: #131a21;  --surface: #1a232c;  --surface-2: #151d25;
--primario: #3b6ea5;  --primario-claro: #7ba7d4;  --acento: #9ab8d4;
--texto: #e8eaed;  --texto-tenue: #9aa5b1;  --texto-fuerte: #ffffff;
--borde: rgba(255,255,255,0.07);      --borde-vivo: rgba(154,184,212,0.40);
--brillo: rgba(59,110,165,0.20);      --brillo-acento: rgba(154,184,212,0.25);
```

---

## Verde Territorio

Verdes profundos con acento lima. Naturaleza, terreno, sostenibilidad, sin
caer en el verde brillante de folleto.

**Bien para:** medio ambiente, agro, forestal, acuicultura, energía,
construcción sostenible.

```css
--bg: #0a1410;  --bg-2: #0d1a14;  --surface: #12241c;  --surface-2: #0f1e18;
--primario: #2d7a4f;  --primario-claro: #5cb37f;  --acento: #a3e635;
--texto: #e4ebe6;  --texto-tenue: #93a89a;  --texto-fuerte: #ffffff;
--borde: rgba(255,255,255,0.08);      --borde-vivo: rgba(163,230,53,0.40);
--brillo: rgba(45,122,79,0.25);       --brillo-acento: rgba(163,230,53,0.30);
```

---

## Cobre y Grafito

Grafito con cobre cálido. Industrial, minero, con oficio. Distintiva sin ser
estridente.

**Bien para:** minería, metalmecánica, manufactura, logística, talleres.

```css
--bg: #111112;  --bg-2: #17171a;  --surface: #1f1f23;  --surface-2: #191919;
--primario: #b45309;  --primario-claro: #f59e0b;  --acento: #fbbf24;
--texto: #eae8e6;  --texto-tenue: #a3a09c;  --texto-fuerte: #ffffff;
--borde: rgba(255,255,255,0.08);      --borde-vivo: rgba(251,191,36,0.40);
--brillo: rgba(180,83,9,0.25);        --brillo-acento: rgba(251,191,36,0.28);
```

---

## Marino Profundo

Azul marino con turquesa. Marítimo, limpio, confiable.

**Bien para:** salmonicultura, pesca, portuario, náutico, turismo costero,
salud.

```css
--bg: #071a24;  --bg-2: #0a212d;  --surface: #0f2c3a;  --surface-2: #0c2531;
--primario: #0e7490;  --primario-claro: #22a5c4;  --acento: #5eead4;
--texto: #e3edf0;  --texto-tenue: #8ea9b3;  --texto-fuerte: #ffffff;
--borde: rgba(255,255,255,0.08);      --borde-vivo: rgba(94,234,212,0.40);
--brillo: rgba(14,116,144,0.25);      --brillo-acento: rgba(94,234,212,0.30);
```

---

## Papel Claro

**La única en claro.** Fondo hueso, texto oscuro, acento azul. Se lee muy bien
y se imprime bien.

**Bien para:** educación, publicaciones, salud, cualquier sitio con mucho
texto largo. También para clientes a los que un sitio oscuro les parece poco
serio — pasa, y es un motivo legítimo.

```css
--bg: #faf9f7;  --bg-2: #f3f1ee;  --surface: #ffffff;  --surface-2: #f6f4f1;
--primario: #1d4ed8;  --primario-claro: #2563eb;  --acento: #0e7490;
--texto: #1f2933;  --texto-tenue: #52616b;  --texto-fuerte: #0b1116;
--borde: rgba(15,23,42,0.10);         --borde-vivo: rgba(14,116,144,0.45);
--brillo: rgba(29,78,216,0.12);       --brillo-acento: rgba(14,116,144,0.18);
```

> **Ojo con esta:** la plantilla está pensada en oscuro. Al cambiar a claro hay
> que revisar cuatro cosas concretas, y ninguna la detecta `npm run check`:
>
> 1. **Los halos animados de `body::before`** (`base.css`) y **las luces de
>    `.hero-fondo::before`** (`components.css`): los `--brillo-movil*` se
>    derivan del primario con alfa alta y sobre fondo hueso quedan sucios.
>    Bájalos —redefine los tres tokens derivados en el bloque de la paleta— o
>    quita las animaciones.
> 2. **Los contornos `drop-shadow` negros** de `.hero-titulo` y
>    `.section-title`: sobre fondo claro un borde negro es exactamente lo
>    contrario de lo que hace falta. Súbelos a blanco o quítalos.
> 3. **Los degradados de texto** de esos mismos títulos, que sobre blanco
>    pierden contraste.
> 4. **`--superficie-viva`**, el fondo de la ficha al pasar el puntero: se
>    calcula aclarando `--surface` con blanco, y si `--surface` ya es blanco no
>    se nota nada. En claro hay que oscurecerlo:
>    `color-mix(in srgb, var(--surface) 96%, #000000)`.
>
> Cuenta una hora de ajustes, no dos minutos.

---

## Cómo cambiar la tipografía

Dos sitios, y nada más:

1. El `<link>` de Google Fonts en `index.html`
2. `--fuente-titulos` y `--fuente-texto` en `tokens.css`

Deja siempre el respaldo del sistema (`system-ui, sans-serif`) para que el
texto se lea aunque Google Fonts no cargue.

| Combinación | Se siente |
|---|---|
| Raleway / Raleway | Limpio, técnico, neutro. La de fábrica |
| Montserrat / Open Sans | Corporativo clásico |
| Playfair Display / Lato | Con oficio, algo señorial |
| Space Grotesk / Inter | Actual, producto digital |
| Bitter / Source Sans 3 | Editorial, para mucho texto |
