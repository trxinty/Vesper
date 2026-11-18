/*
 * Vesper state schema (normalized, persisted to localStorage under "vesper.v1"):
 *   users:      { id: {id,name,color,status:'online|idle|dnd|invisible|offline',custom,bot} }
 *   guilds:     { id: {id,name,color,members:{userId:[roleId]}} }
 *   roles:      { id: {id,g,name,color,hoist,pos} }
 *   categories: { id: {id,g,name,pos} }
 *   channels:   { id: {id,g,cat,name,type:'text|voice|forum|dm',pos,voice:[userId],u?} }   (DMs: g:'home', u = peer)
 *   messages:   [ {id,ch,u,t,text,reply:messageId|null,reacts:{emoji:[userId]},pinned} ]
 *   read:       { channelId: lastReadMessageId }      collapsed: { categoryId: true }      seq: next message number
 * Open with ?reset to restore the seed data.
 */
const KEY = 'vesper.v1', now = Date.now(), M = 6e4;
const U = (id, name, color, status, custom = '', bot = false) => ({ id, name, color, status, custom, bot });

function seed() {
  const users = {
    u0: U('u0', 'you', '#5865f2', 'online', 'Building Vesper'),
    u1: U('u1', 'nova', '#eb459e', 'online', 'listening to lofi'),
    u2: U('u2', 'kai', '#3ba55d', 'idle'),
    u3: U('u3', 'mira', '#e08a1e', 'dnd', 'in a meeting'),
    u4: U('u4', 'orbit', '#4752c4', 'online', 'Watching the server', true),
    u5: U('u5', 'juno', '#ed4245', 'offline'),
    u6: U('u6', 'pax', '#9b59b6', 'offline'),
  };
  const roles = {
    r1: { id: 'r1', g: 'g1', name: 'Admin', color: '#f0b232', hoist: true, pos: 3 },
    r2: { id: 'r2', g: 'g1', name: 'Mods', color: '#3ba55d', hoist: true, pos: 2 },
    r3: { id: 'r3', g: 'g1', name: 'Bots', color: '#8e9dff', hoist: true, pos: 1 },
  };
  const guilds = {
    g1: { id: 'g1', name: 'Vesper HQ', color: '#5865f2', members: { u0: ['r1'], u1: ['r1'], u2: ['r2'], u3: [], u4: ['r3'], u5: [], u6: [] } },
    g2: { id: 'g2', name: 'Pixel Pals', color: '#eb459e', members: { u0: [], u1: [], u3: [], u5: [] } },
  };
  const K = (id, g, name, pos) => ({ id, g, name, pos });
  const categories = { k1: K('k1', 'g1', 'Info', 0), k2: K('k2', 'g1', 'Chat', 1), k3: K('k3', 'g1', 'Voice', 2), k4: K('k4', 'g2', 'Text', 0), k5: K('k5', 'g2', 'Voice', 1) };
  const C = (id, g, cat, name, type, pos, voice = []) => ({ id, g, cat, name, type, pos, voice });
  const channels = {
    c3: C('c3', 'g1', 'k1', 'rules', 'text', 0), c1: C('c1', 'g1', 'k2', 'general', 'text', 0), c2: C('c2', 'g1', 'k2', 'dev', 'text', 1),
    c5: C('c5', 'g1', 'k2', 'showcase', 'forum', 2), v1: C('v1', 'g1', 'k3', 'Lounge', 'voice', 0, ['u1', 'u2']), v2: C('v2', 'g1', 'k3', 'Study Room', 'voice', 1),
    c6: C('c6', 'g2', 'k4', 'general', 'text', 0), c7: C('c7', 'g2', 'k4', 'memes', 'text', 1), v3: C('v3', 'g2', 'k5', 'Game Night', 'voice', 0, ['u3']),
    d1: { id: 'd1', g: 'home', type: 'dm', u: 'u1', voice: [] }, d2: { id: 'd2', g: 'home', type: 'dm', u: 'u3', voice: [] },
  };
  let n = 0;
  const messages = [];
  const m = (ch, u, ago, text, x = {}) => { const id = 'm' + (++n); messages.push({ id, ch, u, t: now - ago * M, text, reply: x.reply || null, reacts: x.r || {}, pinned: !!x.p }); return id; };
  m('c3', 'u1', 2000, '**Be kind.** No spam. Keep chats on topic.\n> Mods have the final say', { p: true });
  m('c1', 'u1', 300, 'welcome to **Vesper HQ** 👋 grab a role and say hi', { p: true, r: { '👋': ['u2', 'u3', 'u0'] } });
  m('c1', 'u1', 299, 'rules are in #rules, be kind and have fun');
  m('c1', 'u3', 240, 'morning all ☕', { r: { '☕': ['u1', 'u2'] } });
  const k = m('c1', 'u2', 90, 'anyone tried the new build? `v0.4.2` feels *so* smooth');
  m('c1', 'u2', 88, 'the sliding drawers especially ~~laggy~~ buttery');
  m('c1', 'u1', 60, '@kai yeah the gesture physics are great', { reply: k, r: { '🔥': ['u2'], '👍': ['u0', 'u3'] } });
  const r1 = m('c1', 'u0', 30, 'working on __phase 1__ now, will share a demo soon');
  const r2 = m('c1', 'u3', 6, '@you can you review the PR when you get a sec? ||it is tiny||');
  m('c1', 'u1', 4, 'also ping @everyone for the demo day');
  m('c2', 'u4', 45, 'Build **passed** ✅\n```js\nconst vesper = await boot();\nconsole.log("ready", 42); // hello\n```');
  m('c2', 'u2', 40, 'nice. lint is clean too');
  const d = m('c2', 'u2', 12, 'merging after lunch');
  m('c6', 'u3', 500, 'game night friday?');
  m('c6', 'u1', 20, 'count me in 🎮');
  m('c7', 'u5', 100, 'this meme again ||spoiler||');
  m('d1', 'u1', 15, 'hey! loving the app so far');
  m('d1', 'u1', 14, 'can we sync tomorrow?');
  m('d2', 'u0', 200, 'thanks for the review');
  m('d2', 'u3', 190, 'any time 🙂');
  const read = {};
  for (const id in channels) { const l = messages.filter(x => x.ch === id); if (l.length) read[id] = l[l.length - 1].id; }
  read.c1 = r1; read.c2 = d; read.c6 = 'm' + (messages.findIndex(x => x.ch === 'c6') + 1); read.d1 = undefined;
  return { users, guilds, roles, categories, channels, messages, read, collapsed: {}, seq: n };
}

function load() {
  try { if (!location.search.includes('reset')) { const s = JSON.parse(localStorage.getItem(KEY)); if (s) return s; } } catch (e) { /* fall through to seed */ }
  return seed();
}

export const state = load();
let timer;
export const save = () => { clearTimeout(timer); timer = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn('Vesper: storage unavailable', e); } }, 150); };
export const uid = () => 'm' + (++state.seq);
export const msgsOf = id => state.messages.filter(m => m.ch === id).sort((a, b) => a.t - b.t);
export function unread(id) {
  const l = msgsOf(id), i = l.findIndex(m => m.id === state.read[id]);
  const n = l.slice(i + 1).filter(m => m.u !== 'u0');
  return { count: n.length, mentions: n.filter(m => /@you\b/i.test(m.text)).length };
}
