export const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const HL = /(\/\/.*)|(&quot;.*?&quot;|'.*?')|\b(const|let|var|function|return|if|else|for|while|import|export|class|new|await|async)\b|\b(\d+)\b/g;
const hl = c => c.replace(HL, (m, cm, st, kw, nu) =>
  `<span class="${cm ? 'c' : st ? 's' : kw ? 'k' : 'n'}">${m}</span>`);

/** Discord-style markdown -> safe HTML. names: { lowercaseUsername: userId } for @mention pills. */
export function md(src, names = {}) {
  const stash = [];
  const hold = h => `\u0000${stash.push(h) - 1}\u0000`;
  let s = esc(src);
  s = s.replace(/```(?:\w+\n)?([\s\S]*?)```/g, (_, c) => hold(`<pre class="code"><code>${hl(c.replace(/\n$/, ''))}</code></pre>`));
  s = s.replace(/`([^`\n]+)`/g, (_, c) => hold(`<code>${c}</code>`));
  s = s.replace(/^&gt; (.*)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\|\|([\s\S]+?)\|\|/g, '<span class="spoiler" data-sp>$1</span>')
    .replace(/\*\*([\s\S]+?)\*\*/g, '<b>$1</b>')
    .replace(/__([\s\S]+?)__/g, '<u>$1</u>')
    .replace(/\*([^*\n]+)\*/g, '<i>$1</i>')
    .replace(/~~([\s\S]+?)~~/g, '<s>$1</s>')
    .replace(/@(\w+)/g, (m, n) => (names[n.toLowerCase()] || n === 'everyone') ? `<span class="mention">@${n}</span>` : m);
  return s.replace(/<\/blockquote>\n/g, '</blockquote>')
    .replace(/\u0000(\d+)\u0000/g, (_, i) => stash[i])
    .replace(/\n/g, '<br>');
}
