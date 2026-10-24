import { projectMedia } from './project-media.js?v=089cf3ae24ee';
const icon = (name) => `<svg aria-hidden="true"><use href="#${name}"/></svg>`;
const categories = [
  {id:'park', title:'Аквапарки', image:'/images/waterpark.png', media:projectMedia.park},
  {id:'public', title:'Общественные бассейны', image:'/images/projects/public-01.jpg', media:projectMedia.public},
  {id:'private', title:'Частные бассейны', image:'/images/private-pool.jpg', groups:[{id:'composite',title:'Композитные бассейны',cover:'/images/composite-cover.png',media:[
    {src:'/images/composite-1.png',title:'Прямоугольная чаша с широкими ступенями'},
    {src:'/images/composite-2.png',title:'Чаша с полукруглой лестницей'},
    {src:'/images/composite-3.png',title:'Бассейн с террасой в саду'},
    {src:'/images/composite-4.png',title:'Овальная чаша с зоной отдыха'},
    {src:'/images/composite-models.png',title:'Схема моделей и размеров композитных бассейнов',layout:'wide'}
  ]},{id:'concrete',title:'Бетонные бассейны',media:projectMedia.concrete}]},
  {id:'fountains',title:'Городские фонтаны',image:'/images/projects/fountains-04-poster.jpg',media:projectMedia.fountains},
  {id:'plunge',title:'Купели',image:'/images/projects/plunge-01.jpg',media:projectMedia.plunge},
  {id:'sauna',title:'Модульные Бани',image:'/images/projects/sauna-03.jpg',media:projectMedia.sauna}
];
const cover = (image, title, symbol='drop') => image
  ? `<img src="${image}" alt="${title}" loading="lazy" width="700" height="470">`
  : `<span class="category-symbol" aria-hidden="true">${icon(symbol)}</span>`;
const grid = document.querySelector('#project-grid');
grid.innerHTML=categories.map(c=>`<article class="project-card"><a class="project-image" href="#projects/${c.id}" aria-label="Смотреть примеры: ${c.title}">${cover(c.image,c.title,c.symbol)}</a><div class="project-content"><h3><a href="#projects/${c.id}">${c.title}</a></h3><a class="project-link" href="#projects/${c.id}">Смотреть примеры ${icon('arrow')}</a></div></article>`).join('');
document.querySelector('#filter-status').textContent=`Направлений проектов: ${categories.length}`;
const detailDialog=document.querySelector('#detail-dialog');
const quoteDialog=document.querySelector('#quote-dialog');
const form=document.querySelector('#quote-form');
const result=document.querySelector('#quote-result');
const detailContent=document.querySelector('#detail-content');
function openQuote(type){
  if(detailDialog.open)detailDialog.close();
  form.hidden=false;result.hidden=true;
  if(type)form.elements.type.value=[...form.elements.type.options].some(option=>option.value===type)?type:'Общественный бассейн';
  quoteDialog.showModal();
}
document.querySelectorAll('[data-quote]').forEach(b=>b.addEventListener('click',()=>openQuote()));
document.querySelector('#company-details').addEventListener('click',()=>{
  detailContent.innerHTML=`<div class="detail-body" style="padding-top:48px"><p class="eyebrow">АКВАСПЕКТР / ДАГЕСТАН</p><h2 id="detail-title">Один партнёр.<br>Полный цикл работ.</h2><p>Помогаем пройти весь путь от первой идеи до готового бассейна. Работаем с частными и коммерческими пространствами в Дагестане и по всему Югу России.</p><ul class="detail-features"><li>${icon('check')}Обсуждаем задачи, участок и пожелания</li><li>${icon('check')}Готовим проект и подбираем оборудование</li><li>${icon('check')}Строим, монтируем и запускаем системы</li><li>${icon('check')}Обеспечиваем сервисное обслуживание</li></ul><button class="button button-blue" id="company-quote">Обсудить ваш проект ${icon('arrow')}</button></div>`;
  document.querySelector('#company-quote').addEventListener('click',()=>openQuote());detailDialog.showModal();
});
document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
});
let brief='';
form.addEventListener('submit',event=>{
  event.preventDefault();const data=new FormData(form);
  const location=String(data.get('location')).trim();
  if(!location){form.elements.location.setCustomValidity('Укажите город или населённый пункт');form.elements.location.reportValidity();return;}
  const dimensions=data.get('length')&&data.get('width')?`${data.get('length')} × ${data.get('width')} м`:'Уточнить при консультации';
  brief=`АКВАСПЕКТР — описание проекта\n\nТип: ${data.get('type')}\nРазмеры: ${dimensions}\nМестоположение: ${location}\nПожелания: ${String(data.get('notes')).trim()||'Обсудить со специалистом'}\n\nТелефоны для консультации: +7 (928) 987 97 07, +7 (988) 637 97 77\nСтоимость рассчитывается после уточнения проекта.`;
  result.innerHTML=`<span class="result-icon">${icon('check')}</span><h3>Ваш проект готов к обсуждению</h3><p>Сохраните описание и позвоните нам для консультации. Заявка автоматически не отправляется.</p><div class="brief-summary"></div><div class="result-actions"><button class="button button-blue" id="download-brief">Скачать описание ${icon('arrow')}</button><button class="button" type="button" data-phones>${icon('phone')} Позвонить</button></div><button class="text-button" id="edit-brief">Изменить описание</button>`;
  result.querySelector('.brief-summary').textContent=`${data.get('type')}\n${dimensions}\n${location}`;
  form.hidden=true;result.hidden=false;
  document.querySelector('#download-brief').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['\uFEFF'+brief],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Акваспектр — мой проект.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  document.querySelector('#edit-brief').addEventListener('click',()=>{result.hidden=true;form.hidden=false;form.elements.type.focus();});
  quoteDialog.scrollTo({top:0});document.querySelector('#download-brief').focus({preventScroll:true});
});
form.elements.location.addEventListener('input',()=>form.elements.location.setCustomValidity(''));
const menuButton=document.querySelector('.menu-toggle');const mobileNav=document.querySelector('#mobile-nav');
function closeMenu(){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');}
menuButton.addEventListener('click',()=>{const expanded=menuButton.getAttribute('aria-expanded')==='true';mobileNav.hidden=expanded;menuButton.setAttribute('aria-expanded',String(!expanded));menuButton.setAttribute('aria-label',expanded?'Открыть меню':'Закрыть меню');});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){closeMenu();menuButton.focus();}});
window.matchMedia('(min-width:901px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
document.querySelector('#year').textContent=new Date().getFullYear();
const phoneDialog = document.querySelector('#phone-dialog');
const copyStatus = document.querySelector('#phone-copy-status');
document.addEventListener('click', async (event) => {
  if (event.target.closest('[data-phones]')) {
    closeMenu();
    copyStatus.textContent = '';
    if (!phoneDialog.open) phoneDialog.showModal();
  }
  const copyButton = event.target.closest('[data-copy-phone]');
  if (!copyButton) return;
  const number = copyButton.dataset.copyPhone;
  try {
    await navigator.clipboard.writeText(number);
    copyStatus.textContent = `Номер ${number} скопирован`;
  } catch {
    // Keep copying available when browser clipboard permissions are denied.
    const field = document.createElement('textarea');
    field.value = number;
    field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    phoneDialog.append(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch {}
    field.remove();
    copyButton.focus();
    copyStatus.textContent = copied ? `Номер ${number} скопирован` : 'Выделите номер выше и скопируйте вручную.';
  }
});


// Hash routes work on static hosting and preserve browser Back/Forward navigation.
// Media entries accept {type:'video', src, poster, title} when videos are available.
const catalog=document.querySelector('#project-catalog');
let stopGalleryLayout=()=>{};
function renderCatalog(){
  stopGalleryLayout();
  const parts=location.hash.slice(1).split('/');
  const category=parts[0]==='projects' && categories.find(c=>c.id===parts[1]);
  const wasCatalog=document.body.classList.contains('catalog-mode');
  document.body.classList.toggle('catalog-mode',Boolean(category));
  catalog.hidden=!category;
  if(!category){
    document.title='Акваспектр — бассейны, аквапарки и искусственные волны';
    if(wasCatalog)document.getElementById(parts[0] || 'home')?.scrollIntoView({behavior:'instant',block:'start'});
    return;
  }
  const group=category.groups?.find(g=>g.id===parts[2]);
  const title=group?.title || category.title;
  document.title=`${title} — Акваспектр`;
  catalog.innerHTML=`<div class="container"><nav class="catalog-breadcrumbs" aria-label="Путь по проектам"><a href="#projects">Все проекты</a><span>/</span>${group?`<a href="#projects/${category.id}">${category.title}</a><span>/</span>`:''}<span aria-current="page">${title}</span></nav><h1 tabindex="-1">${title}</h1>${!category.groups ? renderGallery(category) : group ? renderGallery(group) : `<div class="catalog-grid">${category.groups.map(g=>`<a class="catalog-group" href="#projects/${category.id}/${g.id}">${cover(g.cover || g.media[0]?.src,g.title,category.symbol)}<span><strong>${g.title}</strong>${icon('arrow')}</span></a>`).join('')}</div>`}<a class="catalog-back" href="${group?'#projects/'+category.id:'#projects'}">← ${group?'Все группы':'Все направления'}</a></div>`;
  stopGalleryLayout=layoutGallery(catalog.querySelector('.catalog-gallery'));
  catalog.querySelector('h1').focus({preventScroll:true});
  window.scrollTo({top:0,behavior:'instant'});
}
function renderGallery(group){
  if(!group.media.length)return '<div class="catalog-empty">Примеры скоро появятся.</div>';
  return `<div class="catalog-gallery ${group.id==='park'?'park-gallery':''}">${group.media.map((m,i)=>`<figure class="${m.layout==='wide'?'gallery-wide':''}">${m.type==='video'?`<video controls playsinline preload="none" ${m.poster?`poster="${m.poster}"`:''} aria-label="${m.title}"><source src="${m.src}"></video>`:`<button type="button" data-preview="${i}" aria-label="Увеличить: ${m.title}"><img src="${m.src}" alt="${m.title}" width="${m.width||700}" height="${m.height||500}" loading="lazy"></button>`}</figure>`).join('')}</div><p class="portfolio-note">Примеры решений. Изображения представлены для выбора формы и оформления.</p>`;
}
// Pack cards into the shortest column while keeping their DOM and keyboard order.
function layoutGallery(gallery){
  if(!gallery || gallery.classList.contains('park-gallery'))return ()=>{};
  const cards=[...gallery.children];
  gallery.classList.add('masonry-gallery');
  let frame=0;
  const layout=()=>{
    frame=0;
    const gap=parseFloat(getComputedStyle(gallery).columnGap)||20;
    const columns=window.matchMedia('(max-width:640px)').matches?1:2;
    const heights=Array(columns).fill(0);
    const columnWidth=(gallery.clientWidth-gap*(columns-1))/columns;
    for(const card of cards){
      const wide=card.classList.contains('gallery-wide');
      const column=wide?0:heights.indexOf(Math.min(...heights));
      const top=wide?Math.max(...heights):heights[column];
      card.style.left=`${column*(columnWidth+gap)}px`;
      card.style.top=`${top}px`;
      const bottom=top+card.getBoundingClientRect().height+gap;
      if(wide)heights.fill(bottom);else heights[column]=bottom;
    }
    gallery.style.height=`${Math.max(0,...heights)-gap}px`;
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(layout);};
  const observer=new ResizeObserver(schedule);
  observer.observe(gallery);cards.forEach(card=>observer.observe(card));
  layout();
  return ()=>{observer.disconnect();cancelAnimationFrame(frame);};
}
catalog.addEventListener('click',event=>{
  const button=event.target.closest('[data-preview]');if(!button)return;
  const [,categoryId,groupId]=location.hash.slice(1).split('/');
  const category=categories.find(c=>c.id===categoryId);
  const collection=category?.groups ? category.groups.find(g=>g.id===groupId) : category;
  const media=collection?.media[Number(button.dataset.preview)];
  if(!media)return;
  detailContent.innerHTML=`<img class="gallery-preview" src="${media.src}" alt="${media.title}"><h2 class="sr-only" id="detail-title">${media.title}</h2>`;
  detailDialog.showModal();
});
window.addEventListener('hashchange',()=>{closeMenu();renderCatalog();});
renderCatalog();
