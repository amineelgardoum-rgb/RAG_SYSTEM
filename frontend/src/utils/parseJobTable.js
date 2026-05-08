export default function parseJobTable(text) {
  const lines = text.split('\n');
  const tableLines = lines.filter(l => l.trim().startsWith('|'));
  if (tableLines.length < 3) return null;

  const rows = tableLines
    .filter(l => !l.match(/^\|[-\s|]+\|$/))
    .map(l =>
      l.split('|')
        .map(c => c.trim())
        .filter(c => c.length > 0)
    );

  const headers = rows[0].map(h => h.toLowerCase());
  const dataRows = rows.slice(1);

  const getCol = (row, ...names) => {
    for (const name of names) {
      const idx = headers.findIndex(h => h.includes(name));
      if (idx !== -1 && row[idx]) return row[idx];
    }
    return '';
  };

  return dataRows.map(row => {
    const applyRaw = getCol(row, 'apply', 'link', 'url');
    const urlMatch = applyRaw.match(/https?:\/\/[^\s)]+/);
    return {
      title: getCol(row, 'title'),
      company: getCol(row, 'company'),
      location: getCol(row, 'location'),
      type: getCol(row, 'type'),
      url: urlMatch ? urlMatch[0] : null,
    };
  }).filter(j => j.title);
}
