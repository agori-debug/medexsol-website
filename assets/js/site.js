(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const ICON={
    arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.5L16 9.5"/></svg>'
  };
  const P=window.MX_PRODUCTS||[], PT=window.MX_PARTNERS||{}, AR=window.MX_AREAS||{};
  const byId=id=>P.find(p=>p.id===id);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header */
  const hdr=$('.hdr'); const onScroll=()=>hdr&&hdr.classList.toggle('scrolled',scrollY>8);
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* menu */
  const menu=$('#menu'), openBtn=$('.menu-btn'), closeBtn=$('.menu-close');
  function openMenu(){menu.classList.add('open');menu.setAttribute('aria-hidden','false');openBtn.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';
    $$('.menu-nav a',menu).forEach((a,i)=>a.style.animationDelay=(80+i*45)+'ms'); setTimeout(()=>closeBtn.focus(),50)}
  function closeMenu(){menu.classList.remove('open');menu.setAttribute('aria-hidden','true');openBtn.setAttribute('aria-expanded','false');document.body.style.overflow='';openBtn.focus()}
  openBtn&&openBtn.addEventListener('click',openMenu); closeBtn&&closeBtn.addEventListener('click',closeMenu);
  addEventListener('keydown',e=>{ if(e.key==='Escape'&&menu&&menu.classList.contains('open')) closeMenu();
    if(e.key==='Tab'&&menu&&menu.classList.contains('open')){const f=$$('a,button',menu);const first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()} else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});

  /* language toggle (Arabic version is a later phase) */
  $$('.lang button').forEach(b=>b.addEventListener('click',()=>{ if(b.dataset.lang==='ar'){ toast('The Arabic (RTL) version is planned for the next phase.'); }}));
  function toast(msg){let t=$('#toast'); if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');
      t.style.cssText='position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#171C55;color:#fff;padding:12px 20px;border-radius:999px;font-size:15px;z-index:99;transition:opacity .3s';document.body.appendChild(t)}
    t.textContent=msg;t.style.opacity=1;clearTimeout(t._h);t._h=setTimeout(()=>t.style.opacity=0,2600)}

  /* the one orchestrated moment: hero copy + orbit dot */
  $$('.reveal').forEach((el,i)=>setTimeout(()=>el.classList.add('in'),reduce?0:150+i*140));
  const orbit=$('.orbit'); if(orbit){const path=$('path',orbit),dot=$('circle',orbit);
    const L=path.getTotalLength(); const dur=2600; let t0=null;
    const place=f=>{const pt=path.getPointAtLength(L*f);dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y)};
    if(reduce){place(.62)} else {const step=ts=>{if(!t0)t0=ts;const k=Math.min(1,(ts-t0)/dur);const e=1-Math.pow(1-k,3);place(.08+e*.54);if(k<1)requestAnimationFrame(step)};setTimeout(()=>requestAnimationFrame(step),500)}}

  /* solutions panels */
  $$('.panels').forEach(wrap=>{const ps=$$('.panel',wrap);
    const act=p=>{ps.forEach(x=>{x.classList.toggle('active',x===p);x.setAttribute('aria-expanded',x===p)})};
    ps.forEach(p=>{p.addEventListener('mouseenter',()=>act(p));p.addEventListener('focusin',()=>act(p));
      p.addEventListener('click',e=>{ if(!p.classList.contains('active')){e.preventDefault();act(p)} })})});

  /* featured products switcher */
  const feat=$('.feat'); if(feat){const tabs=$$('[role=tab]',feat), stage=$('.feat-stage',feat);
    const show=id=>{const p=byId(id); if(!p)return; tabs.forEach(t=>t.setAttribute('aria-selected',t.dataset.id===id));
      const parts=$$('.feat-img img, .feat-info',stage); parts.forEach(x=>x.classList.add('fade-swap'));
      setTimeout(()=>{ $('.feat-img img',stage).src=p.img; $('.feat-img img',stage).alt=p.name+' — '+p.full;
        $('.feat-info .cat',stage).textContent=AR[p.area]; $('.feat-info h3',stage).textContent=p.name;
        $('.feat-info p',stage).textContent=p.desc; $('.feat-info .q',stage).href='contact.html#quote-'+p.id;
        $('.feat-info .d',stage).href='product.html#'+p.id; parts.forEach(x=>x.classList.remove('fade-swap'))},reduce?0:220)};
    tabs.forEach(t=>{t.addEventListener('mouseenter',()=>show(t.dataset.id));t.addEventListener('click',()=>show(t.dataset.id));
      t.addEventListener('keydown',e=>{const i=tabs.indexOf(t);if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const n=tabs[(i+(e.key==='ArrowDown'?1:-1)+tabs.length)%tabs.length];n.focus();show(n.dataset.id)}})});
    $$('.feat-img img, .feat-info',stage).forEach(x=>x.style.transition='opacity .3s, transform .4s');}

  /* product card */
  const approvalChip=p=>p.approval?`<span>${p.approval}</span>`:`<span class="tbc" title="Approval status to be confirmed by Medexsol">Approval status: TBC</span>`;
  const card=p=>`<article class="pcard" data-partner="${p.partner}" data-area="${p.area} ${p.area2||''}" data-type="${p.type}" data-q="${(p.name+' '+p.full+' '+p.short+' '+AR[p.area]).toLowerCase()}">
    <a class="img" href="product.html#${p.id}" aria-label="${p.name} details"><img src="${p.img}" alt="${p.name}"></a>
    <div class="body"><span class="cat">${AR[p.area]}</span><h4>${p.name}</h4><p>${p.full}</p>
    <div class="meta"><span>${p.type}</span>${approvalChip(p)}</div>
    <div class="acts"><a class="btn btn-primary btn-sm" href="contact.html#quote-${p.id}">Request a quote</a><a class="btn btn-ghost btn-sm" href="product.html#${p.id}">Details</a></div></div></article>`;
  $$('[data-products]').forEach(el=>{el.innerHTML=P.filter(p=>p.partner===el.dataset.products).map(card).join('')});

  /* catalog filters */
  const fbar=$('.filters'); if(fbar){const state={partner:'all',area:'all',type:'all',q:''};
    const apply=()=>{let shown=0;$$('.pgroup').forEach(g=>{let n=0;$$('.pcard',g).forEach(c=>{const ok=(state.partner==='all'||c.dataset.partner===state.partner)&&(state.area==='all'||c.dataset.area.split(' ').includes(state.area))&&(state.type==='all'||c.dataset.type===state.type)&&(!state.q||c.dataset.q.includes(state.q));c.hidden=!ok;if(ok)n++});
        const isSvc=g.dataset.kind==='service', isSoon=g.dataset.kind==='soon';
        let vis=n>0; if(isSvc) vis=(state.partner==='all'||state.partner==='pulse')&&(state.area==='all'||state.area==='research')&&(state.type==='all'||state.type==='Services')&&(!state.q||'core lab research services imaging analysis'.includes(state.q)||state.q.split(' ').some(w=>w&&'core lab research services imaging analysis validation'.includes(w)));
        if(isSoon) vis=(state.partner==='all'||state.partner==='microport')&&state.area==='all'&&state.type==='all'&&!state.q;
        g.hidden=!vis; if(vis)shown++});
      $('.empty').style.display=shown?'none':'block'};
    $$('.fchip',fbar).forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.k;state[k]=b.dataset.v;$$(`.fchip[data-k=${k}]`,fbar).forEach(x=>x.setAttribute('aria-pressed',x===b));apply()}));
    $$('.fsel',fbar).forEach(s=>s.addEventListener('change',()=>{state[s.dataset.k]=s.value;apply()}));
    $('.search input',fbar).addEventListener('input',e=>{state.q=e.target.value.trim().toLowerCase();apply()});
    $$('[data-area-jump]').forEach(b=>b.addEventListener('click',()=>{const s=$('.fsel[data-k=area]');s.value=b.dataset.areaJump;state.area=s.value;apply();$('#catalog').scrollIntoView({behavior:reduce?'auto':'smooth'})}));
    const reset=$('.empty button'); reset&&reset.addEventListener('click',()=>{location.reload()});
    if(location.hash&&AR[location.hash.slice(1)]){const s=$('.fsel[data-k=area]');s.value=location.hash.slice(1);state.area=s.value;apply();setTimeout(()=>$('#catalog').scrollIntoView(),60)}
  }

  /* product detail */
  const pd=$('#pd'); if(pd){
    let cur=null; const render=()=>{const hid=location.hash.slice(1); if(cur&&!byId(hid))return; const p=byId(hid)||P[0]; cur=p.id; const pt=PT[p.partner];
      document.title=`${p.name} ${p.full} | Medexsol`;
      $('#pd-crumb-partner').textContent=pt.name; $('#pd-crumb-name').textContent=p.name;
      $('#pd-cat').textContent=`${AR[p.area]} · ${pt.name}`.replace(' · ',' — ');
      $('#pd-name').innerHTML=`${p.name}<span class="l">${p.full}</span>`;
      $('#pd-desc').textContent=p.desc;
      $('#pd-meta').innerHTML=`<span>${p.type}</span>${approvalChip(p)}`;
      $('#pd-img').src=p.img; $('#pd-img').alt=p.name;
      
      $('#pd-features').innerHTML=p.features.map(f=>`<li>${ICON.check}<span>${f}</span></li>`).join('');
      $('#pd-feat-title').innerHTML=`Why clinicians choose<span class="l">${p.name}</span>`;
      $('#pd-how').textContent=p.how; $('#pd-clinical').textContent=p.clinical; $('#pd-clin-title').innerHTML=p.clinicalTitle.replace(/^(\S+\s\S+)/,'$1<span class="l">')+'</span>';
      $('#pd-services').innerHTML=p.services.map(s=>`<div>${ICON.check}${s}</div>`).join('');
      $('#pd-spec').innerHTML=[['Product',p.name+' — '+p.full],['Manufacturer',pt.name+' ('+pt.country+')'],['Clinical area',AR[p.area]+(p.area2?', '+AR[p.area2]:'')],['Product type',p.type],['Regulatory approvals',p.approval||'<span class="ph-note">To be confirmed per product</span>'],['Local support','Medexsol, Riyadh & Jeddah']].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
      $('#pd-product').innerHTML=P.map(x=>`<option ${x.id===p.id?'selected':''}>${x.name}</option>`).join('');
      $('#pd-related').innerHTML=p.related.map(byId).map(card).join('');
      const pcard=$('#pd-partner'); pcard.querySelector('img').src=pt.logo; pcard.querySelector('img').alt=pt.name; pcard.querySelector('p').textContent=pt.desc;
      scrollTo(0,0)};
    render(); addEventListener('hashchange',render);
    [['#pd-quote','Quotation'],['#pd-demo','Product demo']].forEach(([sel,v])=>$(sel).addEventListener('click',e=>{e.preventDefault();const r=$(`#request input[value="${v}"]`);r&&(r.checked=true);$('#request').scrollIntoView({behavior:reduce?'auto':'smooth'})}));
    const tabs=$$('.pd-tabs a'); const secs=tabs.map(t=>$(t.getAttribute('href')));
    tabs.forEach(t=>t.addEventListener('click',e=>{e.preventDefault();$(t.getAttribute('href')).scrollIntoView({behavior:reduce?'auto':'smooth'})}));
    addEventListener('scroll',()=>{let i=0;secs.forEach((s,k)=>{if(s.getBoundingClientRect().top<200)i=k});tabs.forEach((t,k)=>t.classList.toggle('on',k===i))},{passive:true});
  }

  /* forms: validation + confirmation (no backend in preview) */
  $$('form.form').forEach(f=>{f.setAttribute('novalidate','');
    f.addEventListener('submit',e=>{e.preventDefault();let ok=true;
      $$('[required]',f).forEach(inp=>{const fld=inp.closest('.field')||inp.closest('.consent');let v=inp.type==='checkbox'?inp.checked:inp.value.trim();
        if(v&&inp.type==='email')v=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value);
        fld&&fld.classList.toggle('err',!v); if(!v)ok=false});
      if(!ok){const first=$('.err input, .err select, .err textarea',f);first&&first.focus();return}
      const done=f.nextElementSibling; const nm=(f.querySelector('[name=name]')||{}).value||'';
      if(done){const h=$('h3',done);h&&(h.textContent=`Thank you${nm?', '+nm.split(' ')[0]:''}. Your request is ready to send.`)}
      f.classList.add('sent'); done&&done.setAttribute('tabindex','-1'); done&&done.focus()});
    $$('input,select,textarea',f).forEach(i=>i.addEventListener('input',()=>{const fld=i.closest('.field')||i.closest('.consent');fld&&fld.classList.remove('err')}))});

  /* contact prefill from #partner, #quote, #demo, #quote-<product> */
  const cf=$('#contact-form'); if(cf){const pre=()=>{const h=location.hash.slice(1); if(!h)return; const typeSel=$('[name=type]',cf), whoInputs=$$('[name=who]',cf);
      const set=(who,type)=>{whoInputs.forEach(r=>r.checked=r.value===who);typeSel.value=type};
      if(h==='partner')set('manufacturer','Partnership'); else if(h==='demo')set('provider','Product demo'); else if(h.startsWith('quote')){set('provider','Product quote');const p=byId(h.split('-')[1]);if(p)$('[name=subject]',cf).value='Quote request: '+p.name}
      $('#form-anchor').scrollIntoView()}; pre(); addEventListener('hashchange',pre)}
})();
