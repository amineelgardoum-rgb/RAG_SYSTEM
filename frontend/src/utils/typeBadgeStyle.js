export default function typeBadgeStyle(type) {
  const t = (type || '').toLowerCase();
  if (t.includes('intern') || t.includes('stage')) return { background: '#1e3a5f', color: '#93c5fd', border: '1px solid #1e40af' };
  if (t.includes('remote')) return { background: '#14532d', color: '#86efac', border: '1px solid #166534' };
  if (t.includes('full')) return { background: '#1c2a1e', color: '#6ee7b7', border: '1px solid #065f46' };
  if (t.includes('temp') || t.includes('contract')) return { background: '#2d1b00', color: '#fbbf24', border: '1px solid #92400e' };
  return { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' };
}

