/* Configuración central: reemplaza estos valores por los datos oficiales. */
const WHATSAPP_NUMBER = "525663838884";
const PHONE_NUMBER = "+525663838884";
const CONTACT_EMAIL = "admin.mototaxis.santaines@gmail.com";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61595112242127";
// Cuando esté disponible, coloca aquí la ruta del logo real, por ejemplo assets/logos/logo.png.
const LOGO_PATH = "assets/logos/logo-santa-ines.png";
const WHATSAPP_MESSAGE = "Hola, vi la página de la Asociación de Mototaxis Santa Inés y quisiera información sobre el servicio.";

const configured = {
  whatsapp: /^52\d{10}$/.test(WHATSAPP_NUMBER),
  phone: /^\+\d{10,15}$/.test(PHONE_NUMBER),
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT_EMAIL) && CONTACT_EMAIL !== "correo@ejemplo.com",
  facebook: /^https?:\/\//.test(FACEBOOK_URL)
};
function contactURL(channel, message = WHATSAPP_MESSAGE) {
  if (channel === "whatsapp") return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  if (channel === "phone") return `tel:${PHONE_NUMBER}`;
  if (channel === "email") return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Contacto · Mototaxis Santa Inés")}&body=${encodeURIComponent(message)}`;
  return FACEBOOK_URL;
}
const notice = document.getElementById("notice");
let previousFocus;
function showNotice(message, title = "Muy pronto") {
  previousFocus = document.activeElement;
  document.getElementById("noticeTitle").textContent = title;
  document.getElementById("noticeText").textContent = message;
  notice.showModal();
  document.body.classList.add("modal-open");
}
function pendingContact() {
  showNotice("Este canal estará disponible cuando publiquemos los datos oficiales de contacto.", "Contacto próximamente");
}
notice.querySelectorAll(".modal-close, [data-close]").forEach(button => button.addEventListener("click", () => notice.close()));
notice.addEventListener("click", event => {
  const box = notice.getBoundingClientRect();
  if (event.target === notice && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) notice.close();
});
notice.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  previousFocus?.focus({ preventScroll: true });
});
document.querySelectorAll("[data-contact]").forEach(link => {
  const channel = link.dataset.contact;
  if (configured[channel]) link.href = contactURL(channel);
  else { link.removeAttribute("target"); link.addEventListener("click", event => { event.preventDefault(); pendingContact(); }); }
  if (configured[channel] && ["whatsapp", "facebook"].includes(channel)) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
  else if (["phone", "email"].includes(channel)) link.removeAttribute("target");
});
document.getElementById("year").textContent = new Date().getFullYear();
const menuButton = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
function setMenu(open) {
  menu.classList.toggle("active", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  menuButton.textContent = open ? "✕" : "☰";
}
menuButton.addEventListener("click", () => setMenu(!menu.classList.contains("active")));
menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", event => { if (event.key === "Escape" && menu.classList.contains("active")) { setMenu(false); menuButton.focus(); } });
document.addEventListener("click", event => { if (!event.target.closest("header")) setMenu(false); });
window.addEventListener("resize", () => { if (window.innerWidth > 1050) setMenu(false); });
document.querySelectorAll("[data-lost]").forEach(button => button.addEventListener("click", () => {
  document.getElementById("reportType").value = "Objeto olvidado";
  document.getElementById("reportes").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  document.getElementById("reportType").focus({ preventScroll: true });
}));
const anonymous = document.getElementById("anonymous");
anonymous.addEventListener("change", () => {
  document.querySelectorAll("[data-personal]").forEach(input => { input.disabled = anonymous.checked; });
});
document.getElementById("reportForm").addEventListener("submit", event => {
  event.preventDefault();
  const channel = event.submitter?.value || "whatsapp";
  if (!configured[channel]) { pendingContact(); return; }
  const data = new FormData(event.currentTarget);
  const lines = ["Reporte · Asociación de Mototaxis Santa Inés", `Tipo: ${data.get("type")}`, `Número económico: ${data.get("unit") || "No indicado"}`];
  if (anonymous.checked) lines.push("Reporte anónimo: sin datos personales en el mensaje.");
  else [ ["Nombre", "name"], ["Teléfono", "phone"], ["Correo", "email"] ].forEach(([label, key]) => { if (data.get(key)) lines.push(`${label}: ${data.get(key)}`); });
  lines.push(`Descripción: ${data.get("description")}`);
  const url = contactURL(channel, lines.join("\n"));
  if (channel === "whatsapp") window.open(url, "_blank", "noopener,noreferrer");
  else window.location.href = url;
});
if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("active"); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.documentElement.classList.add("js-motion");
  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
}
if (LOGO_PATH) {
  document.querySelectorAll("[data-official-logo]").forEach(img => {
    img.addEventListener("load", () => { img.hidden = false; if (img.closest(".logo-card")) document.querySelector(".logo-fallback").hidden = true; });
    img.addEventListener("error", () => { img.hidden = true; });
    if (img.closest("footer")) img.loading = "lazy";
    img.src = LOGO_PATH;
  });
  const logo = new Image();
  logo.onload = () => { const icon = document.createElement("link"); icon.rel = "icon"; icon.href = LOGO_PATH; document.head.append(icon); };
  logo.src = LOGO_PATH;
}
