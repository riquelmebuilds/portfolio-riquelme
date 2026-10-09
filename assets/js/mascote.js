/* ============================================================
   Mascote — bonequinho de pixel que acompanha a rolagem.
   Ele pula entre os elementos marcados com data-perch:
     data-perch="stand|sit|point"   pose ao chegar
     data-perch-x="0.8"             posição horizontal (0 a 1)
     data-say="texto"               balãozinho de fala
     data-face="left"               olha/aponta pra esquerda
   Clicar nele abre o WhatsApp.
   ============================================================ */
(() => {
  const WHATS = window.SITE?.whatsapp || '';

  const PALETA = {
    k: '#121218', // contorno
    h: '#4a3326', H: '#7b5540', // cabelo
    s: '#f3c9a2', S: '#d6a07a', // pele
    e: '#121218', // olho
    r: '#6d1d2c', R: '#952a3d', // camiseta
    d: '#c8343f', // faixa
    p: '#1d2030', // calça
    f: '#f2f2f2', g: '#2a2a31', // headphone (branco e preto)
    b: '#6f98ec', B: '#3a5fb0', // tênis
  };

  // Cabeça e tronco (16 colunas), compartilhados pelas poses
  const CABECA = [
    '......k.k.k.....',
    '.....khkhkhk....',
    '....khhhhhhhkk..',
    '...kfffffffffk..',
    '..kfhhHHHhhhhhk.',
    '..kfhhhhhhhhhhhk',
    '..kfhhhhhhhhhhk.',
    '..kggghsssssssk.',
    '..kgfghssssessk.',
    '..kggghssssessk.',
    '...khhSssssssk..',
    '....kkSSsssskk..',
  ];
  const TRONCO = [
    '....krrrRRrrk...',
    '...krrrrRRrrrk..',
    '..ksrrrrrrrrrsk.',
    '..ksrrrrrrrrrsk.',
    '..kSdddddddddSk.',
  ];
  const PERNAS_EM_PE = [
    '...kpppppppppk..',
    '...kppppkppppk..',
    '...kppppkppppk..',
    '...kBBBBkBBBBBk.',
    '...kkkkkkkkkkkk.',
  ];

  const pad = (rows, n) => rows.map((r) => r + '.'.repeat(n));

  const SPRITES = {
    stand: {
      rows: [...CABECA, ...TRONCO, ...PERNAS_EM_PE],
      chao: 22, centro: 8,
    },
    sit: {
      rows: [
        ...pad(CABECA, 2), ...pad(TRONCO, 2),
        '...kpppppppppppk..',
        '...kkkkkkkpppppk..',
        '.........kppppk...',
        '.........kppppk...',
        '.........kBBBBBk..',
        '.........kkkkkkk..',
      ],
      chao: 19, centro: 8,
    },
    point: {
      rows: [
        ...pad(CABECA, 4),
        '....krrrRRrrkkkkkk..',
        '...krrrrRRrrrrrrssk.',
        '..ksrrrrrrrrrkkkkkk.',
        '..ksrrrrrrrrrk......',
        '..kSdddddddddk......',
        ...pad(PERNAS_EM_PE, 4),
      ],
      chao: 22, centro: 8,
    },
    jump: {
      rows: [
        ...CABECA, ...TRONCO,
        '...kpppppppppk..',
        '...kBBBBkBBBBBk.',
        '...kkkkkkkkkkkk.',
      ],
      chao: 20, centro: 8,
    },
  };

  // Gera um canvas por pose (com e sem piscada)
  function desenhar(rows, piscando) {
    const c = document.createElement('canvas');
    c.width = rows[0].length;
    c.height = rows.length;
    const g = c.getContext('2d');
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch === '.') return;
        let cor = PALETA[ch];
        if (piscando && ch === 'e' && rows[y + 1]?.[x] === 'e') cor = PALETA.s;
        g.fillStyle = cor;
        g.fillRect(x, y, 1, 1);
      });
    });
    return c;
  }

  const FRAMES = {};
  for (const [nome, sp] of Object.entries(SPRITES)) {
    FRAMES[nome] = { aberto: desenhar(sp.rows, false), fechado: desenhar(sp.rows, true) };
  }

  // ---------- Elemento ----------
  const el = document.createElement('button');
  el.className = 'mascote';
  el.type = 'button';
  el.setAttribute('aria-label', 'Falar com o Riquelme no WhatsApp');
  el.innerHTML = '<span class="mascote__balao" aria-hidden="true"></span><span class="mascote__corpo"><canvas></canvas></span>';
  document.body.appendChild(el);

  const canvas = el.querySelector('canvas');
  const corpo = el.querySelector('.mascote__corpo');
  const balao = el.querySelector('.mascote__balao');
  const ctx = canvas.getContext('2d');

  const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let escala = innerWidth < 720 ? 3 : 4;
  addEventListener('resize', () => { escala = innerWidth < 720 ? 3 : 4; pintar(); });

  let pose = 'stand';
  let piscando = false;
  let virado = false;

  function pintar() {
    const f = FRAMES[pose][piscando ? 'fechado' : 'aberto'];
    canvas.width = f.width;
    canvas.height = f.height;
    ctx.clearRect(0, 0, f.width, f.height);
    ctx.drawImage(f, 0, 0);
    canvas.style.width = f.width * escala + 'px';
    canvas.style.height = f.height * escala + 'px';
    corpo.style.transform = virado ? 'scaleX(-1)' : '';
  }

  // Piscada de vez em quando
  (function piscar() {
    setTimeout(() => {
      piscando = true; pintar();
      setTimeout(() => { piscando = false; pintar(); piscar(); }, 140);
    }, 2200 + Math.random() * 2800);
  })();

  // ---------- Fala ----------
  let falaAtual = '';
  let timerFala;
  function falar(texto, ms = 3200) {
    clearTimeout(timerFala);
    if (!texto) { balao.classList.remove('on'); return; }
    if (texto !== falaAtual || !balao.classList.contains('on')) {
      balao.textContent = texto;
      balao.classList.remove('on');
      void balao.offsetWidth;
      balao.classList.add('on');
    }
    falaAtual = texto;
    timerFala = setTimeout(() => balao.classList.remove('on'), ms);
  }

  el.addEventListener('mouseenter', () => falar('me clica, bora conversar!', 2000));
  el.addEventListener('click', () => {
    el.classList.remove('feliz'); void el.offsetWidth; el.classList.add('feliz');
    falar('abrindo o WhatsApp...', 1600);
    const msg = encodeURIComponent('Opa, Riquelme! Vim pelo teu site (cliquei no bonequinho kkk).');
    setTimeout(() => window.open(`https://wa.me/${WHATS}?text=${msg}`, '_blank', 'noopener'), 350);
  });

  // ---------- Movimento ----------
  const pos = { x: -200, y: -200 };
  let poleiro = null;     // elemento atual
  let salto = null;       // { de:{x,y}, t0, dur, altura }
  let ativo = false;      // só aparece depois do CTA do topo
  let ultimoSalto = 0;

  function alvoDe(p) {
    const r = p.getBoundingClientRect();
    const fx = parseFloat(p.dataset.perchX ?? '0.5');
    const sp = SPRITES[p.dataset.perch || 'stand'];
    const centro = p.dataset.face === 'left' ? sp.rows[0].length - sp.centro : sp.centro;
    // data-perch-dy: desce o ponto de pouso (fração da altura) — útil em texto grande,
    // onde a caixa da linha começa acima das letras
    const dy = parseFloat(p.dataset.perchDy ?? '0') * r.height;
    return {
      x: r.left + r.width * fx - centro * escala,
      y: r.top + dy - sp.chao * escala + 1,
    };
  }

  // Escolhe onde pousar: só vale lugar com a borda de cima visível
  // (abaixo do menu). Entre esses, o último que já passou de 62% da tela.
  function escolherPoleiro() {
    const vh = innerHeight;
    const topoLivre = 70 + 24 * escala;
    const visiveis = [...document.querySelectorAll('[data-perch]')].filter((p) => {
      const r = p.getBoundingClientRect();
      return r.width > 0 && r.top > topoLivre && r.top < vh - 30;
    });
    if (!visiveis.length) return poleiro;
    const fimDaPagina = scrollY + vh >= document.documentElement.scrollHeight - 4;
    if (fimDaPagina) return visiveis[visiveis.length - 1];
    const passaram = visiveis.filter((p) => p.getBoundingClientRect().top < vh * 0.62);
    return passaram.length ? passaram[passaram.length - 1] : visiveis[0];
  }

  function pularPara(p) {
    const anterior = poleiro;
    poleiro = p;
    virado = p.dataset.face === 'left';
    if (reduzir || !anterior) {
      mudarDeCasa(casaDe(p));
      const a = alvoDe(p);
      pos.x = a.x; pos.y = a.y;
      pose = p.dataset.perch || 'stand';
      pintar();
      falar(p.dataset.say);
      return;
    }
    const a = alvoDe(p);
    const dist = Math.hypot(a.x - pos.x, a.y - pos.y);
    salto = {
      de: { x: pos.x, y: pos.y },
      t0: performance.now(),
      dur: Math.min(780, 420 + dist * 0.4),
      altura: Math.min(220, 70 + dist * 0.25),
    };
    mudarDeCasa(document.body); // no ar ele volta pra página
    pose = 'jump';
    balao.classList.remove('on');
    pintar();
    ultimoSalto = performance.now();
  }

  const ease = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  // Onde o boneco "mora" enquanto tá parado. Pousado num card (que é sticky), ele vira
  // filho do card e anda junto com ele; no resto, fica na página e rola junto com ela.
  // Assim a rolagem é feita pelo próprio navegador e ele não fica deslizando atrás do texto.
  let casa = document.body;
  const casaDe = (p) => p.closest('.card') || document.body;
  function mudarDeCasa(nova) {
    if (casa === nova) return;
    casa = nova;
    nova.appendChild(el);
  }
  // canto de cima/esquerda da casa, em coordenadas da tela
  function origem() {
    if (casa === document.body) return { x: -scrollX, y: -scrollY };
    const r = casa.getBoundingClientRect();
    return { x: r.left + casa.clientLeft, y: r.top + casa.clientTop };
  }

  function quadro(agora) {
    if (ativo) {
      const p = escolherPoleiro();
      // evita ficar pulando sem parar numa rolagem muito rápida
      if (p && p !== poleiro && agora - ultimoSalto > 160) pularPara(p);

      if (poleiro) {
        const a = alvoDe(poleiro);
        if (salto) {
          const t = Math.min(1, (agora - salto.t0) / salto.dur);
          const k = ease(t);
          pos.x = salto.de.x + (a.x - salto.de.x) * k;
          pos.y = salto.de.y + (a.y - salto.de.y) * k - Math.sin(Math.PI * t) * salto.altura;
          corpo.style.rotate = `${Math.sin(Math.PI * t) * (a.x > salto.de.x ? 8 : -8)}deg`;
          if (t >= 1) {
            salto = null;
            mudarDeCasa(casaDe(poleiro));
            corpo.style.rotate = '';
            pose = poleiro.dataset.perch || 'stand';
            pintar();
            el.classList.remove('pousou'); void el.offsetWidth; el.classList.add('pousou');
            falar(poleiro.dataset.say);
          }
        } else {
          pos.x = a.x; pos.y = a.y;
        }
      }
      const o = origem();
      el.style.transform = `translate3d(${Math.round(pos.x - o.x)}px, ${Math.round(pos.y - o.y)}px, 0)`;
      // balão do lado que tem mais espaço
      const largura = canvas.offsetWidth + balao.offsetWidth + 20;
      el.classList.toggle('balao-esq', pos.x + largura > innerWidth - 8 && pos.x > innerWidth - pos.x - canvas.offsetWidth);
    }
    requestAnimationFrame(quadro);
  }

  pintar();
  requestAnimationFrame(quadro);

  // Entrada: cai do céu em cima do CTA do topo
  window.Mascote = {
    entrar(perch) {
      if (ativo) return;
      ativo = true;
      el.classList.add('visivel');
      poleiro = perch;
      const a = alvoDe(perch);
      pos.x = a.x; pos.y = -160;
      salto = reduzir ? null : { de: { x: a.x, y: -160 }, t0: performance.now(), dur: 620, altura: 0 };
      pose = reduzir ? perch.dataset.perch || 'stand' : 'jump';
      ultimoSalto = performance.now();
      pintar();
      if (reduzir) falar(perch.dataset.say);
    },
    falar,
  };
})();
