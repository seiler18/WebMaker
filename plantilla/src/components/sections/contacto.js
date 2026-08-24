import { seccion } from '../seccion.js'
import { contacto, endpointCorreo, enlaceWhatsapp } from '../../data/contacto.js'

/* ============================================================
   CONTACTO — formulario con dos salidas

     · «Enviar por correo»   → POST al endpoint AJAX de FormSubmit, que
                               reenvía el mensaje al buzón configurado. No
                               saca al visitante de la página.
     · «Enviar por WhatsApp» → arma un enlace wa.me con el texto ya escrito.
                               No pasa por ningún servicio de terceros.

   NO HAY BACKEND, y es a propósito: el sitio se publica en GitHub Pages, que
   solo sirve archivos. Cualquier clave que se escribiera aquí la leería
   cualquiera con «ver código fuente». FormSubmit funciona precisamente
   porque no necesita credenciales: la primera vez manda un correo de
   confirmación al buzón y a partir de ahí acepta envíos.

   La validación es la del navegador (`required`, `type="email"`) más una
   comprobación explícita antes de enviar.
   ============================================================ */

export function renderContacto() {
  const opciones = contacto.motivos.map(m => `<option value="${m}">${m}</option>`).join('')

  const canales = contacto.canales
    .map(
      c => `
      <li>
        <i class="${c.icon}" aria-hidden="true"></i>
        <div>
          <span class="canal-etiqueta">${c.label}</span>
          ${c.href ? `<a href="${c.href}">${c.valor}</a>` : `<span>${c.valor}</span>`}
        </div>
      </li>
    `
    )
    .join('')

  const contenido = `
    <div class="contacto-columnas" data-anim-secuencia>
      <form class="contacto-form" id="formContacto" novalidate data-anim="subir">
        <div class="contacto-grid">
          <div class="campo">
            <label for="cf-nombre">Nombre</label>
            <input type="text" id="cf-nombre" name="nombre" required maxlength="80"
                   autocomplete="name" placeholder="Cómo te llamas">
          </div>
          <div class="campo">
            <label for="cf-correo">Tu correo</label>
            <input type="email" id="cf-correo" name="correo" required maxlength="120"
                   autocomplete="email" placeholder="para poder responderte">
          </div>
          <div class="campo campo-ancho">
            <label for="cf-motivo">Motivo</label>
            <select id="cf-motivo" name="motivo">${opciones}</select>
          </div>
          <div class="campo campo-ancho">
            <label for="cf-mensaje">Mensaje</label>
            <textarea id="cf-mensaje" name="mensaje" required maxlength="1500" rows="5"
                      placeholder="Cuéntanos qué necesitas"></textarea>
          </div>
        </div>

        <!-- Trampa para bots: FormSubmit descarta el envío si llega rellena.
             Un humano no la ve, así que siempre llega vacía. -->
        <input type="text" name="_honey" class="campo-trampa" tabindex="-1"
               autocomplete="off" aria-hidden="true">

        <div class="contacto-acciones">
          <button type="submit" class="btn primario" id="btnCorreo">
            <i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Enviar por correo
          </button>
          ${
            enlaceWhatsapp
              ? `<button type="button" class="btn fantasma" id="btnWhatsapp">
                   <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Enviar por WhatsApp
                 </button>`
              : ''
          }
        </div>

        <!-- aria-live: quien use lector de pantalla oye el resultado sin
             tener que ir a buscarlo. -->
        <p class="contacto-aviso" id="avisoContacto" role="status" aria-live="polite"></p>
      </form>

      <aside class="contacto-datos" data-anim="subir">
        <h3>Dónde encontrarnos</h3>
        <ul class="canales">${canales}</ul>
      </aside>
    </div>
  `

  return seccion({
    id: 'contacto',
    eyebrow: contacto.eyebrow,
    titulo: contacto.titulo,
    subtitulo: contacto.subtitulo,
    contenido,
  })
}

export function initContacto() {
  const form = document.getElementById('formContacto')
  if (!form) return

  const aviso = document.getElementById('avisoContacto')
  const btnCorreo = document.getElementById('btnCorreo')
  const btnWhatsapp = document.getElementById('btnWhatsapp')

  function mostrar(texto, tipo) {
    aviso.textContent = texto
    aviso.className = `contacto-aviso visible ${tipo}`
  }

  const datos = () => ({
    nombre: form.nombre.value.trim(),
    correo: form.correo.value.trim(),
    motivo: form.motivo.value,
    mensaje: form.mensaje.value.trim(),
  })

  /* checkValidity() del navegador, pero con `novalidate` en el <form> para
     pintar el aviso nosotros: el globo nativo sobre fondo oscuro se ve
     fuera de sitio. */
  function valido() {
    if (form.checkValidity()) return true
    mostrar('Faltan datos: revisa el nombre, el correo y el mensaje.', 'malo')
    form.querySelector(':invalid')?.focus()
    return false
  }

  form.addEventListener('submit', async evento => {
    evento.preventDefault()
    if (!valido()) return

    const d = datos()
    btnCorreo.disabled = true
    mostrar('Enviando…', 'nota')

    try {
      const respuesta = await fetch(endpointCorreo, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          Nombre: d.nombre,
          Correo: d.correo,
          Motivo: d.motivo,
          Mensaje: d.mensaje,
          _subject: `Web · ${d.motivo} — ${d.nombre}`,
          _template: 'table',
          // El captcha de FormSubmit saca al visitante a otra página; con la
          // trampa de arriba sobra para el spam que recibe un sitio así.
          _captcha: 'false',
          // La trampa hay que reenviarla: FormSubmit solo puede descartar el
          // envío si el campo le llega en el cuerpo.
          _honey: form.elements['_honey'].value,
        }),
      })

      const cuerpo = await respuesta.json().catch(() => ({}))
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)

      // FormSubmit responde 200 con success:"false" mientras el buzón no esté
      // activado (hay que confirmar un correo la primera vez). Si es el caso,
      // se enseña SU mensaje en vez de un «enviado» que sería mentira.
      if (cuerpo.success === 'false' || cuerpo.success === false) {
        mostrar(cuerpo.message || 'El envío quedó pendiente de confirmación.', 'nota')
        return
      }

      form.reset()
      mostrar('¡Mensaje enviado! Te responderemos al correo que dejaste.', 'ok')
    } catch (error) {
      console.error('No se pudo enviar el formulario:', error)
      mostrar(`No se pudo enviar. Escríbenos a ${contacto.correo}.`, 'malo')
    } finally {
      btnCorreo.disabled = false
    }
  })

  btnWhatsapp?.addEventListener('click', () => {
    if (!valido()) return
    const d = datos()
    const texto =
      `Hola, escribo desde la web.\n\n` +
      `Motivo: ${d.motivo}\nNombre: ${d.nombre}\nCorreo: ${d.correo}\n\n${d.mensaje}`

    // encodeURIComponent y no encodeURI: hay que escapar también los saltos
    // de línea y los '&', o WhatsApp corta el texto por la mitad.
    window.open(`${enlaceWhatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
    mostrar('Se abrió WhatsApp con el mensaje listo: solo falta enviarlo.', 'ok')
  })
}
