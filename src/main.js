const icon = (name) => `<svg aria-hidden="true"><use href="#${name}"/></svg>`;
const projects = [
  {id:'private',category:'private',title:'Частный бассейн',meta:'5 × 3 м · Подогрев',image:'/images/private-pool.jpg',alt:'Открытый бассейн с голубой водой и зоной отдыха',description:'Компактный и комфортный бассейн для частного дома с системой подогрева и современной отделкой.',details:'Место для спокойного отдыха рядом с домом. Продумываем расположение чаши, безопасные подходы и оборудование так, чтобы бассейном было удобно пользоваться каждый день.',features:['Система фильтрации и подогрева','Подводное освещение','Отделка чаши и обустройство зоны отдыха'],type:'Частный бассейн'},
  {id:'park',category:'park',title:'Аквапарк',meta:'Санаторий «Каспий»',image:'/images/waterpark.png',alt:'Вид сверху на аквапарк с горками и извилистыми бассейнами',description:'Комплекс водных развлечений: горки, детский городок, волновой бассейн 1280 м², ленивая река 400 метров.',details:'Водное пространство для семейного отдыха. Объединяем аттракционы, детские зоны и бассейны в единый комплекс с понятной навигацией и продуманной инфраструктурой.',features:['Водные горки и детские аттракционы','Волновой бассейн и ленивая река','Водоподготовка для коммерческих объектов'],type:'Аквапарк'},
  {id:'spa',category:'spa',title:'Бассейн в СПА',meta:'25 × 11 м · Дербент',image:'/images/spa-pool.png',alt:'Современный крытый бассейн с панорамными окнами',description:'Современный бассейн в СПА-центре с системой подогрева и премиальной отделкой.',details:'Тихая вода, комфортная температура и архитектура, которая помогает замедлиться. Проектируем бассейн как часть целостного пространства для восстановления и отдыха.',features:['Подогрев и автоматическая водоподготовка','Архитектурная и подводная подсветка','Интеграция с пространством СПА'],type:'Бассейн в СПА'},
  {id:'wave',category:'wave',title:'Искусственная волна',meta:'Решение для аквапарков и курортов',image:'/images/waterpark.png',alt:'Водный комплекс с бассейнами и аттракционами',description:'Системы создания волн для активного отдыха. Подбираем оборудование под размеры и задачи вашего комплекса.',details:'Создаём пространство для ярких впечатлений на воде. Тип волны, геометрия бассейна и режимы работы подбираются на этапе проектирования с учётом аудитории и нагрузки на комплекс.',features:['Подбор системы генерации волн','Расчёт чаши и инженерных систем','Пусконаладка и дальнейшее обслуживание'],type:'Искусственная волна'}
];
const grid = document.querySelector('#project-grid');
function renderProjects(filter='all') {
  const visible = filter === 'all' ? projects : projects.filter(p=>p.category===filter);
  grid.innerHTML=visible.map((p,i)=>`<article class="project-card ${p.id==='wave'&&filter==='all'?'wave-card':''}" style="animation-delay:${i*50}ms"><button class="project-image" data-project="${p.id}" aria-label="Подробнее: ${p.title}"><img src="${p.image}" alt="${p.alt}" loading="lazy" width="700" height="470"><span class="project-index">0${projects.indexOf(p)+1} / АКВАСПЕКТР</span></button><div class="project-content"><h3>${p.title}</h3><p class="project-meta">${p.meta}</p><p class="project-description">${p.description}</p><button class="project-link" data-project="${p.id}" aria-label="Подробнее: ${p.title}">Подробнее ${icon('arrow')}</button></div></article>`).join('');
  document.querySelector('#filter-status').textContent=`Показано проектов: ${visible.length}`;
}
renderProjects();
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
  renderProjects(button.dataset.filter);
}));
const detailDialog=document.querySelector('#detail-dialog');
const quoteDialog=document.querySelector('#quote-dialog');
const form=document.querySelector('#quote-form');
const result=document.querySelector('#quote-result');
const detailContent=document.querySelector('#detail-content');
function openQuote(type){
  if(detailDialog.open)detailDialog.close();
  form.hidden=false;result.hidden=true;
  if(type)form.elements.type.value=type;
  quoteDialog.showModal();
}
document.querySelectorAll('[data-quote]').forEach(b=>b.addEventListener('click',()=>openQuote()));
grid.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-project]');if(!trigger)return;
  const p=projects.find(p=>p.id===trigger.dataset.project);
  detailContent.innerHTML=`<img class="detail-photo" src="${p.image}" alt="${p.alt}"><div class="detail-body"><p class="eyebrow">${p.meta}</p><h2 id="detail-title">${p.title}</h2><p>${p.details}</p><ul class="detail-features">${p.features.map(f=>`<li>${icon('check')}${f}</li>`).join('')}</ul><button class="button button-blue" id="similar-project">Обсудить похожий проект ${icon('arrow')}</button><p class="form-note" style="margin:16px 0 0">Изображение иллюстрирует решение и не является фотографией выполненного объекта.</p></div>`;
  document.querySelector('#similar-project').addEventListener('click',()=>openQuote(p.type));
  detailDialog.showModal();
});
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
  brief=`АКВАСПЕКТР — описание проекта\n\nТип: ${data.get('type')}\nРазмеры: ${dimensions}\nМестоположение: ${location}\nПожелания: ${String(data.get('notes')).trim()||'Обсудить со специалистом'}\n\nТелефон для консультации: +7 (928) 987 97 07\nСтоимость рассчитывается после уточнения проекта.`;
  result.innerHTML=`<span class="result-icon">${icon('check')}</span><h3>Ваш проект готов к обсуждению</h3><p>Сохраните описание и позвоните нам для консультации. Заявка автоматически не отправляется.</p><div class="brief-summary"></div><div class="result-actions"><button class="button button-blue" id="download-brief">Скачать описание ${icon('arrow')}</button><a class="button" href="tel:+79289879707">${icon('phone')} Позвонить</a></div><button class="text-button" id="edit-brief">Изменить описание</button>`;
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
window.matchMedia('(min-width:641px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
document.querySelector('#year').textContent=new Date().getFullYear();
