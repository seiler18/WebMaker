---
name: recopilar-briefing
description: Reunir la información necesaria para construir un sitio web y dejarla escrita en un briefing.md aprobado por el usuario. Úsala ANTES de escribir cualquier código de un sitio nuevo, cuando el usuario diga "hazme la web de X", aporte documentos de una empresa o proyecto, o cuando haya que replantear un sitio existente porque cambió el contenido.
---

# Recopilar el briefing

Es el **preagente**: el paso que convierte «hazme una web» en algo
construible. Su único producto es `<PROYECTO>/briefing.md`, y es el contrato
del que leen todas las skills siguientes.

## Por qué existe

Un sitio construido a base de suposiciones se rehace entero en cuanto aparece
el primer dato real: el nombre legal no era ese, los servicios son cinco y no
tres, el logo tiene fondo blanco. Uno construido desde un briefing se ajusta.

## Regla de oro: primero leer, después preguntar

**Nunca preguntes lo que ya está en un documento que te dieron.** Es la forma
más rápida de que el usuario pierda la confianza en el proceso.

```bash
ls -la <PROYECTO>/          # qué material hay
```

Lee TODO lo que haya antes de abrir la boca:

| Material | Qué se saca casi siempre |
|---|---|
| Estatutos / escritura de constitución | Razón social exacta, giro, objeto social, socios, domicilio, fecha |
| Presentación comercial | Servicios, propuesta de valor, clientes, cifras |
| Perfil de LinkedIn / Instagram | Tono, servicios reales, fotos utilizables |
| Web anterior | Qué conservar, qué se quedó viejo, textos reciclables |
| Logo / manual de marca | Colores, tipografía, monograma |
| Tarjeta de presentación | Correo, teléfono, cargo, dirección |

Para un PDF, usa la herramienta de lectura con rangos de páginas. Los
estatutos suelen tener el objeto social en las primeras 3-4 páginas y el
domicilio y los representantes al final.

Anota de dónde sacaste cada dato. En el briefing, un dato tomado de un
documento se marca con su fuente; uno que te dijo el usuario, también. Los que
te inventaste no existen: si algo no lo sabes, va como **`[PENDIENTE]`**.

## Preguntar lo que falta

Solo lo que no está en el material y **cambia lo que vas a construir**. Usa
preguntas de opción múltiple en tandas, no un interrogatorio de veinte
turnos. Cuatro preguntas por tanda como máximo.

El orden importa: primero lo que decide la estructura, después el detalle.

### Tanda 1 — Estructura (imprescindible)

1. **Objetivo del sitio.** ¿Qué tiene que hacer el visitante? *Que llame /
   que entienda qué hacen / que vea el catálogo / que confíe antes de una
   reunión.* Esto decide qué sección va primero y qué botón es el primario.
2. **Secciones.** Ofrece un conjunto derivado de lo que leíste, no una lista
   genérica. Deja que quite y añada.
3. **Público.** Empresas, particulares, licitaciones públicas. Cambia el tono
   y el nivel de detalle técnico.
4. **Dónde se publica.** Repositorio de GitHub Pages (nombre exacto),
   dominio propio, o todavía no se sabe.

### Tanda 2 — Identidad

Va en `definir-identidad`, pero si el usuario ya tiene logo o colores de
marca, captúralos aquí para no volver a preguntar.

### Tanda 3 — Contacto y cierre

Correo del formulario, WhatsApp, teléfono, dirección, redes. Aquí es
importante avisar de una cosa concreta: **FormSubmit exige confirmar el buzón
la primera vez**, y hasta que se confirme el formulario responde «pendiente».
Mejor decirlo ahora que cuando parezca que está roto.

## Lo que hay que dejar cerrado sí o sí

Sin estos cinco no se puede generar el andamiaje:

- Nombre exacto (y nombre corto para móvil)
- Qué hace la organización, en una frase
- Lista de secciones, en orden
- Correo de contacto
- Nombre del repositorio / URL de producción

Todo lo demás puede quedar `[PENDIENTE]` y rellenarse después. El andamiaje
falla en `npm run check` mientras queden marcadores, así que no hay riesgo de
publicar con huecos.

## Escribir el briefing

`<PROYECTO>/briefing.md`. Se versiona con el proyecto: es documentación, no un
borrador desechable.

```markdown
# Briefing — <NOMBRE>

- **Fecha:** YYYY-MM-DD
- **Estado:** borrador | aprobado por el usuario
- **Fuentes:** `Estatutos empresa.pdf`, conversación del YYYY-MM-DD

## Qué es esto
Dos o tres frases. Qué hace la organización, para quién, dónde.

## Objetivo del sitio
Qué tiene que conseguir. Y la acción principal del visitante.

## Público
A quién le habla y en qué tono.

## Identidad
| Campo | Valor | Fuente |
|---|---|---|
| Nombre completo | | |
| Nombre corto | | |
| Monograma | | |
| Lema | | |
| Logo | ruta o `[PENDIENTE]` | |
| Armazón | topbar / sidebar | |
| Paleta | nombre de referencia/paletas.md | |

## Secciones
En orden. Una tabla por sección, con su tipo de bloque:

| # | Id | Título | Tipo | Contenido |
|---|---|---|---|---|
| 1 | inicio | — | hero | Antetítulo, bajada, 2 botones, cifras |
| 2 | nosotros | Quiénes somos | bloque | 2 párrafos + misión/visión |
| 3 | servicios | Servicios | tarjetas | 5 servicios con icono |
| 4 | contacto | Contacto | contacto | Formulario + datos |

## Contenido por sección
El texto real, ya redactado o marcado `[PENDIENTE]`. Es lo que se copia a
`src/data/`: si está aquí bien escrito, construir el sitio es mecánico.

## Contacto
Correo del formulario, WhatsApp, teléfono, dirección, redes.

## Publicación
Repositorio, URL de producción, dominio propio si lo hay.

## Assets que faltan
Lista concreta de lo que tiene que aportar el usuario: logo en PNG con fondo
transparente, foto de portada, favicon. Con el tamaño mínimo útil.

## Fuera de alcance
Lo que se decidió NO hacer, y por qué. Evita la conversación de «¿y el blog?»
tres semanas después.
```

## Cerrar

Enséñale el briefing al usuario y pide que lo confirme. Dos motivos: es más
barato corregir una tabla que un sitio, y a partir de aquí todo lo que se
construya se justifica señalando el briefing.

Cuando lo apruebe, cambia el `Estado` a `aprobado por el usuario` con la
fecha, y sigue con `definir-identidad`.

> Si el usuario dice «da igual, hazlo como veas», no te lo tomes como permiso
> para inventar datos de la empresa. Sí es permiso para decidir lo
> **estético** (paleta, armazón, orden de secciones). Los hechos —nombre,
> servicios, cifras, dirección— se piden o van `[PENDIENTE]`.
