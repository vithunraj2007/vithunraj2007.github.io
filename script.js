const glow=document.querySelector('.cursor-glow');
if(glow) document.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

const roles=['Developer','IoT Builder','Python Programmer','Problem Solver','Future Engineer'];
let ri=0,ci=0,del=false;
const role=document.querySelector('#role');
function type(){
  if(!role)return;
  const word=roles[ri]; role.textContent=word.slice(0,ci);
  if(!del&&ci<word.length){ci++;setTimeout(type,85)}
  else if(!del){del=true;setTimeout(type,900)}
  else if(ci>0){ci--;setTimeout(type,42)}
  else{del=false;ri=(ri+1)%roles.length;setTimeout(type,280)}
}
type();

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting)e.target.classList.add('show')
}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const menu=document.querySelector('.menu'),links=document.querySelector('.navlinks');
menu?.addEventListener('click',()=>{
  links.classList.toggle('open');
  menu.textContent=links.classList.contains('open')?'✕':'☰'
});
document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>{
  links.classList.remove('open');menu.textContent='☰'
}));

/* LIVE GITHUB SYNC
   Public repositories are loaded directly from GitHub.
   Add/update a public repo and it can appear here automatically. */
const GITHUB_USER='vithunraj2007';
const liveProjects=[
  'Zone-based-classroom-automation-esp32',
  'pygame-car-racing-game',
  'Java-Calculator-Mini-Project',
  'todo-list-javascript',
  'esp8266-hc-sr04-ultrasonic',
  'neon-racer'
];

function escapeHtml(value=''){
  return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function prettyName(name=''){
  return name.replace(/[-_]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
}
function createLiveSection(){
  if(document.querySelector('.live-github')) return;
  const banner=document.querySelector('.github-banner');
  if(!banner)return;
  const section=document.createElement('div');
  section.className='live-github reveal';
  section.innerHTML=`
    <div class="live-head">
      <div>
        <div class="kicker">AUTOMATICALLY UPDATED</div>
        <h3>Latest from GitHub.</h3>
        <p>This section reads your public GitHub repositories live. Create a new public repo or update an existing one and the portfolio can reflect it on the next visit.</p>
      </div>
      <div class="live-status"><i></i> LIVE GITHUB DATA</div>
    </div>
    <div class="live-repos"><div class="live-loading">Loading repositories…</div></div>`;
  banner.parentNode.insertBefore(section,banner);
  observer.observe(section);
  return section;
}
async function loadGithubProjects(){
  const section=createLiveSection();
  if(!section)return;
  const grid=section.querySelector('.live-repos');
  try{
    const response=await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&direction=desc&per_page=100`,{headers:{Accept:'application/vnd.github+json'}});
    if(!response.ok)throw new Error('GitHub API unavailable');
    const repos=await response.json();
    const preferred=repos.filter(r=>!r.fork);
    const selected=[...preferred.filter(r=>liveProjects.includes(r.name)),...preferred.filter(r=>!liveProjects.includes(r.name))]
      .filter((repo,index,array)=>array.findIndex(x=>x.name===repo.name)===index)
      .slice(0,6);
    if(!selected.length){grid.innerHTML='<div class="live-error"><strong>No public repositories found.</strong><br>Publish a public project on GitHub and refresh the portfolio.</div>';return;}
    grid.innerHTML=selected.map(repo=>`
      <article class="live-repo">
        <div class="live-repo-top"><h4 title="${escapeHtml(repo.name)}">${escapeHtml(prettyName(repo.name))}</h4><span class="repo-icon">↗</span></div>
        <p>${escapeHtml(repo.description||'A project from Vithunraj’s GitHub portfolio.')}</p>
        <div class="repo-meta">
          <span>${escapeHtml(repo.language||'Project')}</span>
          <span>★ ${repo.stargazers_count}</span>
          <span>Updated ${new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>
        <a href="${repo.html_url}" target="_blank" rel="noopener">OPEN REPOSITORY ↗</a>
      </article>`).join('');
  }catch(error){
    grid.innerHTML='<div class="live-error"><strong>GitHub could not be loaded right now.</strong><br>The rest of the portfolio still works normally. Try refreshing the page later.</div>';
  }
}
loadGithubProjects();
setInterval(loadGithubProjects,10*60*1000);

/* Subtle active navigation state */
const sections=[...document.querySelectorAll('section[id]')];
const navAnchors=[...document.querySelectorAll('.navlinks a')];
const activeObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navAnchors.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));
    }
  });
},{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>activeObserver.observe(s));
