// ─── DATA ───
const KELAS = {nama:'X PPLG 2', tahun:'2025/2026'};
const SEED_JADWAL = [
  {id:1,hari:'Senin',mulai:'07:00',selesai:'11:00',mapel:'Produktif PPLG',guru:'Pak Iwan',ruang:'R.Lab'},
  {id:2,hari:'Senin',mulai:'11:00',selesai:'11:45',mapel:'BK/BP',guru:'Pak Qohar',ruang:'Kelas Bawah'},
  {id:3,hari:'Senin',mulai:'12:15',selesai:'15.15',mapel:'Produktif PPLG',guru:'Pak Eko',ruang:'R.Lab'},
  {id:4,hari:'Selasa',mulai:'07:00',selesai:'08:30',mapel:'Pendidikan Pancasila',guru:'Bu Triana',ruang:'Kelas Bawah'},
  {id:5,hari:'Selasa',mulai:'08:30',selesai:'10:15',mapel:'Matematika',guru:'Pak Afwan',ruang:'Kelas Bawah'},
  {id:6,hari:'Selasa',mulai:'10:15',selesai:'12:15',mapel:'Bahasa Indonesia',guru:'Bu Devitta',ruang:'Kelas Bawah'},
  {id:7,hari:'Selasa',mulai:'12:15',selesai:'13:45',mapel:'Bahasa Inggris',guru:'Bu Silmi',ruang:'Kelas Bawah'},
  {id:8,hari:'Selasa',mulai:'13:45',selesai:'15:15',mapel:'IPAS',guru:'Bu Kasih',ruang:'Kelas Bawah'},
  {id:9,hari:'Rabu',mulai:'07:00',selesai:'10:45',mapel:'Produktif PPLG',guru:'Pak Eko',ruang:'R.Lab'},
  {id:10,hari:'Rabu',mulai:'10:45',selesai:'11:15',mapel:'Matematika',guru:'Pak Afwan',ruang:'Kelas Bawah'},
  {id:11,hari:'Rabu',mulai:'11:15',selesai:'13:10',mapel:'Bahasa Inggris',guru:'Bu Silmi',ruang:'Kelas Bawah'},
  {id:12,hari:'Rabu',mulai:'13:10',selesai:'15:15',mapel:'PAI',guru:'Pak Niam',ruang:'Kelas Bawah'},
  {id:13,hari:'Kamis',mulai:'07:00',selesai:'08:20',mapel:'Bahasa Indonesia',guru:'Bu Devitta',ruang:'Kelas Bawah'},
  {id:14,hari:'Kamis',mulai:'08:20',selesai:'09:55',mapel:'Seni Budaya',guru:'Pak Sinung',ruang:'Kelas Bawah'},
  {id:15,hari:'Kamis',mulai:'09:55',selesai:'12.30',mapel:'Penjasorkes',guru:'Pak Ishlah',ruang:'Kelas Bawah'},
  {id:16,hari:'Kamis',mulai:'12:30',selesai:'13:10',mapel:'Bahasa Jawa',guru:'Bu Anita',ruang:'Kelas Bawah'},
  {id:17,hari:'Kamis',mulai:'13:10',selesai:'15:10',mapel:'Sejarah',guru:'Pak Budi',ruang:'Kelas Bawah'},
  {id:18,hari:'Jumat',mulai:'07:00',selesai:'09:30',mapel:'Produktif PPLG',guru:'Pak Agung',ruang:'Ruang Tefa Bawah'},
  {id:19,hari:'Jumat',mulai:'10:30',selesai:'14:00',mapel:'IPAS',guru:'Bu Kasih',ruang:'Kelas Bawah'},
];

const SEED_ANN = [];

function ls(key, val) {
  if (val === undefined) { try { return JSON.parse(localStorage.getItem('siswaku_'+key)); } catch { return null; } }
  localStorage.setItem('siswaku_'+key, JSON.stringify(val));
}
function initData() {
  if (!ls('jadwal')) ls('jadwal', SEED_JADWAL);
  if (!ls('pengumuman')) ls('pengumuman', SEED_ANN);
}

// ─── HELPERS ───
const HARI_ORDER = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const HARI_EN = {Monday:'Senin',Tuesday:'Selasa',Wednesday:'Rabu',Thursday:'Kamis',Friday:'Jumat',Saturday:'Sabtu'};
const MAPEL_COLOR = {'Matematika':'#4f8ef7','Fisika':'#a78bfa','Kimia':'#22d3a0','Biologi':'#34d399','Bahasa Indonesia':'#fbbf24','Bahasa Inggris':'#f87171','Sejarah':'#6b7280','PKN':'#ec4899','Agama':'#f97316','Seni Budaya':'#0ea5e9'};

function initials(nama){ return nama.trim().split(' ').slice(0,2).map(w=>w[0]?.toUpperCase()||'').join(''); }
function getMapelColor(m){ for(const [k,v] of Object.entries(MAPEL_COLOR)) if(m.toLowerCase().includes(k.toLowerCase())) return v; return '#64748b'; }
function timeAgo(iso){
  const d=(Date.now()-new Date(iso))/1000;
  if(d<60) return 'Baru saja';
  if(d<3600) return Math.floor(d/60)+' menit lalu';
  if(d<86400) return Math.floor(d/3600)+' jam lalu';
  if(d<604800) return Math.floor(d/86400)+' hari lalu';
  return new Date(iso).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
}
function toast(msg, type='success'){
  const t=document.createElement('div');
  t.className=`toast-item toast-${type}`;
  t.innerHTML=`<span>${{success:'✓',error:'✕',info:'ℹ'}[type]||'•'}</span><span>${msg}</span>`;
  document.getElementById('toast').appendChild(t);
  setTimeout(()=>{t.style.animation='slideIn .3s ease reverse';setTimeout(()=>t.remove(),300);},3000);
}

// ─── NAVIGATION ───
const PAGE_TITLES = {dashboard:'Dashboard',jadwal:'Jadwal Kelas',pengumuman:'Pengumuman'};
const renders = {dashboard:renderDashboard, jadwal:renderJadwal, pengumuman:renderPengumuman};

function goTo(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.page===page));
  document.getElementById('page-title').textContent=PAGE_TITLES[page]||page;
  closeSidebar();
  renders[page]?.();
}
function openSidebar(){document.getElementById('sidebar').classList.add('open');document.getElementById('sb-overlay').classList.add('on')}
function closeSidebar(){document.getElementById('sidebar').classList.remove('open');document.getElementById('sb-overlay').classList.remove('on')}
function openModal(id){document.getElementById(id).classList.add('on');document.body.style.overflow='hidden'}
function closeModal(id){document.getElementById(id).classList.remove('on');document.body.style.overflow=''}
document.querySelectorAll('.modal-bg').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m.id)}));

// ─── DASHBOARD ───
function renderDashboard(){
  const jadwal = ls('jadwal')||[];
  const pengumuman = ls('pengumuman')||[];
  const now = new Date();
  const hariId = HARI_EN[now.toLocaleDateString('en-US',{weekday:'long'})]||'';

  document.getElementById('topbar-date').textContent = now.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  document.getElementById('dash-hari').textContent = hariId||'—';

  const jadwalHariIni = jadwal.filter(j=>j.hari===hariId).sort((a,b)=>a.mulai.localeCompare(b.mulai));
  const mapelUnik = [...new Set(jadwal.map(j=>j.mapel))].length;
  const annCount = pengumuman.length;

  // Stat cards
  document.getElementById('sc-jadwal').textContent = jadwalHariIni.length;
  document.getElementById('sc-jadwal-sub').textContent = jadwalHariIni.length ? jadwalHariIni[0].mapel+' – '+jadwalHariIni[jadwalHariIni.length-1].mapel : 'Tidak ada jadwal';
  document.getElementById('sc-ann').textContent = annCount;
  document.getElementById('sc-ann-sub').textContent = annCount ? 'Terbaru: '+[...pengumuman].sort((a,b)=>new Date(b.waktu)-new Date(a.waktu))[0].judul.slice(0,22)+'...' : 'Belum ada';
  document.getElementById('sc-mapel').textContent = mapelUnik;

  // Jadwal hari ini
  const nowTime = now.toTimeString().slice(0,5);
  document.getElementById('dash-jadwal-list').innerHTML = !jadwalHariIni.length
    ? `<div class="empty"><div class="ei">🎉</div><p>Tidak ada jadwal hari ini</p></div>`
    : jadwalHariIni.map(j=>{
        const ongoing = nowTime>=j.mulai && nowTime<=j.selesai;
        const color = getMapelColor(j.mapel);
        return `<div class="jadwal-row" style="${ongoing?'border-color:'+color+'44;background:linear-gradient(135deg,var(--surface2),'+color+'08)':''}">
          <div class="jadwal-time">${j.mulai}–${j.selesai}</div>
          <div class="jadwal-dot ${ongoing?'ongoing':''}" style="background:${color}"></div>
          <div style="flex:1">
            <div class="jadwal-mapel">${j.mapel}</div>
            <div class="jadwal-guru">${j.guru}${ongoing?' · <span style="color:var(--green)">Berlangsung</span>':''}</div>
          </div>
          ${j.ruang?`<div class="jadwal-room">${j.ruang}</div>`:''}
        </div>`;
      }).join('');

  // Pengumuman preview
  const annList = [...pengumuman].sort((a,b)=>b.pinned-a.pinned||new Date(b.waktu)-new Date(a.waktu)).slice(0,3);
  document.getElementById('dash-ann-list').innerHTML = !annList.length
    ? `<div class="empty" style="padding:24px 0"><div class="ei">📭</div><p>Belum ada pengumuman</p></div>`
    : annList.map(a=>`
        <div style="display:flex;gap:10px;align-items:flex-start;padding:10px;background:var(--surface2);border-radius:9px;margin-bottom:7px;border:1px solid var(--border);cursor:pointer" onclick="goTo('pengumuman')">
          <div class="ann-ava" style="width:32px;height:32px;font-size:11px;border-radius:8px;flex-shrink:0">${initials(a.nama)}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;gap:5px;align-items:center;margin-bottom:2px">
              ${a.pinned?'<span class="badge badge-yellow">📌</span>':''}
              <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.judul}</div>
            </div>
            <div style="font-size:11px;color:var(--text2)">${a.nama} · ${timeAgo(a.waktu)}</div>
          </div>
        </div>`).join('');

  // ── STATISTIKA: Mean & Modus + Diagram Batang ──
  renderStatistika(jadwal);
}

// ─── STATISTIKA ───
function toMin(s){
  // handle '15.15' style too
  const clean = s.replace('.',':');
  const [h,m] = clean.split(':').map(Number);
  return h*60+(m||0);
}

function renderStatistika(jadwal){
  // Hitung durasi tiap sesi (menit)
  const withDur = jadwal.map(j=>({...j, dur: Math.max(0, toMin(j.selesai)-toMin(j.mulai))}));

  // Durasi per mapel
  const durMapel = {};
  withDur.forEach(j=>{ durMapel[j.mapel]=(durMapel[j.mapel]||0)+j.dur; });
  const mapelEntries = Object.entries(durMapel).sort((a,b)=>b[1]-a[1]);
  const totalDur = mapelEntries.reduce((s,[,v])=>s+v,0);
  const n = mapelEntries.length;

  // MEAN durasi per mapel
  const mean = totalDur/n;

  // Durasi per hari
  const durHari = {};
  withDur.forEach(j=>{ durHari[j.hari]=(durHari[j.hari]||0)+j.dur; });
  const hariEntries = ['Senin','Selasa','Rabu','Kamis','Jumat']
    .filter(h=>durHari[h])
    .map(h=>([h, durHari[h]]));

  // MODUS hari = hari dengan durasi terbanyak
  const maxHariDur = Math.max(...hariEntries.map(([,v])=>v));
  const modusHari  = hariEntries.filter(([,v])=>v===maxHariDur).map(([h])=>h).join(' & ');

  // MODUS mapel = mapel dengan durasi terbanyak
  const maxMapelDur = mapelEntries[0][1];
  const modusMapel  = mapelEntries.filter(([,v])=>v===maxMapelDur).map(([m])=>m).join(' & ');

  const fmtJam = m => {
    const j = Math.floor(m/60), mn = m%60;
    return j ? `${j}j ${mn}m` : `${mn}m`;
  };

  // Warna bar per mapel
  const COLORS = ['#4f8ef7','#22d3a0','#a78bfa','#fbbf24','#f87171','#06b6d4','#ec4899','#84cc16','#f97316','#6b7280','#14b8a6','#e879f9'];

  const maxDur = mapelEntries[0][1];
  const maxHDur = Math.max(...hariEntries.map(([,v])=>v));

  document.getElementById('stat-ringkasan').innerHTML = `
    <!-- Ringkasan mean & modus -->
    <div class="stat-sum-row">
      <div class="stat-sum-card">
        <div class="stat-sum-label">Mean Durasi/Hari</div>
        <div class="stat-sum-val" style="color:var(--green)">${fmtJam(Math.round(totalDur/hariEntries.length))}</div>
        <div class="stat-sum-formula">x̄ = ${totalDur} ÷ ${hariEntries.length}</div>
      </div>
      <div class="stat-sum-card">
        <div class="stat-sum-label">Modus Mapel</div>
        <div class="stat-sum-val modus-val" style="color:var(--yellow)">${modusMapel}</div>
        <div class="stat-sum-formula">${fmtJam(maxMapelDur)} terbanyak</div>
      </div>
      <div class="stat-sum-card">
        <div class="stat-sum-label">Modus Hari</div>
        <div class="stat-sum-val modus-val" style="color:var(--purple)">${modusHari}</div>
        <div class="stat-sum-formula">${fmtJam(maxHariDur)} terbanyak</div>
      </div>
    </div>

    <!-- Diagram batang mapel -->
    <div class="chart-section">
      <div class="chart-title">Distribusi Durasi per Mata Pelajaran <span class="chart-sub">(menit/minggu)</span></div>
      <div class="chart-bars">
        ${mapelEntries.map(([mapel, dur], i)=>{
          const pct = (dur/maxDur*100).toFixed(1);
          const isModus = dur===maxMapelDur;
          const color = COLORS[i%COLORS.length];
          return `
          <div class="bar-row">
            <div class="bar-label" title="${mapel}">${mapel}</div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${pct}%;background:${color}${isModus?';box-shadow:0 0 8px '+color+'88':''}" data-w="${pct}"></div>
            </div>
            <div class="bar-meta">
              <span class="bar-val">${fmtJam(dur)}</span>
              ${isModus?'<span class="bar-modus">Mo</span>':''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Diagram batang hari -->
    <div class="chart-section">
      <div class="chart-title">Distribusi Durasi per Hari <span class="chart-sub">(menit/hari)</span></div>
      <div class="chart-bars">
        ${hariEntries.map(([hari, dur])=>{
          const pct = (dur/maxHDur*100).toFixed(1);
          const isModus = dur===maxHariDur;
          return `
          <div class="bar-row">
            <div class="bar-label">${hari}</div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${pct}%;background:${isModus?'var(--purple)':'var(--accent)'}${isModus?';box-shadow:0 0 8px rgba(167,139,250,.5)':''}" data-w="${pct}"></div>
            </div>
            <div class="bar-meta">
              <span class="bar-val">${fmtJam(dur)}</span>
              ${isModus?'<span class="bar-modus" style="background:rgba(167,139,250,.15);color:var(--purple);border-color:rgba(167,139,250,.3)">Mo</span>':''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;

  // Animasi bar
  setTimeout(()=>{
    document.querySelectorAll('.bar-fill[data-w]').forEach(el=>{
      el.style.width = el.dataset.w + '%';
    });
  }, 50);
}

// ─── JADWAL ───
let activeHari='all';
function renderJadwal(){
  const jadwal=ls('jadwal')||[];
  const hariAktif=HARI_ORDER.filter(h=>jadwal.some(j=>j.hari===h));
  const hariIni=HARI_EN[new Date().toLocaleDateString('en-US',{weekday:'long'})]||'';
  document.getElementById('jadwal-filter').innerHTML=
    `<button class="btn btn-sm ${activeHari==='all'?'btn-primary':'btn-ghost'}" onclick="filterJadwal('all',this)">Semua</button>`+
    hariAktif.map(h=>`<button class="btn btn-sm ${activeHari===h?'btn-primary':'btn-ghost'}" onclick="filterJadwal('${h}',this)">${h}${h===hariIni?' ←':''}</button>`).join('');
  renderJadwalList(jadwal,hariIni);
}
function filterJadwal(hari,btn){
  activeHari=hari;
  document.querySelectorAll('#jadwal-filter .btn').forEach(b=>b.className='btn btn-sm btn-ghost');
  btn.className='btn btn-sm btn-primary';
  const hariIni=HARI_EN[new Date().toLocaleDateString('en-US',{weekday:'long'})]||'';
  renderJadwalList(ls('jadwal')||[],hariIni);
}
function renderJadwalList(jadwal,hariIni){
  const nowTime=new Date().toTimeString().slice(0,5);
  const hariList=activeHari==='all'?HARI_ORDER:[activeHari];
  let html='';
  hariList.forEach(h=>{
    const items=jadwal.filter(j=>j.hari===h);
    if(!items.length) return;
    const isToday=h===hariIni;
    html+=`<div class="day-header">
      <div class="day-label">${h}</div>
      ${isToday?'<span class="badge badge-green">● Hari Ini</span>':''}
      <div class="day-line"></div>
      <span style="font-size:10px;color:var(--text3)">${items.length} pelajaran</span>
    </div>`;
    items.sort((a,b)=>a.mulai.localeCompare(b.mulai)).forEach(j=>{
      const ongoing=isToday&&nowTime>=j.mulai&&nowTime<=j.selesai;
      const color=getMapelColor(j.mapel);
      const dur=(()=>{const [sm,ss]=j.mulai.split(':').map(Number);const [em,es]=j.selesai.split(':').map(Number);return(em*60+es)-(sm*60+ss);})();
      html+=`<div class="jadwal-row" style="${ongoing?'border-color:'+color+'55;background:linear-gradient(135deg,var(--surface2),'+color+'08)':''}">
        ${ongoing?`<div style="width:3px;border-radius:2px;background:${color};align-self:stretch;flex-shrink:0"></div>`:''}
        <div class="jadwal-time">${j.mulai}–${j.selesai}</div>
        <div class="jadwal-dot ${ongoing?'ongoing':''}" style="background:${color}"></div>
        <div style="flex:1">
          <div class="jadwal-mapel">${j.mapel}</div>
          <div class="jadwal-guru">${j.guru}${ongoing?' · <span style="color:var(--green)">Sedang berlangsung</span>':''}</div>
        </div>
        <div style="font-size:9px;color:var(--text3);font-family:'DM Mono',monospace">${dur}m</div>
        ${j.ruang?`<div class="jadwal-room" style="${ongoing?'background:'+color+'22;color:'+color:''}">${j.ruang}</div>`:''}
      </div>`;
    });
  });
  document.getElementById('jadwal-container').innerHTML=html||`<div class="empty"><div class="ei">📋</div><p>Tidak ada jadwal</p></div>`;
}

// ─── PENGUMUMAN ───
function renderPengumuman(){
  const pengumuman=(ls('pengumuman')||[]).sort((a,b)=>b.pinned-a.pinned||new Date(b.waktu)-new Date(a.waktu));
  document.getElementById('ann-count').textContent=pengumuman.length+' post';
  const el=document.getElementById('ann-list');
  if(!pengumuman.length){el.innerHTML=`<div class="empty"><div class="ei">📭</div><p>Belum ada pengumuman.</p></div>`;return;}
  el.innerHTML=pengumuman.map(a=>`
    <div class="ann-card ${a.pinned?'pinned':''}" id="ann-${a.id}">
      <div class="ann-top">
        <div class="ann-ava">${initials(a.nama)}</div>
        <div style="flex:1">
          <div style="display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-bottom:3px">
            ${a.pinned?'<span class="badge badge-yellow">📌 Pinned</span>':''}
            ${a.isGuru?'<span class="badge badge-green">Wali Guru</span>':''}
          </div>
          <div class="ann-title">${a.judul}</div>
          <div class="ann-meta">oleh <strong>${a.nama}</strong> · ${timeAgo(a.waktu)}</div>
        </div>
        <div style="display:flex;gap:5px;flex-shrink:0">
          <button class="btn btn-ghost btn-sm" onclick="togglePin(${a.id})">${a.pinned?'📍':'📌'}</button>
          <button class="btn btn-danger btn-sm" onclick="deleteAnn(${a.id})">🗑</button>
        </div>
      </div>
      <div class="ann-body">${a.isi}</div>
      <div class="ann-footer">📅 ${new Date(a.waktu).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
    </div>`).join('');
}
function postAnn(){
  const judul=document.getElementById('inp-ann-judul').value.trim();
  const isi=document.getElementById('inp-ann-isi').value.trim();
  const pinned=document.getElementById('chk-pin').checked;
  if(!judul||!isi){toast('Judul dan isi wajib diisi','error');return;}
  const list=ls('pengumuman')||[];
  const newId=Math.max(0,...list.map(p=>p.id))+1;
list.unshift({id:newId,nama:'Saya',judul,isi,pinned,waktu:new Date().toISOString()});  ls('pengumuman',list);
  document.getElementById('inp-ann-judul').value='';
  document.getElementById('inp-ann-isi').value='';
  document.getElementById('chk-pin').checked=false;
  closeModal('modal-ann');
  toast('Pengumuman berhasil dipost!','success');
  renderPengumuman();
}
function togglePin(id){
  const list=ls('pengumuman')||[];
  const i=list.findIndex(p=>p.id===id);
  if(i>-1){list[i].pinned=!list[i].pinned;ls('pengumuman',list);renderPengumuman();}
}
function deleteAnn(id){
  if(!confirm('Hapus pengumuman ini?')) return;
  ls('pengumuman',(ls('pengumuman')||[]).filter(p=>p.id!==id));
  toast('Pengumuman dihapus','info');
  renderPengumuman();
}

// ─── INIT ───
initData();
renderDashboard();
