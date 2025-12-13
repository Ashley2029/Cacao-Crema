/* -------- Secciones -------- */
function showSection(id){
  document.querySelectorAll('main section').forEach(s => s.style.display='none');
  const el = document.getElementById(id);
  if(el) el.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* -------- Carrito (localStorage) -------- */
const CART_KEY = 'cacao_crema_cart_v1';
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

function saveCart(){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCartFromCard(btn){
  const card = btn.closest('.product-card');
  const id = card.getAttribute('data-id');
  const price = parseFloat(card.getAttribute('data-price')) || 0;
  const title = card.querySelector('.product-title')?.innerText || id;
  const img = card.querySelector('img')?.src || '';

  addToCart({id, title, price, img, qty:1});
}

function addToCart(item){
  const existing = cart.find(i => i.id === item.id);
  if(existing) existing.qty += 1;
  else cart.push({...item});
  saveCart();
  renderCart();
  
  document.getElementById('cart').classList.add('open');
  document.getElementById('cart').setAttribute('aria-hidden','false');
}

function renderCart(){
  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  let total = 0;

  if(cart.length === 0){
    container.innerHTML = '<div style="padding:18px; color:var(--muted)">Tu carrito está vacío</div>';
  }

  cart.forEach((it, idx)=>{
    total += it.price * it.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';

    div.innerHTML = `
      <img src="${it.img}" alt="${it.title}">
      <div class="meta">
        <div style="font-weight:700; color:var(--cacao)">${it.title}</div>
        <div style="color:var(--muted)">S/ ${it.price.toFixed(2)} x ${it.qty}</div>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px">
        <button class="qty-btn" onclick="changeQty(${idx},1)">＋</button>
        <button class="qty-btn" onclick="changeQty(${idx},-1)">−</button>
      </div>
    `;
    container.appendChild(div);
  });

  document.getElementById('cart-total').innerText = total.toFixed(2);
}

function changeQty(index, delta){
  if(!cart[index]) return;
  cart[index].qty += delta;
  if(cart[index].qty <= 0) cart.splice(index,1);
  saveCart();
  renderCart();
}

function clearCart(){
  cart = [];
  saveCart();
  renderCart();
}

function checkout(){
  if(cart.length === 0){
    alert('Tu carrito está vacío.');
    return;
  }

  let summary = 'Resumen de compra:\n\n';
  let total = 0;
  cart.forEach(i=>{
    summary += `${i.title} x ${i.qty} — S/ ${(i.price*i.qty).toFixed(2)}\n`;
    total += i.price*i.qty;
  });
  summary += `\nTotal: S/ ${total.toFixed(2)}\n\nGracias por elegir Cacao & Crema. (Simulación)`;

  alert(summary);
  clearCart();
  document.getElementById('cart').classList.remove('open');
}

function toggleCart(){
  const el = document.getElementById('cart');
  el.classList.toggle('open');
  const opened = el.classList.contains('open');
  el.setAttribute('aria-hidden', opened ? 'false' : 'true');
}

// init
renderCart();

/* -------- Chat simple -------- */
function toggleChat(){
  const w = document.getElementById('chat-window');
  w.style.display = w.style.display === 'block' ? 'none' : 'block';
  w.setAttribute('aria-hidden', w.style.display === 'none');
}

function appendChat(text, who='bot'){
  const body = document.getElementById('chat-body');
  const d = document.createElement('div');
  d.className = 'msg ' + (who==='bot' ? 'bot' : 'user');
  d.innerHTML = text;
  body.appendChild(d);
  body.scrollTop = body.scrollHeight;
}

function sendChat(){
  const input = document.getElementById('chat-input');
  const txt = input.value.trim();
  if(!txt) return;

  appendChat(txt,'user');
  input.value='';

  setTimeout(()=>{
    const t = txt.toLowerCase();

    if(t.includes('precio')||t.includes('precios'))
      appendChat('Los precios están en la sección Tienda. Ej: Brownie S/9, Mousse S/12, Cheesecake S/28.');
    else if(t.includes('envio')||t.includes('entrega'))
      appendChat('Envíos dentro de Lima Metropolitana. Envío gratuito a partir de S/60.');
    else if(t.includes('pago')||t.includes('transferencia'))
      appendChat('Aceptamos transferencia, Yape/Plin y pago al recojo.');
    else if(t.includes('personaliz'))
      appendChat('Hacemos tortas y postres personalizados. Indícanos fecha, tamaño y estilo para cotizar.');
    else if(t.includes('hola')||t.includes('buenas'))
      appendChat('¡Hola! ¿En qué puedo ayudarte? Precios, envío, pago o personalización.');
    else
      appendChat('Lo siento, soy un bot simple. Puedes preguntar por precios, envío, pago o escribir "hablar con humano".');
  },600);
}

/* -------- Mostrar home al cargar -------- */
showSection('home');

/* -------- Reseñas -------- */
const REVIEWS_KEY = 'cacao_crema_reviews';

function loadReviews(){
  const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
  const list = document.getElementById('review-list');
  list.innerHTML = '';

  reviews.forEach(r=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<strong>${r.name}</strong><p>${r.text}</p>`;
    list.appendChild(div);
  });
}

function addReview(){
  const name = document.getElementById('review-name').value.trim();
  const text = document.getElementById('review-text').value.trim();
  if(!name || !text) return alert('Completa ambos campos');

  const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
  reviews.push({name,text});
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));

  document.getElementById('review-name').value='';
  document.getElementById('review-text').value='';
  loadReviews();
}

loadReviews();


/* -------- Reseñas con estrellas -------- */
const REVIEWS_KEY = 'cacao_crema_reviews';
let currentRating = 0;

function setRating(rating){
  currentRating = rating;
  document.querySelectorAll('.stars-input span').forEach((s,i)=>{
    s.classList.toggle('active', i < rating);
  });
}

function loadReviews(){
  const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
  const list = document.getElementById('review-list');
  list.innerHTML = '';

  reviews.forEach(r=>{
    const div = document.createElement('div');
    div.className = 'card';

    let stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);

    div.innerHTML = `
      <div class="review-stars">${stars}</div>
      <strong>${r.name}</strong>
      <p>${r.text}</p>
    `;

    list.appendChild(div);
  });
}

function addReview(){
  const name = document.getElementById('review-name').value.trim();
  const text = document.getElementById('review-text').value.trim();

  if(!name || !text || currentRating === 0){
    alert('Completa tu nombre, opinión y calificación ⭐');
    return;
  }

  const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
  reviews.push({ name, text, rating: currentRating });

  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));

  document.getElementById('review-name').value = '';
  document.getElementById('review-text').value = '';
  currentRating = 0;
  document.querySelectorAll('.stars-input span').forEach(s=>s.classList.remove('active'));

  loadReviews();
}

loadReviews();

/* -------- Modo oscuro -------- */
const themeBtn = document.getElementById('theme-toggle');

if(localStorage.getItem('theme') === 'dark'){
  document.body.classList.add('dark');
}

function toggleTheme(){
  document.body.classList.toggle('dark');
  localStorage.setItem(
    'theme',
    document.body.classList.contains('dark') ? 'dark' : 'light'
  );
}

