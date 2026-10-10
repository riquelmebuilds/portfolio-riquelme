# Portfólio — Riquelme Gabriel

Site pessoal do Riquelme (não é o da Nextage). Preto de verdade e branco, com azul só em detalhe pequeno, com um bonequinho de pixel que acompanha a rolagem.

**Stack:** HTML, CSS e JS puro. Sem build — é só abrir o `index.html` ou subir a pasta na Vercel/Netlify.

## Seções

1. **Topo** — preto com faixas de "mármore líquido" azul escuro desenhadas em pontinhos, girando devagar (`assets/js/hero-fundo.js`, WebGL; o mouse puxa de leve). Nome pequeno, branco, na fonte Agraham (`assets/fonts/Agraham.otf`), "Riquelme" em cima e "Gabriel" embaixo deslocado; as letras acendem fora de ordem, sem movimento. Depois o botão "Saiba mais" surge com efeito de pixel e o bonequinho cai em cima dele.
2. **Veja meu trabalho** — texto gigante que desliza com a rolagem.
3. **Projetos** — texto fixo à esquerda e cards de canto reto que sobem e empilham à direita (número + tags em cima, imagem de ponta a ponta, título e seta embaixo). O último card chama pro WhatsApp.
4. **Boas ideias ficam melhores** — quando a seção começa a aparecer, o título acende, a ideia é digitada e só depois o site do exemplo se monta, terminando com dois avisos de automação (agendamento + WhatsApp enviado). Não trava a rolagem.
5. **Contato** — nome, tipo de projeto e ideia → "Arraste pra enviar" → abre o WhatsApp com a mensagem pronta.
6. **Rodapé** — "RIQUELME" gigante em fonte pixel, WhatsApp, e-mail e links pros termos e política.
7. **Páginas legais** — `termos.html` e `privacidade.html` (texto simples, LGPD). Não é parecer jurídico: se o site for coletar dados de outro jeito, revisar.

## O bonequinho

- Desenhado pixel a pixel em `assets/js/mascote.js` (dá pra mudar as cores na `PALETA`).
- Pula entre os elementos que têm `data-perch`:
  - `data-perch="stand|sit|point"` — em pé, sentado ou apontando
  - `data-perch-x="0.8"` — onde ele pousa (0 = esquerda, 1 = direita)
  - `data-perch-dy="0.2"` — desce o ponto de pouso (pra texto grande)
  - `data-face="left"` — vira pra esquerda
  - `data-say="texto"` — o que ele fala no balão
- Clicar nele abre o WhatsApp.

## Como mexer

- **WhatsApp:** `window.SITE.whatsapp` no `<head>` do `index.html` (e o número escrito no contato e nas páginas legais).
- **E-mail:** no rodapé do `index.html` e nas duas páginas legais.
- **Nome do topo:** dentro de `.hero__titulo` no `index.html` (o JS separa as letras sozinho). Deslocamento das duas linhas em `.palavra--1` e `.palavra--2` no CSS.
- **Fundo do topo:** em `hero-fundo.js` — `CELULA` é o tamanho do pontinho, `azul` (no shader) é a cor, e o `smoothstep(.55, ...)` na função `campo` controla a grossura das faixas (maior = mais fina).
- **Fonte do nome:** Agraham, em `assets/fonts/Agraham.otf` (versão demo do dafont — só uso pessoal; licença comercial em https://hishandstudio.com/product/agraham-aesthetic-serif-font/).
- **Texto do botão do topo:** procure `Saiba mais` no `index.html`.
- **Adicionar projeto:** copie um `<article class="card">` inteiro, troque a imagem (`assets/img/projetos/`, JPG 16:10), os textos e o `data-say`. Ajuste o `style="--i:N"` (ordem) e o total `05` no contador.

## Antes de publicar

- **Vemax** é demo de proposta. Confirmar com o cliente se pode mostrar no portfólio. Os cards linkam pros sites no GitHub Pages (riquelmebuilds.github.io).
- **Helena Duarte** é fictícia — tá marcada como "(demo)".
