# VC Assessoria Financeira: site institucional

Site de página única da VC Assessoria Financeira (consultoria e assessoria financeira e tributária para pequenas e médias empresas, Itajubá/MG).

- **Tecnologia:** HTML5, CSS3 e JavaScript puro. Sem build, sem backend, sem dependências para instalar.
- **Hospedagem:** GitHub Pages, em repositório próprio (`site-institucional`).
- **Endereço esperado:** https://vcassessoria.github.io/site-institucional/

> **Importante:** este repositório é independente do diagnóstico da Reforma Tributária
> (https://vcassessoria.github.io/diagnostico-reforma/). Nenhum arquivo daquele projeto foi copiado,
> alterado ou referenciado além de um link no rodapé. Nunca publique este site dentro do repositório
> `diagnostico-reforma`.

---

## 1. Estrutura

```
site-institucional/
├── index.html                  Página única (conteúdo, SEO, dados estruturados)
├── assets/
│   ├── css/style.css           Todo o visual (paleta, tipografia, seções, responsivo)
│   ├── js/main.js              Interações (cabeçalho, menu, animações, método, WhatsApp)
│   ├── images/                 Fotos em WebP, imagem de compartilhamento e ícone
│   └── favicon.svg             Ícone do navegador
├── robots.txt
├── sitemap.xml
├── .nojekyll                   Faz o GitHub Pages servir os arquivos como estão
├── .github/workflows/deploy.yml Publicação automática no GitHub Pages
└── README.md
```

Todos os caminhos são **relativos** (`assets/...`), por isso o site funciona tanto em
`usuario.github.io/site-institucional/` quanto num domínio próprio, sem ajustes.

### Fotografias

| Arquivo | Uso | Original |
|---|---|---|
| `victor-costa-hero-560/853.webp` | Hero (camisa azul-marinho, em pé) | `WhatsApp Image ... (4).jpeg` |
| `victor-costa-retrato-480/772.webp` | Sobre (camisa branca) | `... (10).jpeg` |
| `victor-costa-trabalho-recorte-400/640.webp` | Sobre, imagem complementar (à mesa) | `... (8).jpeg`, recortado |
| `victor-costa-atendimento-640.webp` | Perguntas frequentes (desktop) | `... (6).jpeg` |
| `victor-costa-conversa-480/760.webp` | Chamada final (ao telefone) | `... (7).jpeg` |
| `og-vc-assessoria.jpg` | Prévia ao compartilhar o link (1200×630) | composição com a foto (4) |
| `apple-touch-icon.png` | Ícone ao salvar na tela do celular | |

As fotos não foram retocadas: só redimensionadas e convertidas para WebP (qualidade 84).
Os originais recebidos tinham resolução máxima de 853×1280 px. Se houver arquivos em resolução
maior, vale gerar novas versões (por exemplo em https://squoosh.app) mantendo os mesmos nomes.

---

## 2. Rodar localmente

O site é estático; basta servir a pasta. Escolha uma opção:

- **VS Code:** instale a extensão *Live Server*, abra a pasta e clique em *Go Live*.
- **Python** (se instalado): `python -m http.server 8000` dentro da pasta e acesse http://localhost:8000
- **Node** (se instalado): `npx serve .` dentro da pasta.

Abrir o `index.html` com duplo clique também funciona, mas algumas coisas (fontes, alguns navegadores)
se comportam melhor com um servidor local.

---

## 3. Criar o repositório no GitHub

Faça isso **logado na conta onde está o diagnóstico** (`vcassessoria`), mas em um **repositório novo**.

1. Acesse https://github.com/new
2. **Repository name:** `site-institucional`
3. Visibilidade: **Public** (o GitHub Pages gratuito exige repositório público).
4. **Não** marque "Add a README" nem outros arquivos. Clique em **Create repository**.
5. Confira na barra de endereço que está em `github.com/vcassessoria/site-institucional`
   e **não** em `diagnostico-reforma`.

### Enviar os arquivos

**Opção A: pelo navegador (sem instalar nada)**

1. Na página do repositório vazio, clique em **uploading an existing file**.
2. Arraste **o conteúdo** da pasta `site-institucional` (não a pasta em si): `index.html`, `assets`,
   `README.md`, `robots.txt`, `sitemap.xml`.
3. Clique em **Commit changes**.
4. O upload pelo navegador ignora pastas ocultas (`.github` e `.nojekyll`). Crie-as assim:
   - **Add file → Create new file**, nome `.github/workflows/deploy.yml`, cole o conteúdo do arquivo
     local `deploy.yml` e faça o commit.
   - **Add file → Create new file**, nome `.nojekyll`, deixe vazio e faça o commit.

**Opção B: GitHub Desktop** (recomendado para manutenção)

1. Instale em https://desktop.github.com e entre com a conta.
2. **File → Add local repository**, escolha a pasta `site-institucional`. Ele vai oferecer
   "create a repository": aceite, com o nome `site-institucional`.
3. **Publish repository** (desmarque "Keep this code private").

**Opção C: linha de comando (Git)**

```bash
cd site-institucional
git init -b main
git add .
git commit -m "Site institucional VC Assessoria Financeira"
git remote add origin https://github.com/vcassessoria/site-institucional.git
git push -u origin main
```

---

## 4. Publicar no GitHub Pages

1. No repositório `site-institucional`, vá em **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions**.
3. Vá na aba **Actions**: o fluxo "Publicar no GitHub Pages" roda a cada envio para a branch `main`.
   Se ainda não rodou, abra o fluxo e clique em **Run workflow**.
4. Em 1 a 2 minutos o site fica disponível em:

   **https://vcassessoria.github.io/site-institucional/**

> Alternativa sem Actions: em **Source**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
> Funciona igual, porque o site não tem etapa de build.

### Se a conta do GitHub tiver outro nome

Os endereços absolutos (usados só para SEO e compartilhamento) assumem `vcassessoria.github.io`.
Se o usuário for outro, substitua `https://vcassessoria.github.io/site-institucional/` pelo endereço real em:
`index.html` (canonical, Open Graph e dados estruturados), `sitemap.xml` e `robots.txt`.
O funcionamento do site não depende disso.

### Domínio próprio (opcional, no futuro)

Em **Settings → Pages → Custom domain**, informe o domínio e configure o DNS conforme a
documentação do GitHub. Depois, troque os endereços absolutos citados acima pelo novo domínio.

---

## 5. Manutenção

### WhatsApp
Todos os botões de conversão usam o mesmo link, já com a mensagem inicial:

```
https://wa.me/5535984257353?text=Ol%C3%A1%2C%20Victor%21%20Acessei%20o%20site%20da%20VC%20Assessoria%20e%20gostaria%20de%20conversar%20sobre%20a%20gest%C3%A3o%20financeira%20e%20tribut%C3%A1ria%20da%20minha%20empresa.
```

Para trocar número ou mensagem, use *Localizar e substituir* no `index.html` (todas as ocorrências
têm o atributo `data-wa`). Para gerar a mensagem codificada: https://www.urlencoder.org

### Logotipo
O cabeçalho e o rodapé usam uma assinatura tipográfica provisória (`VC.` | Assessoria Financeira).
Quando o logotipo vetorial for aprovado:

1. Salve os arquivos como `assets/images/logo-vc-claro.svg` (para fundos escuros) e
   `assets/images/logo-vc-escuro.svg` (para fundos claros).
2. No `index.html`, dentro de cada `<a class="brand">`, troque os três `<span>` por:
   ```html
   <img class="brand__logo" src="assets/images/logo-vc-claro.svg" alt="VC Assessoria Financeira" width="160" height="32">
   ```
3. Atualize também `assets/favicon.svg` e `assets/images/apple-touch-icon.png`.

A classe `.brand__logo` já existe no CSS (altura de 32 px).

### Textos
Todo o conteúdo está no `index.html`, separado por comentários (`01 HERO`, `02 O PROBLEMA`...).
As perguntas frequentes aparecem duas vezes: no HTML visível e no bloco `FAQPage` dos dados
estruturados, no topo do arquivo. Ao alterar uma resposta, altere as duas.

### Resultados
Os números dos casos ficam no atributo `data-count` e no texto (`155`, `104`). Ao incluir um novo
caso, mantenha a observação de que resultados não são promessa.

### Cores e fontes
As variáveis estão no início do `style.css` (`--petrol`, `--forest`, `--lum`, `--ivory`, `--ink`).
O verde luminoso deve continuar como ponto de luz: botões, linhas e uma palavra de destaque.

### Animações
Todas respeitam a preferência do sistema por movimento reduzido. A seção do método fica fixada
durante a rolagem apenas em telas de desktop onde todo o conteúdo cabe na altura; nas demais, as
etapas acendem em sequência (desktop) ou conforme a rolagem (tablet e celular).

---

## 6. Checklist após publicar

- [ ] O endereço https://vcassessoria.github.io/site-institucional/ abre o site.
- [ ] O diagnóstico https://vcassessoria.github.io/diagnostico-reforma/?src=bio continua abrindo normalmente.
- [ ] Todas as fotos carregam (hero, sobre, perguntas, chamada final).
- [ ] Os botões "Conversar com Victor" abrem o WhatsApp com a mensagem pronta (testar no celular e no computador).
- [ ] O menu do celular abre, fecha e leva para cada seção.
- [ ] A barra de WhatsApp aparece no celular depois do topo e some perto da chamada final.
- [ ] Os links do rodapé (Instagram, WhatsApp e diagnóstico) abrem em nova aba.
- [ ] A seção "Como funciona" acende as cinco etapas ao rolar.
- [ ] Não há rolagem lateral no celular.
- [ ] Ao colar o link no WhatsApp, aparece a prévia com foto e título (o WhatsApp pode levar algumas horas para atualizar o cache).
- [ ] Teste de desempenho em https://pagespeed.web.dev
- [ ] Cadastre o site no Google Search Console e envie o `sitemap.xml`.
- [ ] Atualize o link da bio do Instagram para o novo endereço.

---

## 7. Pontos para decisão do Victor

- **"Mais de 4 anos de experiência":** o texto foi mantido conforme o briefing. O documento de
  posicionamento registra esse número como ponto em aberto (cerca de 3 anos e 8 meses até mar/2026).
  Se mudar, ajuste a seção Sobre (dois lugares no `index.html`).
- **Logotipo definitivo:** ver seção "Logotipo" acima.
