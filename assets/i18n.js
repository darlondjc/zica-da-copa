/* Seletor de idioma compartilhado entre index.html, sobre.html e privacidade.html.
   Detecta o idioma do navegador (pt/en/es/de/fr) e permite trocar manualmente,
   guardando a escolha no localStorage pra valer em todas as páginas. */
(function(){
  const LOCALES=['pt','en','es','de','fr'];
  const FLAGS={pt:'🇧🇷',en:'🇺🇸',es:'🇪🇸',de:'🇩🇪',fr:'🇫🇷'};
  const NAMES={pt:'Português',en:'English',es:'Español',de:'Deutsch',fr:'Français'};
  const KEY='zicaLocale';

  function detectLocale(){
    const saved=localStorage.getItem(KEY);
    if(saved&&LOCALES.includes(saved))return saved;
    const langs=(navigator.languages&&navigator.languages.length)?navigator.languages:[navigator.language||'pt-BR'];
    for(const l of langs){const p=l.slice(0,2).toLowerCase();if(LOCALES.includes(p))return p;}
    return 'pt';
  }
  function setLocale(loc){localStorage.setItem(KEY,loc);location.reload();}

  const style=document.createElement('style');
  style.textContent=`
    .lang-switch{position:fixed;top:14px;right:14px;z-index:60;font-family:'Inter',system-ui,sans-serif}
    .lang-switch__btn{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.08);color:#cdeef2;
      border:1px solid rgba(205,238,242,.28);border-radius:100px;padding:6px 12px;font-size:14px;font-weight:700;
      letter-spacing:.02em;cursor:pointer;backdrop-filter:blur(4px)}
    .lang-switch__btn:hover{background:rgba(255,255,255,.16)}
    .lang-switch__btn .flag{font-size:16px;line-height:1}
    .lang-switch__menu{position:absolute;top:calc(100% + 6px);right:0;background:#0f4c58;border:1px solid rgba(205,238,242,.28);
      border-radius:12px;padding:6px;min-width:150px;box-shadow:0 12px 30px rgba(0,0,0,.4);display:none;flex-direction:column;gap:2px}
    .lang-switch.open .lang-switch__menu{display:flex}
    .lang-switch__menu button{display:flex;align-items:center;gap:8px;background:none;border:none;color:#cdeef2;
      text-align:left;padding:8px 10px;border-radius:8px;font-size:13px;cursor:pointer;font-weight:600}
    .lang-switch__menu button .flag{font-size:16px;line-height:1}
    .lang-switch__menu button:hover{background:rgba(255,255,255,.1)}
    .lang-switch__menu button[aria-current="true"]{color:#fff;background:rgba(255,255,255,.1)}
    @media(max-width:480px){.lang-switch{top:10px;right:10px}.lang-switch__btn{padding:6px 11px;font-size:11px}}
  `;
  document.head.appendChild(style);

  function buildSwitcher(current){
    const wrap=document.createElement('div');wrap.className='lang-switch';
    const btn=document.createElement('button');
    btn.type='button';btn.className='lang-switch__btn';
    btn.setAttribute('aria-haspopup','true');btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-label','Idioma / Language');
    btn.innerHTML=`<span class="flag">${FLAGS[current]}</span> ▾`;
    const menu=document.createElement('div');menu.className='lang-switch__menu';menu.setAttribute('role','menu');
    LOCALES.forEach(loc=>{
      const b=document.createElement('button');
      b.type='button';b.setAttribute('role','menuitem');
      b.innerHTML=`<span class="flag">${FLAGS[loc]}</span> ${NAMES[loc]}`;
      if(loc===current)b.setAttribute('aria-current','true');
      b.addEventListener('click',()=>setLocale(loc));
      menu.appendChild(b);
    });
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      const open=wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded',open?'true':'false');
    });
    document.addEventListener('click',()=>{wrap.classList.remove('open');btn.setAttribute('aria-expanded','false');});
    wrap.appendChild(btn);wrap.appendChild(menu);
    return wrap;
  }

  window.ZicaI18N={detectLocale,setLocale,buildSwitcher,LOCALES};
})();
