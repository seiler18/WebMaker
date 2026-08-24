import { defineConfig } from 'vite'

/* `base` DEBE ser "/NOMBRE-DEL-REPO/" cuando el sitio se publica en
   https://USUARIO.github.io/NOMBRE-DEL-REPO/.

   Es el error más silencioso de GitHub Pages: con `base` mal puesto el sitio
   carga el index.html pero busca el CSS y el JS en la raíz del dominio, así
   que se ve el HTML desnudo y la consola llena de 404. `npm run check`
   compara este valor con site.url para que no llegue a producción.

   Si el sitio va en un dominio propio o en USUARIO.github.io (repo raíz),
   `base` es '/'. */
export default defineConfig({
  base: '/{{REPO}}/',
})
