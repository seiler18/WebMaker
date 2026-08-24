/* ============================================================
   CONTACTO — destinos del formulario

   NUNCA pongas aquí una clave de API. Esto se compila a un .js que sirve
   GitHub Pages en claro: cualquiera lo lee con «ver código fuente». Por eso
   el formulario usa FormSubmit, que no necesita credenciales.

   PRIMERA VEZ: FormSubmit exige confirmar el buzón. Manda un envío de
   prueba desde el sitio publicado y acepta el correo que llega. Hasta que se
   confirme, el formulario responde «pendiente de confirmación» — y eso es lo
   que se le enseña al visitante, en vez de un «enviado» que sería mentira.
   ============================================================ */

export const contacto = {
  eyebrow: 'Hablemos',
  titulo: 'Contacto',
  subtitulo: 'Cuéntanos qué necesitas y elige por dónde prefieres que hablemos.',

  correo: '{{CORREO}}',
  // Formato internacional sin signos: 56912345678. Cadena vacía = sin
  // WhatsApp, y el botón desaparece solo.
  whatsapp: '{{WHATSAPP}}',

  motivos: ['Consulta general', 'Solicitud de servicio', 'Trabajar juntos', 'Otro'],

  // Se muestran en la columna de al lado del formulario.
  canales: [
    // { label: 'Correo',    valor: '…', href: 'mailto:…',  icon: 'fa-solid fa-envelope' },
    // { label: 'Teléfono',  valor: '…', href: 'tel:…',     icon: 'fa-solid fa-phone' },
    // { label: 'Dirección', valor: '…', href: null,        icon: 'fa-solid fa-location-dot' },
  ],
}

export const endpointCorreo = `https://formsubmit.co/ajax/${contacto.correo}`

export const enlaceWhatsapp = contacto.whatsapp
  ? `https://wa.me/${contacto.whatsapp}`
  : ''
