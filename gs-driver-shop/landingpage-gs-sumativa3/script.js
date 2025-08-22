// Año dinámico en footer
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Toggle del menú móvil
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('show');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Slider básico (autoplay + botones + dots)
(function slider(){
  const root = document.querySelector('.slider');
  if (!root) return;
  const slides = Array.from(root.querySelectorAll('.slide'));
  const dots = Array.from(root.querySelectorAll('.dot'));
  const btnPrev = root.querySelector('.prev');
  const btnNext = root.querySelector('.next');
  let i = 0, timer;

  function go(n){
    i = (n + slides.length) % slides.length;
    const width = root.clientWidth;
    root.querySelector('.slides').style.transform = `translateX(-${i * width}px)`;
    slides.forEach((s,idx)=>s.classList.toggle('is-active', idx===i));
    dots.forEach((d,idx)=>d.classList.toggle('is-active', idx===i));
    dots.forEach((d,idx)=>d.setAttribute('aria-selected', String(idx===i)));
  }

  function auto(){ clearInterval(timer); timer = setInterval(()=>go(i+1), 4500); }

  window.addEventListener('resize', ()=>go(i));
  btnPrev && btnPrev.addEventListener('click', ()=>{ go(i-1); auto(); });
  btnNext && btnNext.addEventListener('click', ()=>{ go(i+1); auto(); });
  dots.forEach((d,idx)=>d.addEventListener('click', ()=>{ go(idx); auto(); }));

  go(0); auto();
})();

// Validación (HTML5 required + mensajes personalizados)
const form = document.querySelector('.contact-form');
if (form){
  const msg = form.querySelector('.form-msg');
  const nombre  = form.querySelector('#nombre');
  const email   = form.querySelector('#email');
  const mensaje = form.querySelector('#mensaje');


  form.addEventListener('submit', (e)=>{
    e.preventDefault();

    // Forzar que el navegador evalúe validez nativa
    if (!form.checkValidity()){
      const invalid = form.querySelector(':invalid');
      if (invalid) {
        invalid.focus();

        // Mensaje por campo
        let error = 'Por favor completa los campos requeridos.';
        if (invalid === nombre) {
          if (nombre.validity.valueMissing) error = 'El nombre y apellido son obligatorios.';
          else if (nombre.validity.tooShort) error = 'El nombre es demasiado corto.';
          else error = 'Revisa el formato del nombre.';
        }
        if (invalid === email) {
          if (email.validity.valueMissing) error = 'El email es obligatorio.';
          else if (email.validity.typeMismatch) error = 'Ingresa un correo electrónico válido (ej: usuario@dominio.com).';
          else error = 'Revisa el correo electrónico.';
        }
        if (invalid === mensaje) {
          if (mensaje.validity.valueMissing) error = 'El mensaje no puede estar vacío.';
          else error = 'Revisa el contenido del mensaje.';
        }

        msg.textContent = error;
        msg.style.color = 'red';
      }
      return;
    }

    // Si todo es válido
    msg.textContent = '¡Gracias! Tu mensaje fue enviado (demo).';
    msg.style.color = 'green';
    form.reset();
  });

  // Limpiar/actualizar mensajes al corregir
  form.querySelectorAll('[required]').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.validity.valid) {
        msg.textContent = '';
      }
    });

    // Mostrar hint si el usuario abandona un campo inválido
    input.addEventListener('blur', () => {
      if (!input.checkValidity()) {
        let hint = 'Campo inválido.';
        if (input === nombre) {
          if (nombre.validity.valueMissing) hint = 'El nombre y apellido son obligatorios.';
          else if (nombre.validity.tooShort) hint = 'El nombre es demasiado corto.';
          else hint = 'Revisa el formato del nombre.';
        }
        if (input === email) {
          if (email.validity.valueMissing) hint = 'El email es obligatorio.';
          else if (email.validity.typeMismatch) hint = 'Ingresa un correo electrónico válido.';
          else hint = 'Revisa el correo electrónico.';
        }
        if (input === mensaje) {
          if (mensaje.validity.valueMissing) hint = 'El mensaje no puede estar vacío.';
          else hint = 'Revisa el mensaje.';
        }
        msg.textContent = hint;
        msg.style.color = 'red';
      }
    });
  });
}
