---
name: registrar-hito
description: Dejar constancia en hitos/ de un cambio relevante, sea en un sitio generado o en la propia plantilla de WebMaker. Úsala al terminar un trabajo con sustancia (sitio nuevo publicado, rediseño, sección nueva, mejora de la plantilla) o cuando el usuario pida "registra esto", "anota el hito" o pregunte "¿en qué estábamos?".
---

# Registrar un hito

Los hitos son la memoria: **qué** se hizo, **cuándo** y sobre todo **por qué**.
El `CLAUDE.md` describe cómo se trabaja hoy; los hitos, cómo se llegó hasta
aquí. No se mezclan.

## Primero: ¿de quién es el hito?

| El cambio afecta a… | Va en |
|---|---|
| Un sitio concreto (su contenido, sus secciones, su deploy) | `<PROYECTO>/.claude/hitos/` |
| La plantilla o las skills, o sea a **todos** los sitios futuros | `WebMaker/hitos/` |

Es la distinción que hace que WebMaker mejore con el uso. Si al construir un
sitio descubres que la plantilla tiene un defecto, el arreglo del sitio es
hito del sitio, y la corrección de la plantilla es hito de WebMaker. Sin eso,
el siguiente proyecto repite el error.

## Cuándo SÍ

- Un sitio nuevo publicado (siempre es el `0001` del proyecto).
- Rediseños, cambios de estructura, secciones nuevas o eliminadas.
- Decisiones técnicas con alternativas descartadas.
- Mejoras de la plantilla o de una skill.
- Tandas de contenido significativas.

## Cuándo NO

- Typos, ajustes de color, una palabra cambiada.
- Cosas que el `git log` ya cuenta igual de bien.

Si dudas: **¿le serviría esto a alguien que retome el proyecto en seis
meses?** Si no, no es un hito.

## Cómo

### 1. Siguiente número

```bash
ls <destino>/hitos/
```

Cuatro dígitos, correlativo: `0003-slug-en-kebab-case.md`. Sin acentos ni
mayúsculas en el nombre del archivo — GitHub distingue mayúsculas y el enlace
del índice se rompe (ya pasó una vez).

### 2. Escribir

Todas las secciones son obligatorias. Si una no aplica, se escribe «Ninguna»
en vez de borrarla — su ausencia también informa.

```markdown
# NNNN — Título corto y concreto

- **Fecha:** YYYY-MM-DD
- **Estado:** completado | en curso | revertido
- **Commits:** `hash`  (o "pendiente de commit")

## Contexto
Qué situación había antes y qué problema concreto tenía.

## Qué se hizo
Lista de cambios reales, con rutas de archivos.

## Decisiones y alternativas descartadas
Lo más valioso del hito. Qué se eligió, contra qué, y por qué.

## Consecuencias
Qué cambia para quien trabaje en esto a partir de ahora: reglas nuevas, rutas
que se movieron, cosas que ya no se hacen.

## Pendiente
Lo que quedó fuera a propósito.
```

En español, en pasado, concreto. **Fechas absolutas** (`2026-08-23`), nunca
relativas: «la semana pasada» no significa nada leído en marzo.

La sección que de verdad importa es **Decisiones y alternativas descartadas**.
«Se usó una rejilla» no vale; «se usó una rejilla en vez de un carrusel
porque el carrusel costó tres hitos de arreglos de alto y de flechas que
tapaban botones» sí.

### 3. Actualizar el índice

Una línea en `<destino>/hitos/README.md`, **la más reciente arriba**:

```markdown
| [0003](0003-slug.md) | 2026-08-23 | Título corto | completado |
```

Comprueba que el nombre del archivo del enlace es **exacto**. Si el título
lleva acentos y el archivo no, no los metas en el enlace.

### 4. ¿Toca actualizar el CLAUDE.md?

Si el hito cambió **cómo se trabaja** —una regla nueva, una carpeta nueva, un
comando nuevo—, actualiza también el `CLAUDE.md` correspondiente. Ese es el
reparto: el hito narra el cambio, el `CLAUDE.md` refleja el estado actual.

Y si cambió un procedimiento repetible, actualiza la skill. Una skill que
enseña algo que ya no es verdad hace más daño que no tenerla.
