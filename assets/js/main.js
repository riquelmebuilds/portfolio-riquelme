/* ============================================================
   Portfólio Riquelme Gabriel — interações
   ============================================================ */
const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const whats = (texto) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(texto)}`;

// Links de WhatsApp com mensagem padrão
$$('[data-whats]').forEach((a) => {
  a.href = whats(a.dataset.whats || 'Opa, Riquelme! Vim pelo teu site.');
  a.target = '_blank';
  a.rel = 'noopener';
});

$('#ano').textContent = new Date().getFullYear();

/* ---------- Topo: nav muda ao rolar ---------- */
const nav = $('.nav');
addEventListener('scroll', () => nav.classList.toggle('rolou', scrollY > 30), { passive: true });

/* ---------- Nome do topo: letras acendendo fora de ordem (sem movimento) ---------- */
const TEMPO_NOME = (() => {
  const letras = [];
  $$('.hero__titulo .palavra').forEach((p) => {
    const texto = p.textContent.trim();
    p.textContent = '';
    for (const ch of texto) {
      const s = document.createElement('span');
      s.className = 'letra';
      s.textContent = ch;
      p.appendChild(s);
      letras.push(s);
    }
  });
  // ordem aleatória, intervalos irregulares; cada letra só acende
  const ordem = letras.map((_, i) => i).sort(() => Math.random() - 0.5);
  let atraso = 350;
  if (reduzir) letras.forEach((s) => s.classList.add('on'));
  else {
    ordem.forEach((i) => {
      setTimeout(() => letras[i].classList.add('on'), atraso);
      atraso += 45 + Math.random() * 75;
    });
    // o tchan: quando todas acendem, um brilho leve passa da esquerda pra direita
    const fim = atraso + 250;
    letras.forEach((s, i) => setTimeout(() => s.classList.add('brilho'), fim + i * 45));
  }
  return atraso + 300;
})();

/* ---------- Revelação em pixels ---------- */
// Cobre o elemento com quadradinhos azuis que aparecem e somem em ordem aleatória
function revelarEmPixels(alvo, { celula = 10, cor = '#f2f2f2', dur = 380 } = {}) {
  return new Promise((ok) => {
    const caixa = alvo.parentElement;
    const r = alvo.getBoundingClientRect();
    const rc = caixa.getBoundingClientRect();
    const c = document.createElement('canvas');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    c.className = 'pixel-cortina';
    c.width = r.width * dpr; c.height = r.height * dpr;
    Object.assign(c.style, {
      left: r.left - rc.left + 'px', top: r.top - rc.top + 'px',
      width: r.width + 'px', height: r.height + 'px',
    });
    caixa.appendChild(c);
    const g = c.getContext('2d');
    g.scale(dpr, dpr);
    const cols = Math.ceil(r.width / celula), rows = Math.ceil(r.height / celula);
    const ordem = [...Array(cols * rows).keys()].sort(() => Math.random() - 0.5);
    const raio = parseFloat(getComputedStyle(alvo).borderRadius) || 0;

    // recorta no formato do botão (pílula)
    g.save();
    g.beginPath();
    g.roundRect(0, 0, r.width, r.height, raio);
    g.clip();

    const t0 = performance.now();
    let fase = 1;
    (function passo(agora) {
      const t = clamp((agora - t0) / dur);
      if (fase === 1) {
        const n = Math.floor(ordem.length * t);
        g.fillStyle = cor;
        for (let k = 0; k < n; k++) {
          const i = ordem[k];
          g.fillRect((i % cols) * celula, Math.floor(i / cols) * celula, celula, celula);
        }
        if (t >= 1) {
          fase = 2;
          alvo.classList.add('on');
          requestAnimationFrame((a) => { passo2.t0 = a; passo2(a); });
          return;
        }
        requestAnimationFrame(passo);
      }
    })(t0);

    function passo2(agora) {
      const t = clamp((agora - passo2.t0) / dur);
      const n = Math.floor(ordem.length * t);
      for (let k = 0; k < n; k++) {
        const i = ordem[ordem.length - 1 - k];
        g.clearRect((i % cols) * celula, Math.floor(i / cols) * celula, celula, celula);
      }
      if (t < 1) return requestAnimationFrame(passo2);
      g.restore();
      c.remove();
      ok();
    }
  });
}

/* ---------- CTA do topo aparece depois do nome ---------- */
const cta = $('.hero__cta .btn');
setTimeout(async () => {
  if (reduzir) cta.classList.add('on');
  else await revelarEmPixels(cta);
  window.Mascote?.entrar($('.hero__cta'));
}, reduzir ? 200 : Math.max(500, TEMPO_NOME - 850));

/* ---------- Texto gigante "Veja meu trabalho" anda com a rolagem ---------- */
const gigante = $('.gigante');
const linhas = $$('.gigante__linha');

/* ---------- Cards empilhando ---------- */
const cards = $$('.card');
const contador = $('.projetos__contador b');

/* ---------- Seção das ideias: anima sozinha quando aparece (sem travar a rolagem) ---------- */
(() => {
  const ideias = $('.ideias');
  if (!ideias) return;
  const palavras = $$('.ideias__titulo .p', ideias);
  const nota = $('.nota__texto', ideias);
  const texto = nota.dataset.texto;
  const seta = $('.ideias__seta', ideias);
  // os pedaços do site entram na ordem do data-passo
  const blocos = $$('.mock [data-passo]', ideias)
    .sort((a, b) => parseFloat(a.dataset.passo) - parseFloat(b.dataset.passo));
  const espera = (ms) => new Promise((ok) => setTimeout(ok, reduzir ? 0 : ms));

  // o título acende quando ele mesmo chega na tela
  async function acenderTitulo() {
    for (const w of palavras) { w.classList.add('on'); await espera(80); }
  }
  // ideia é digitada até o fim → só então o site começa a aparecer
  async function montar() {
    await titulo; // se a pessoa rolou rápido, espera o título terminar
    await espera(120);
    nota.classList.add('digitando');
    for (let i = 1; i <= texto.length; i++) {
      nota.textContent = texto.slice(0, i);
      await espera(16);
    }
    nota.classList.remove('digitando');
    seta.classList.add('on');
    await espera(220);
    for (const b of blocos) { b.classList.add('on'); await espera(170); }
  }

  // cada parte só começa quando a pessoa chega nela
  let titulo = Promise.resolve();
  const quandoChegar = (alvo, limiar, fn) => {
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { o.disconnect(); fn(); }
    }, { threshold: limiar });
    o.observe(alvo);
  };
  quandoChegar($('.ideias__titulo', ideias), 0.6, () => { titulo = acenderTitulo(); });
  quandoChegar($('.ideias__cena', ideias), 0.45, montar);
})();

function aoRolar() {
  const vh = innerHeight;

  // gigante
  if (gigante) {
    const r = gigante.getBoundingClientRect();
    const p = clamp(1 - (r.top + r.height) / (vh + r.height));
    linhas.forEach((l, i) => {
      const dir = i % 2 ? 1 : -1;
      l.style.transform = `translate3d(${dir * (p - 0.5) * 22}vw,0,0)`;
    });
  }

  // cards: o de trás encolhe e escurece quando o próximo sobe
  let ativo = 0;
  cards.forEach((c, i) => {
    const prox = cards[i + 1];
    const r = c.getBoundingClientRect();
    if (r.top < vh * 0.62) ativo = i;
    if (!prox) return;
    const d = prox.getBoundingClientRect().top - r.top;
    const p = clamp(1 - d / r.height).toFixed(3);
    if (c.dataset.cobre !== p) { c.dataset.cobre = p; c.style.setProperty('--cobre', p); }
  });
  if (contador) contador.textContent = String(ativo + 1).padStart(2, '0');
}
addEventListener('scroll', aoRolar, { passive: true });
addEventListener('resize', aoRolar);
aoRolar();

/* ---------- Aparecer ao rolar ---------- */
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
}), { threshold: 0.2 });
$$('.surge').forEach((el) => io.observe(el));

/* ---------- CTA do último card: anima quando aparece ---------- */
(() => {
  const cta = $('.card__cta');
  if (!cta) return;
  const o = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { cta.classList.add('on'); o.disconnect(); }
  }, { threshold: 0.4 });
  o.observe(cta);
})();

/* ---------- Contato ---------- */
const form = $('.contato__form');
const trilho = $('.arrastar');
const puxador = $('.arrastar__puxador');

function mensagem() {
  const nome = form.nome.value.trim();
  const tipo = form.querySelector('input[name="tipo"]:checked')?.value;
  const extra = form.ideia.value.trim();
  let t = 'Opa, Riquelme!';
  if (nome) t += ` Aqui é ${nome}.`;
  if (tipo) t += ` Tô precisando de: ${tipo}.`;
  if (extra) t += `\n\n${extra}`;
  return t;
}

function enviar() {
  trilho.classList.add('enviado');
  window.Mascote?.falar('mandou bem! te respondo já já', 3500);
  window.open(whats(mensagem()), '_blank', 'noopener');
  setTimeout(() => { trilho.classList.remove('enviado'); posicionar(0); }, 2200);
}

let arrastando = false, inicioX = 0, atual = 0;
const limite = () => trilho.clientWidth - puxador.offsetWidth - 8;
function posicionar(x) {
  atual = clamp(x, 0, limite());
  trilho.style.setProperty('--x', atual + 'px');
  trilho.style.setProperty('--p', (atual / limite()).toFixed(3));
}
puxador.addEventListener('pointerdown', (e) => {
  arrastando = true;
  inicioX = e.clientX - atual;
  puxador.setPointerCapture(e.pointerId);
  trilho.classList.add('arrastando');
});
puxador.addEventListener('pointermove', (e) => { if (arrastando) posicionar(e.clientX - inicioX); });
puxador.addEventListener('pointerup', () => {
  arrastando = false;
  trilho.classList.remove('arrastando');
  if (atual >= limite() * 0.88) { posicionar(limite()); enviar(); }
  else posicionar(0);
});
// teclado / leitor de tela: Enter ou espaço envia direto
puxador.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); posicionar(limite()); enviar(); }
});
form.addEventListener('submit', (e) => { e.preventDefault(); enviar(); });
