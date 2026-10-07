# Mototaxis Santa Inés · página local

Se mejoró el proyecto existente en HTML, CSS y JavaScript vanilla. No se realizó deploy ni se conectaron bases de datos, mapas o APIs.

## Abrir

Desde esta carpeta ejecuta `node preview.cjs` y abre http://127.0.0.1:8080. También puedes abrir `index.html` directamente o usar Live Server de VS Code.

## Contactos oficiales

Edita al inicio de `script.js`:

- `WHATSAPP_NUMBER`: código de país y número sin signos ni espacios.
- `PHONE_NUMBER`: número internacional con `+`.
- `CONTACT_EMAIL`: correo oficial.
- `FACEBOOK_URL`: enlace oficial completo.

Los datos oficiales están configurados. Todos los accesos y el formulario de reportes comparten estas constantes. WhatsApp y Facebook abren una pestaña nueva; llamadas y correo utilizan las aplicaciones del dispositivo.

## Logo e imágenes

El logo oficial proporcionado por el usuario está en `assets/logos/logo-santa-ines.png`. Se utiliza en navbar, hero, footer y favicon sin modificar la imagen original. No hay banner ni fotos adicionales.

Coloca el logo real en `assets/logos/` y establece `LOGO_PATH` en `script.js`. Se aplicará al navbar, hero, footer y favicon, conservando su proporción. El logo del footer se cargará con lazy loading. Puedes colocar las fotos o publicidad en `assets/images/` para su posterior integración visual. No hay imagen Open Graph porque todavía no existe un recurso oficial disponible ni una URL de producción.

## Reportes

Los formularios no guardan información. Los botones de envío abren el mensaje preparado en WhatsApp o correo cuando se configuran los contactos. La opción anónima deshabilita los campos personales y los excluye del mensaje; el canal elegido puede revelar el teléfono o correo del remitente. La sección de solicitud de mototaxi se retiró por petición del usuario.

## Verificación

`node --check script.js` revisa la sintaxis. Con Playwright instalado para desarrollo y Chrome disponible, `node verify.cjs` prueba los anchos 360, 390, 412, 1366 y 1440 px, enlaces internos, menú, modal, formularios, contactos pendientes y configurados, anonimato y movimiento reducido. Las capturas locales se guardan en `verification/`. Los datos usados para probar enlaces se inyectan solo en el navegador de prueba y no cambian la configuración pública.
