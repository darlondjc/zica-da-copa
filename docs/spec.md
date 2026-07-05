# Geladeira da Zica — Especificação do Projeto

Documento de handoff para continuar o desenvolvimento no Claude Code.
O protótipo funcional já existe em um único arquivo: `index.html`.

---

## 1. O que é

Site de zoeira para a Copa do Mundo baseado na mandinga popular brasileira de
"colocar o nome do jogador na geladeira" para zicar (dar azar). O usuário escreve
o nome de um jogador ou seleção num papelzinho e joga dentro de um freezer aberto,
onde o nome fica "congelando" junto com pinguins e neve caindo.

O objetivo de negócio é **viralizar no Instagram/WhatsApp**. Por isso o recurso mais
importante do produto é o **compartilhamento de imagem** da geladeira lotada — é o
que gera o loop de crescimento. A monetização é via **Google AdSense** (banners),
o que só faz sentido com volume alto de acessos.

Tom: humor brasileiro, informal, temática de "frio / botar no gelo".

---

## 2. Stack atual

- **1 arquivo HTML** standalone (HTML + CSS + JS vanilla, sem build).
- Fontes: Google Fonts — `Anton` (display), `Caveat` (manuscrito nos papéis), `Inter` (UI).
- `html2canvas` via CDN (cdnjs) para gerar a imagem de compartilhamento.
- `navigator.share` (Web Share API) para abrir o menu nativo no celular; fallback
  para download do PNG no desktop.
- Sem framework, sem backend, sem persistência (estado só em memória).

Decisão de arquitetura para o Claude Code: **manter simples**. Não migrar para
React/Vite a não ser que surja necessidade real. Se for adicionar páginas (Sobre,
Privacidade), pode ser HTML estático mesmo, ou um gerador simples. Priorizar
tempo de carregamento e facilidade de deploy (a janela de hype da Copa é curta).

---

## 3. Design / identidade visual

Conceito central: **frio**. O trocadilho é literal (botar o jogador "no gelo").

Tokens de cor (já definidos como CSS vars no `:root`):

- Fundo: gradiente gélido `--ice-deep #08313a` → `--ice-mid #0f4c58` → `--ice-glow #1b6f7e`
- Geladeira (esmalte): `--enamel #f4f2ec`, `--enamel-shade #dcdad2`
- Interior do freezer: `--cavity-top #bfe6ef` → `--cavity-bot #5aa7b8` → `--cavity-deep #2d6b7a`
- CTA quente (contraste): `--hot #e23a2e` / `--hot-dark #b62b21`
- Papéis (4 cores): `--paper-a` (amarelo), `--paper-b` (rosa), `--paper-c` (verde), `--paper-d` (azul)
- Tinta manuscrita: `--ink #22324f`

Regra de design: gastar a ousadia num lugar só. O elemento-assinatura é o
**interior do freezer aberto** (prateleiras + neve + pinguins tremendo). O resto
(painel de controle, header) fica quieto e disciplinado. Respeitar
`prefers-reduced-motion` (já implementado: desliga neve, tremor e shiver).

---

## 4. Estado atual — o que já funciona

- Geladeira **aberta** (sem porta), com borda de porta + borracha de vedação na lateral.
- Interior com **3 prateleiras de vidro** e degradê frio (mais gelado ao fundo).
- **Neve caindo** dentro do interior (~46 flocos, velocidade/deriva/opacidade aleatórias,
  contida por `overflow:hidden`).
- **3 pinguins** de SVG inline, parados nas prateleiras, com animação de tremor (shiver)
  e uma casquinha de gelo azulada.
- Input de nome + seletor de **4 cores** de papel.
- Botão "Jogar no freezer": cria um papel que **pousa numa prateleira** (escolhe a
  menos cheia), levemente torto, com brilho de gelo e etiqueta "NO GELO"; a geladeira
  treme; toast de confirmação.
- Papéis são **arrastáveis** (mouse e touch).
- Contador de quantos foram congelados.
- Botão **Compartilhar**: gera PNG via html2canvas → Web Share (mobile) ou download (desktop).
- Botão **Limpar tudo**.
- Espaços reservados para 2 banners AdSense (topo 728×90 e rodapé responsivo), com
  comentário no `<head>` marcando onde entra o script.
- Responsivo (empilha no mobile) e acessível (foco visível, reduced-motion).

---

## 5. Limitações conhecidas / bugs a observar

1. **Persistência**: o estado vive só em memória. Recarregar a página apaga tudo.
   Para produção, salvar no `localStorage` do navegador (nomes, cores, posições).
2. **html2canvas + neve**: a captura congela um frame e pode não renderizar bem os
   flocos animados. Ideia: no momento do compartilhamento, pausar a neve num padrão
   fixo bonito antes de capturar, ou desenhar a neve num `<canvas>` estático só para a foto.
3. **Sobreposição de papéis**: com muitos nomes na mesma prateleira eles se sobrepõem.
   Distribuição atual só escolhe a prateleira menos cheia; o X é aleatório. Pode
   melhorar espalhando melhor no eixo X ou empilhando com leve deslocamento.
4. **Posição dos pinguins** é calculada após 2 `requestAnimationFrame`. Se o layout
   mudar (resize), eles não reposicionam. Considerar recalcular no `resize`.

---

## 6. Próximos passos (prioridade)

### P0 — Destravar monetização (fazer em paralelo, começa a demorar)
- Criar página **Sobre** (o que é a mandinga, origem, ~meia página de texto real).
- Criar página **Política de Privacidade** (obrigatória para o AdSense; usar um gerador
  e adaptar; mencionar cookies do Google/anúncios).
- Opcional mas ajuda: página de conteúdo "As zicas mais famosas da Copa" (texto real
  = mais chance de aprovação e melhor SEO).
- Motivo: AdSense costuma **reprovar site de página única sem conteúdo**. Essas páginas
  são o que aumenta a chance de aprovação.

### P1 — Produção
- Comprar domínio (ex: `geladeiradazica.com.br`).
- Deploy em Netlify ou Cloudflare Pages (arrastar o HTML). Apontar o domínio.
- Adicionar `localStorage` para persistir a geladeira do usuário.
- Meta tags Open Graph + Twitter Card (título, descrição, imagem) para o link ficar
  bonito quando compartilhado no WhatsApp/Instagram/redes.
- Favicon.

### P2 — Melhorias de viralização
- Melhorar a imagem de compartilhamento (resolver o problema da neve; adicionar marca
  d'água discreta com a URL do site na foto, para levar tráfego de volta).
- Botão de compartilhar mais proeminente / call-to-action pós-congelamento.
- Contador global (quantos nomes já foram congelados no site todo) — precisa de backend
  simples ou serviço tipo Firebase/Supabase. Avaliar custo/benefício.

### P3 — Extras divertidos (nice to have)
- Um pinguim totalmente **congelado dentro de um bloco de gelo** (humor).
- Sons opcionais (batida do papel, ventinho gelado) com toggle de mudo.
- Efeito de "vapor gelado" saindo quando a geladeira abre / ao carregar a página.

---

## 7. Notas para AdSense (contexto de negócio)

- Começar o cadastro **cedo** — aprovação leva de dias a semanas.
- Site precisa estar no ar com **domínio próprio** (não aceita arquivo solto/link temporário).
- Anúncio de site de entretenimento/zoeira no Brasil paga pouco por clique; o retorno
  depende de **volume**. A viralização não é bônus, é o modelo de negócio.
- Onde colar o código: os dois `<div class="ad">` no HTML (topo e rodapé) e o comentário
  no `<head>`. Trocar o texto placeholder pela tag `<ins class="adsbygoogle">`.

---

## 8. Estrutura sugerida do repositório

```
/
├── index.html            (o site — atual geladeira-da-zica.html)
├── sobre.html            (a criar)
├── privacidade.html      (a criar)
├── zicas-famosas.html    (opcional, a criar)
├── assets/
│   ├── og-image.png      (imagem Open Graph)
│   └── favicon.png
└── spec.md               (este documento)
```

Sugestão: separar CSS/JS em arquivos próprios só se o arquivo único ficar difícil de
manter. Por enquanto o inline funciona e é mais rápido de deployar.
