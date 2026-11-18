import { state, save, msgsOf, unread, uid } from './js/store.js';
import { md, esc } from './js/markdown.js';

const $ = s => document.querySelector(s), app = $('#app');
const ui = { g: 'g1', ch: 'c1', panel: 'center', tab: 'servers', rtab: 'members', sel: null, reply: null };
const U = id => state.users[id];
const stat = u => (u.status === 'invisible' ? 'offline' : u.status);
const av = (u, s = 40, dot = false) => `<span class="av${dot ? ' dot st-' + stat(u) : ''}" style="width:${s}px;height:${s}px;background:${u.color};font-size:${s * .42}px">${esc(u.name[0].toUpperCase())}</span>`;
const rolesOf = (uidv, g) => (g?.members[uidv] || []).map(i => state.roles[i]).sort((a, b) => b.pos - a.pos);
const rc = (uidv, g) => rolesOf(uidv, g).find(r => r.color)?.color || '#f2f3f5';
const bdg = x => (x.mentions ? `<i class="bdg">${x.mentions}</i>` : '');
const tm = t => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const fmt = t => (new Date(t).toDateString() === new Date().toDateString() ? 'Today at ' : new Date(t).toLocaleDateString() + ' ') + tm(t);
const lastId = id => msgsOf(id).at(-1)?.id;
const markRead = () => { const l = lastId(ui.ch); if (l) state.read[ui.ch] = l; };
const chans = (g, cat) => Object.values(state.channels).filter(c => c.g === g && (cat === undefined || c.cat === cat)).sort((a, b) => a.pos - b.pos);

function rail() {
  const gs = Object.values(state.guilds).map(g => {
    const u = chans(g.id).map(c => unread(c.id)), ping = u.reduce((a, x) => a + x.mentions, 0);
    return `<button class="si${ui.g === g.id ? ' on' : ''}${u.some(x => x.count) && ui.g !== g.id ? ' unr' : ''}" data-g="${g.id}" style="--c:${g.color}" aria-label="${esc(g.name)}">${esc(g.name.split(' ').map(w => w[0]).join('').slice(0, 3))}${ping ? `<i class="bdg">${ping}</i>` : ''}</button>`;
  }).join('');
  $('#rail').innerHTML = `<button class="si${ui.g === 'home' ? ' on' : ''}" data-g="home" aria-label="Direct Messages">💬</button><hr>${gs}`;
}

const dmRow = c => { const p = U(c.u), x = unread(c.id); return `<div class="ch dm${c.id === ui.ch ? ' on' : ''}${x.count ? ' unr' : ''}" data-c="${c.id}">${av(p, 32, true)}<span>${esc(p.name)}</span>${bdg(x)}</div>`; };

function chlist() {
  const el = $('#chlist');
  if (ui.g === 'home') { el.innerHTML = `<div class="gh"><b>Direct Messages</b></div>` + chans('home').map(dmRow).join(''); return; }
  const g = state.guilds[ui.g];
  el.innerHTML = `<div class="gh" style="--c:${g.color}"><b>${esc(g.name)}</b><span>⌄</span></div>` +
    Object.values(state.categories).filter(k => k.g === g.id).sort((a, b) => a.pos - b.pos).map(k => {
      const open = !state.collapsed[k.id];
      return `<div class="cat" data-k="${k.id}">${open ? '⌄' : '›'} ${esc(k.name.toUpperCase())}</div>` + chans(g.id, k.id).filter(c => open || unread(c.id).count).map(c => {
        const x = unread(c.id), ic = { text: '#', voice: '🔊', forum: '💬' }[c.type];
        const row = `<div class="ch${c.id === ui.ch ? ' on' : ''}${x.count && c.id !== ui.ch ? ' unr' : ''}"${c.type === 'voice' ? '' : ` data-c="${c.id}"`}><i>${ic}</i><span>${esc(c.name)}</span>${bdg(x)}</div>`;
        return row + c.voice.map(v => `<div class="vu">${av(U(v), 22)}<span>${esc(U(v).name)}</span></div>`).join('');
      }).join('');
    }).join('');
}

function head() {
  const c = state.channels[ui.ch];
  $('#chhead').innerHTML = `<button data-a="left" aria-label="Open servers">☰</button><b><span class="hash">${c.g === 'home' ? '@' : '#'}</span> ${esc(c.g === 'home' ? U(c.u).name : c.name)}</b><button data-a="right" aria-label="Members">👥</button>`;
}

function reacts(m) {
  const r = Object.entries(m.reacts).filter(([, a]) => a.length);
  return r.length ? `<div class="rx">${r.map(([e, a]) => `<button class="react${a.includes('u0') ? ' me' : ''}" data-a="react" data-e="${e}">${e} ${a.length}</button>`).join('')}</div>` : '';
}

function feed(stick) {
  const f = $('#feed'), keep = f.scrollHeight - f.scrollTop, c = state.channels[ui.ch], g = state.guilds[c.g];
  const names = Object.fromEntries(Object.values(state.users).map(u => [u.name.toLowerCase(), u.id]));
  let prev = null, h = '';
  for (const m of msgsOf(c.id)) {
    const u = U(m.u), day = new Date(m.t).toDateString();
    if (!prev || new Date(prev.t).toDateString() !== day) h += `<div class="div"><span>${new Date(m.t).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span></div>`;
    const grp = prev && prev.u === m.u && !m.reply && m.t - prev.t < 7 * 6e4 && new Date(prev.t).toDateString() === day;
    const r = m.reply && state.messages.find(x => x.id === m.reply), hl = /@(you|everyone)\b/i.test(m.text) && m.u !== 'u0', sel = ui.sel === m.id;
    h += `<div class="msg${grp ? ' grp' : ''}${hl ? ' hl' : ''}${sel ? ' sel' : ''}" data-m="${m.id}">` +
      (r ? `<div class="rep">${av(U(r.u), 16)}<b style="color:${rc(r.u, g)}">${esc(U(r.u).name)}</b><span>${esc(r.text.replace(/\n/g, ' ').slice(0, 60))}</span></div>` : '') +
      (grp ? `<time class="gt">${tm(m.t)}</time>` : av(u, 40)) + `<div class="bd">` +
      (grp ? '' : `<div class="meta"><b style="color:${rc(m.u, g)}">${esc(u.name)}</b>${u.bot ? '<em class="tag">APP</em>' : ''}<time>${fmt(m.t)}</time></div>`) +
      `<div class="tx">${md(m.text, names)}</div>${reacts(m)}` +
      (sel ? `<div class="tools"><button data-a="reply">↩ Reply</button>${['👍', '❤️', '😂'].map(e => `<button data-a="react" data-e="${e}">${e}</button>`).join('')}</div>` : '') + `</div></div>`;
    prev = m;
  }
  f.innerHTML = h;
  f.scrollTop = stick ? f.scrollHeight : f.scrollHeight - keep;
  const rb = $('#replybar'), rm = ui.reply && state.messages.find(x => x.id === ui.reply);
  rb.hidden = !rm;
  if (rm) rb.innerHTML = `<span>Replying to <b>${esc(U(rm.u).name)}</b></span><button data-a="cancel" aria-label="Cancel reply">✕</button>`;
}

function memberRow(u, g) {
  return `<div class="mb${stat(u) === 'offline' ? ' off' : ''}">${av(u, 40, true)}<div><b style="color:${rc(u.id, g)}">${esc(u.name)}</b>${u.bot ? '<em class="tag">APP</em>' : ''}${u.custom ? `<small>${esc(u.custom)}</small>` : ''}</div></div>`;
}

function right() {
  const c = state.channels[ui.ch], g = state.guilds[c.g];
  const tabs = ['members', 'pins'].map(t => `<button data-r="${t}" class="${ui.rtab === t ? 'on' : ''}">${t === 'pins' ? 'Pinned' : 'Members'}</button>`).join('');
  let h = `<div class="rh"><b>${c.g === 'home' ? '@ ' + esc(U(c.u).name) : '# ' + esc(c.name)}</b><div class="tabs">${tabs}</div></div>`;
  if (ui.rtab === 'pins') {
    const p = msgsOf(c.id).filter(m => m.pinned);
    h += p.length ? p.map(m => `<div class="pin"><b style="color:${rc(m.u, g)}">${esc(U(m.u).name)}</b><div>${md(m.text)}</div></div>`).join('') : '<p class="empty">No pinned messages in this channel yet.</p>';
  } else {
    const ids = g ? Object.keys(g.members) : ['u0', c.u], mem = ids.map(U), on = u => stat(u) !== 'offline';
    const top = u => rolesOf(u.id, g).find(r => r.hoist), used = new Set(), sec = (t, l) => l.length ? `<div class="gp">${esc(t)} — ${l.length}</div>${l.map(u => memberRow(u, g)).join('')}` : '';
    const hoisted = Object.values(state.roles).filter(r => r.g === g?.id && r.hoist).sort((a, b) => b.pos - a.pos);
    for (const r of hoisted) { const l = mem.filter(u => on(u) && top(u)?.id === r.id); l.forEach(u => used.add(u.id)); h += sec(r.name, l); }
    h += sec('Online', mem.filter(u => on(u) && !used.has(u.id))) + sec('Offline', mem.filter(u => !on(u)));
  }
  $('#right').innerHTML = h;
}

const STATUS = [['online', 'Online'], ['idle', 'Idle'], ['dnd', 'Do Not Disturb'], ['invisible', 'Invisible']];
function page() {
  const p = $('#page'), show = ui.panel === 'left' && ui.tab !== 'servers';
  p.hidden = !show;
  if (!show) return;
  const me = U('u0');
  if (ui.tab === 'dms') p.innerHTML = '<h2>Messages</h2>' + chans('home').map(dmRow).join('');
  else if (ui.tab === 'notifs') {
    const l = Object.values(state.channels).filter(c => unread(c.id).mentions);
    p.innerHTML = '<h2>Notifications</h2>' + (l.length ? l.map(c => `<div class="ch" data-c="${c.id}"><i>@</i><span>${c.type === 'dm' ? esc(U(c.u).name) : '#' + esc(c.name)} · ${unread(c.id).mentions} mention</span></div>`).join('') : '<p class="empty">You are all caught up. New mentions will show up here.</p>');
  } else p.innerHTML = `<h2>You</h2><div class="you">${av(me, 72, true)}<div><b>${esc(me.name)}</b><small>${esc(me.custom)}</small></div></div>` +
    STATUS.map(([k, l]) => `<button class="opt${me.status === k ? ' on' : ''}" data-st="${k}"><span class="av dot st-${k === 'invisible' ? 'offline' : k}" style="width:14px;height:14px"></span>${l}</button>`).join('') +
    `<input id="cust" placeholder="Set a custom status" value="${esc(me.custom)}">`;
}

function tabs() {
  const n = Object.values(state.channels).reduce((a, c) => a + unread(c.id).mentions, 0);
  $('#tabs').innerHTML = [['servers', '🏠', 'Home'], ['dms', '💬', 'Messages'], ['notifs', '🔔', 'Notifications'], ['you', '👤', 'You']]
    .map(([k, i, l]) => `<button data-t="${k}" class="${ui.tab === k ? 'on' : ''}"><span>${i}${k === 'notifs' && n ? `<i class="bdg">${n}</i>` : ''}</span>${l}</button>`).join('');
}

function renderAll(stick) { rail(); chlist(); head(); feed(stick); right(); page(); tabs(); }
function go(p) { ui.panel = p; if (p === 'left') ui.tab = 'servers'; app.dataset.panel = p; page(); tabs(); }
function open(id) { ui.ch = id; ui.g = state.channels[id].g; ui.sel = null; ui.reply = null; ui.rtab = 'members'; markRead(); save(); go('center'); renderAll(true); }
function react(id, e) {
  const m = state.messages.find(x => x.id === id), a = m.reacts[e] || (m.reacts[e] = []), i = a.indexOf('u0');
  i < 0 ? a.push('u0') : a.splice(i, 1);
  if (!a.length) delete m.reacts[e];
  save(); feed(false);
}
function post() {
  const t = $('#msg').value.trim();
  if (!t) return;
  state.messages.push({ id: uid(), ch: ui.ch, u: 'u0', t: Date.now(), text: t, reply: ui.reply, reacts: {}, pinned: false });
  ui.reply = null; ui.sel = null; $('#msg').value = ''; $('#send').textContent = '🎤'; $('#send').classList.remove('has');
  markRead(); save(); renderAll(true);
}

app.addEventListener('click', e => {
  if (ui.panel !== 'center' && e.target.closest('#center')) return go('center');
  const t = e.target.closest('[data-sp],[data-a],[data-g],[data-c],[data-k],[data-m],[data-t],[data-st],[data-r]');
  if (!t) return;
  const d = t.dataset, mid = t.closest('[data-m]')?.dataset.m;
  if ('sp' in d) t.classList.toggle('on');
  else if (d.a === 'left' || d.a === 'right') go(d.a);
  else if (d.a === 'react') react(mid, d.e);
  else if (d.a === 'reply') { ui.reply = mid; ui.sel = null; feed(false); $('#msg').focus(); }
  else if (d.a === 'cancel') { ui.reply = null; feed(false); }
  else if (d.g) { ui.g = d.g; rail(); chlist(); }
  else if (d.c) open(d.c);
  else if (d.k) { state.collapsed[d.k] = !state.collapsed[d.k]; save(); chlist(); }
  else if (d.t) { ui.tab = d.t; ui.panel = 'left'; app.dataset.panel = 'left'; page(); tabs(); }
  else if (d.st) { state.users.u0.status = d.st; save(); renderAll(false); }
  else if (d.r) { ui.rtab = d.r; right(); }
  else if (d.m) { ui.sel = ui.sel === d.m ? null : d.m; feed(false); }
});

let sx = 0, sy = 0;
app.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
app.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
  if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) / 1.5 || e.target.closest('pre,input')) return;
  go(dx > 0 ? (ui.panel === 'right' ? 'center' : 'left') : (ui.panel === 'left' ? 'center' : 'right'));
}, { passive: true });

$('#msg').addEventListener('input', e => { const has = !!e.target.value.trim(); $('#send').textContent = has ? '➤' : '🎤'; $('#send').classList.toggle('has', has); });
$('#msg').addEventListener('keydown', e => { if (e.key === 'Enter') post(); });
$('#send').addEventListener('click', post);
$('#emoji').addEventListener('click', () => { $('#msg').value += '😄'; $('#msg').dispatchEvent(new Event('input')); $('#msg').focus(); });
app.addEventListener('change', e => { if (e.target.id === 'cust') { state.users.u0.custom = e.target.value.trim(); save(); right(); } });

markRead();
renderAll(true);
