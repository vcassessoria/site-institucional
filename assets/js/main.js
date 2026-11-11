/* VC Assessoria Financeira — interações do site (JavaScript puro, sem dependências) */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktopMQ = window.matchMedia('(min-width: 1024px)');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- Ano no rodapé ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Links de WhatsApp: sempre em nova aba ---------- */
  $$('[data-wa]').forEach(function (a) {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });

  /* ---------- Cabeçalho ---------- */
  var header = $('[data-header]');
  var themed = $$('[data-theme]').filter(function (el) { return !el.closest('.footer') || el.classList.contains('footer'); });
  var navLinks = $$('.nav__list a');
  var navTargets = navLinks.map(function (a) { return $(a.getAttribute('href')); });
  var lastY = window.scrollY;

  function updateHeader() {
    var y = window.scrollY;
    var probe = 36;

    header.classList.toggle('is-scrolled', y > 24);

    if (!doc.classList.contains('menu-open')) {
      var goingDown = y > lastY + 4;
      var goingUp = y < lastY - 4;
      if (goingDown && y > 640) header.classList.add('is-hidden');
      else if (goingUp || y < 200) header.classList.remove('is-hidden');
    }
    lastY = y;

    // Tom do cabeçalho conforme a seção que está por baixo
    var tone = 'dark';
    for (var i = 0; i < themed.length; i++) {
      var r = themed[i].getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) { tone = themed[i].getAttribute('data-theme'); }
    }
    header.setAttribute('data-tone', tone);

    // Item ativo da navegação
    var mid = window.innerHeight * 0.35;
    navLinks.forEach(function (a, i) {
      var t = navTargets[i];
      if (!t) return;
      var rr = t.getBoundingClientRect();
      if (rr.top <= mid && rr.bottom > mid) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  /* ---------- Menu mobile ---------- */
  var toggle = $('[data-menu-toggle]');
  var menu = $('[data-menu]');
  if (menu) menu.removeAttribute('hidden');

  function setMenu(open) {
    doc.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Fechar menu' : 'Abrir menu';
    menu.setAttribute('aria-hidden', String(!open));
    if (open) {
      header.classList.remove('is-hidden');
      var first = menu.querySelector('a');
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 60);
    }
  }
  if (toggle && menu) {
    menu.setAttribute('aria-hidden', 'true');
    toggle.addEventListener('click', function () { setMenu(!doc.classList.contains('menu-open')); });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (!doc.classList.contains('menu-open')) return;
      if (e.key === 'Escape') { setMenu(false); toggle.focus(); }
      if (e.key === 'Tab') {
        var f = [toggle].concat($$('a', menu));
        var idx = f.indexOf(document.activeElement);
        if (e.shiftKey && idx <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && idx === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    desktopMQ.addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ---------- Animações de entrada ---------- */
  var reveals = $$('.reveal');
  reveals.forEach(function (el) {
    var sibs = $$(':scope > .reveal', el.parentElement);
    var i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', Math.min(i * 0.08, 0.4) + 's');
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Lista de dores: destaque da frase em foco ---------- */
  var pains = $('[data-pains]');
  var painItems = pains ? $$('.pains__item', pains) : [];
  function updatePains() {
    if (!pains) return;
    var r = pains.getBoundingClientRect();
    var vh = window.innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    pains.setAttribute('data-active', '');
    var focus = vh * 0.55, best = 0, bestD = Infinity;
    painItems.forEach(function (li, i) {
      var b = li.getBoundingClientRect();
      var d = Math.abs((b.top + b.bottom) / 2 - focus);
      if (d < bestD) { bestD = d; best = i; }
    });
    painItems.forEach(function (li, i) { li.classList.toggle('is-active', i === best); });
  }

  /* ---------- Metodologia: ativação progressiva das 5 etapas ---------- */
  var method = $('[data-method]');
  var steps = method ? $$('.step', method) : [];
  var progress = method ? $('[data-progress]', method) : null;
  var railWrap = method ? $('.steps-wrap', method) : null;
  var pinned = false;
  var rowPlayed = false;
  var rowTimer = null;

  // Fixa a seção (rolagem controlada) só no desktop e quando todo o conteúdo cabe na tela.
  function canPin() {
    if (!desktopMQ.matches || reduceMotion.matches) return false;
    method.classList.add('method--pinned');
    var needed = $('.method__inner', method).offsetHeight + 64;
    method.classList.remove('method--pinned');
    return needed <= window.innerHeight;
  }
  function mode() {
    if (pinned) return 'pin';
    return desktopMQ.matches ? 'row' : 'col';
  }
  function setupMethod() {
    if (!method) return;
    pinned = canPin();
    method.classList.toggle('method--pinned', pinned);
    if (mode() === 'row' && reduceMotion.matches) {
      method.removeAttribute('data-ready');
      setActive(steps.length - 1, 1);
      return;
    }
    method.setAttribute('data-ready', '');
    if (mode() === 'row' && !rowPlayed) setActive(0, 0);
    updateMethod();
  }
  // Desktop sem espaço para fixar: as etapas acendem em sequência quando entram na tela.
  function playRow() {
    if (rowPlayed) return;
    rowPlayed = true;
    var i = 0;
    setActive(0, 0);
    rowTimer = setInterval(function () {
      i++;
      if (i >= steps.length) { clearInterval(rowTimer); rowTimer = null; return; }
      setActive(i, i / (steps.length - 1));
    }, 900);
  }
  function setActive(idx, railP) {
    steps.forEach(function (s, i) {
      s.classList.toggle('is-active', i === idx);
      s.classList.toggle('is-done', i < idx);
      var btn = s.querySelector('.step__node');
      if (i === idx) btn.setAttribute('aria-current', 'step'); else btn.removeAttribute('aria-current');
    });
    if (progress) progress.style.setProperty('--p', railP.toFixed(4));
  }
  function updateMethod() {
    if (!method) return;
    var vh = window.innerHeight;
    if (mode() === 'row') {
      if (reduceMotion.matches) return;
      var wr0 = railWrap.getBoundingClientRect();
      if (rowPlayed) { if (!rowTimer) setActive(steps.length - 1, 1); return; }
      if (wr0.top < vh * 0.7 && wr0.bottom > 0) playRow();
      return;
    }
    if (rowTimer) { clearInterval(rowTimer); rowTimer = null; }
    if (pinned) {
      var r = method.getBoundingClientRect();
      var total = r.height - vh;
      var p = clamp(-r.top / total, 0, 1);
      var idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
      var railP = clamp((p * steps.length - 0.5) / (steps.length - 1), 0, 1);
      setActive(idx, railP);
    } else {
      var line = vh * 0.6, act = -1;
      steps.forEach(function (s, i) {
        if (s.getBoundingClientRect().top < line) act = i;
      });
      var wr = railWrap.getBoundingClientRect();
      var first = steps[0].getBoundingClientRect().top;
      var last = steps[steps.length - 1].getBoundingClientRect().top;
      var rp = clamp((line - first) / Math.max(1, last - first), 0, 1);
      if (wr.top > vh) rp = 0;
      setActive(Math.max(0, act), act < 0 ? 0 : rp);
    }
  }
  if (method) {
    $$('[data-step-jump]', method).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = Number(btn.getAttribute('data-step-jump'));
        var behavior = reduceMotion.matches ? 'auto' : 'smooth';
        if (pinned) {
          var top = method.getBoundingClientRect().top + window.scrollY;
          var total = method.offsetHeight - window.innerHeight;
          window.scrollTo({ top: top + total * ((i + 0.5) / steps.length), behavior: behavior });
        } else {
          steps[i].scrollIntoView({ block: 'center', behavior: behavior });
        }
      });
    });
  }

  /* ---------- Números dos casos (contagem) ---------- */
  var counters = $$('[data-count]');
  function countUp(el) {
    var target = Number(el.getAttribute('data-count'));
    if (reduceMotion.matches) { el.textContent = target; return; }
    var start = null, dur = 1700;
    function frame(t) {
      if (!start) start = t;
      var k = clamp((t - start) / dur, 0, 1);
      var eased = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(target * eased);
      if (k < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Parallax discreto da foto principal (desktop) ---------- */
  var heroImg = $('[data-parallax]');
  var hero = $('.hero');
  function updateParallax() {
    if (!heroImg || reduceMotion.matches || !desktopMQ.matches) { if (heroImg) heroImg.style.transform = ''; return; }
    var y = window.scrollY;
    if (y > hero.offsetHeight) return;
    heroImg.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(1) + 'px,0) scale(1.04)';
  }

  /* ---------- WhatsApp flutuante / barra mobile ---------- */
  var waFloat = $('[data-wa-float]');
  var waBar = $('[data-wa-bar]');
  var finalSec = $('[data-final]');
  var footer = $('.footer');
  function updateWA() {
    var vh = window.innerHeight;
    var pastHero = hero.getBoundingClientRect().bottom < vh * 0.35;
    var fr = finalSec.getBoundingClientRect();
    var ftr = footer.getBoundingClientRect();
    var nearEnd = fr.top < vh * 0.85 || ftr.top < vh;
    var show = pastHero && !nearEnd && !doc.classList.contains('menu-open');
    if (waFloat) waFloat.classList.toggle('is-visible', show);
    if (waBar) waBar.classList.toggle('is-visible', show);
  }

  /* ---------- Loop de rolagem ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateHeader();
      updatePains();
      updateMethod();
      updateParallax();
      updateWA();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { setupMethod(); onScroll(); });
  reduceMotion.addEventListener('change', function () { setupMethod(); onScroll(); });

  setupMethod();
  updateHeader();
  updatePains();
  updateWA();
})();
