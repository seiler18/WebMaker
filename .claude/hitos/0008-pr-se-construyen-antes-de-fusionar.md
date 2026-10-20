# 0008 — Cada PR se construye antes de fusionarlo, y qué se excluyó de Dependabot

- **Fecha:** 2026-10-20
- **Estado:** completado
- **Continúa:** hito 0007 (Dependabot en la plantilla), cuyo «Pendiente» era este.

## Contexto
Al activar Dependabot llegó de golpe su lote inicial (unos 25 PRs). Los sitios web
no tenían CI en PRs: sus `deploy.yml` corren solo en `push` a `main` y en
`schedule`, así que no había forma de saber si un PR rompía algo antes de
fusionarlo. Y varios PRs del lote eran, directamente, inviables.

## Qué se hizo
- **`verificar-pr.yml`** en `ceder`, `Curriculo`, `seiler18.github.io`,
  `sistemas-gestion`, `VentasMaker` y `FinanzasMaker`, y en
  `plantilla/dot-github/workflows/` para los sitios nuevos. Solo construye
  (`npm ci` + `npm run build`; en las tiendas, además audit y tests), con
  `permissions: contents: read`. Es un archivo aparte a propósito: el deploy usa
  `concurrency: pages` con `cancel-in-progress`, y un PR dentro de ese grupo
  cancelaría una publicación real.
- Dependabot rebasó sus PRs sobre el workflow nuevo y todos construyeron en verde.
- **Exclusiones medidas, no supuestas** (cada una con su motivo en el
  `dependabot.yml` del repo):
  - `FinanzasMaker`, `AppManageEvents`: `embedded-postgres` 18, porque las pruebas
    deben imitar a Supabase (Postgres 17).
  - `AppManagePets`: `eclipse-temurin`/`maven` mayores (el pom fija Java 17) y
    **Spring Boot 4**, que no es una subida sino una migración: `SeguridadWebTest`
    no compila porque `AutoConfigureMockMvc` cambió de módulo.
  - `AppManageEvents`: las mismas imágenes de JDK/Maven (el pom fija Java 25).
  - `FinanzasMaker-android`: Kotlin (2.4.21 ni se resuelve), `core-ktx` 1.19 y el
    BOM de Compose 2026.09 (exigen AGP 9.1+), `googleid` 1.2 (pide un Kotlin más
    nuevo), AGP 9 y Gradle 9.8. Probado uno por uno en local con
    `-Djavax.net.ssl.trustStoreType=Windows-ROOT`. Solo `work` 2.12.0 compilaba y
    se subió a mano.

## Decisiones y alternativas descartadas
- **`pull_request` dentro de `deploy.yml`**: descartado por el `concurrency` de arriba.
- **Automerge**: sigue descartado; se fusiona a mano, con el PR en verde.
- **Dejar los PRs inviables abiertos «por si acaso»**: cada uno es ruido y un
  correo. Cerrar con la razón dicha y excluir la versión evita que vuelva.

## Consecuencias
- Un PR de Dependabot en verde en `verificar-pr` es fusionable. Verde no prueba
  la parte de publicación (`upload-pages-artifact`, `deploy-pages`,
  `actions-gh-pages`): esa se ve en el primer deploy tras fusionar.
- Subir Kotlin, AGP, Gradle y el BOM de Compose en `FinanzasMaker-android` es una
  sola tarea (migrar a AGP 9) y hay que levantar a la vez las exclusiones.
- Migrar `AppManagePets` a Spring Boot 4 también es una tarea aparte; Boot 3.5
  sigue recibiendo parches mientras tanto.

## Pendiente
- Migrar `AppManagePets` a Spring Boot 4 y `FinanzasMaker-android` a AGP 9, cuando
  se quiera.
