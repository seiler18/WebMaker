# 0007 — Dependabot en la plantilla y en los proyectos

- **Fecha:** 2026-10-20
- **Estado:** completado
- **Origen:** el deploy programado de VentasMaker falló por un aviso nuevo de
  `npm audit` sin que nadie hubiera tocado el código (hito 0009 de VentasMaker).
  FinanzasMaker tenía la misma vulnerabilidad sin enterarse. Jesús pidió incluir
  Dependabot donde fuera una buena idea.

## Contexto
Los proyectos solo se enteraban de una dependencia vulnerable cuando el build
fallaba, y en los que no tienen despliegue programado ni eso: el fallo esperaba al
siguiente push. Las alertas de Dependabot estaban apagadas en casi todos los repos;
solo `regenera-market` tenía un `dependabot.yml` y `Curriculo` las alertas.

## Qué se hizo
- `plantilla/dot-github/dependabot.yml`: npm semanal (menores y parches en un solo
  PR, mayores aparte) y github-actions mensual. `generar-andamiaje` ya copia
  `dot-github` entero, así que cada sitio nuevo nace con él sin tocar la skill.
- El mismo archivo, en cada proyecto que ya existía con npm: `ceder`, `Curriculo`,
  `FinanzasMaker`, `seiler18.github.io`, `sistemas-gestion` y `VentasMaker`.
- Variantes por ecosistema: `AppManageEvents` y `AppManagePets` (Maven + imágenes
  Docker), `FinanzasMaker-android` (Gradle + Actions).
- En los repos de arriba se activaron las alertas y las actualizaciones de
  seguridad en Settings → Code security.
- Quedaron fuera: `gestor-acciones` (archivado), `OPCIONES` (sin dependencias) y
  `regenera-market` (compartido, ya lo tenía con su propia política).

## Decisiones y alternativas descartadas
- **Un PR por dependencia**: cada PR manda un correo; con dos o tres dependencias
  por sitio y una semana mala serían decenas. Se agrupan menores y parches.
- **Automerge**: descartado. Un PR de dependencias cambia lo que se publica, y
  aquí la revisión de lo publicado la hace el usuario.
- **Diario en vez de semanal**: las actualizaciones de *seguridad* no esperan al
  calendario (las dispara la alerta); el calendario solo gobierna las de versión.

## Consecuencias
- **Los PRs de los sitios web no pasan por ningún CI**: sus `deploy.yml` corren solo
  en `push` a `main` y en `schedule`. Antes de fusionar un PR de Dependabot hay que
  correr `npm run build` en local. Hacer que el build corra también en
  `pull_request` exige separar el deploy (y mirar el `concurrency` con
  `cancel-in-progress`, que haría que un PR cancelara un deploy real).
  `AppManageEvents` y `FinanzasMaker-android` sí validan PRs.
- Dependabot escribe sus commits en inglés («Bump vite from…»); el `prefix` solo
  añade `deps:` o `ci:`. Es la única excepción a «commits en español».

## Pendiente
- Decidir si los sitios web ganan un build en PR (ver arriba).
