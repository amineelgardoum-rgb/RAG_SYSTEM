export default function splitAroundTable(text) {
  const tableStart = text.indexOf('|');
  const lines = text.split('\n');
  const tableLines = lines.filter(l => l.trim().startsWith('|'));
  if (tableLines.length < 3) return { before: text, after: '', hasTable: false };

  const firstTableLine = lines.findIndex(l => l.trim().startsWith('|'));
  const lastTableLine = lines.map((l, i) => l.trim().startsWith('|') ? i : -1).filter(i => i !== -1).pop();

  const before = lines.slice(0, firstTableLine).join('\n').trim();
  const after = lines.slice(lastTableLine + 1).join('\n').trim();
  return { before, after, hasTable: true };
}
