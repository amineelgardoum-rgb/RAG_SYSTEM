import typeBadgeStyle from "../utils/typeBadgeStyle.js";
import {LINK_ICON} from "../components/icons.jsx"
function JobCards({ jobs, summary }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {summary && (
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>
          {summary}
        </p>
      )}
      {jobs.map((job, i) => (
        <div key={i} style={{
          background: '#0a1628',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          transition: 'border-color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}
        >
          {/* Title */}
          <p style={{
            fontSize: '14px', fontWeight: 500,
            color: '#e2e8f0', margin: 0,
            textTransform: 'capitalize',
            fontFamily: "'Inter', sans-serif",
          }}>
            {job.title}
          </p>

          {/* Company */}
          {job.company && (
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, fontFamily: "'Inter', sans-serif" }}>
              🏢 {job.company}
            </p>
          )}

          {/* Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
            {job.location && job.location !== 'unknown' && (
              <span style={{
                fontSize: '11px', padding: '3px 10px', borderRadius: '999px',
                background: '#0f1e3d', color: '#60a5fa', border: '1px solid #1e3a8a',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                📍 {job.location}
              </span>
            )}
            {job.type && job.type !== 'unknown' && (
              <span style={{
                fontSize: '11px', padding: '3px 10px', borderRadius: '999px',
                fontFamily: "'JetBrains Mono', monospace",
                ...typeBadgeStyle(job.type),
              }}>
                {job.type}
              </span>
            )}
          </div>

          {/* Apply button */}
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              style={{
                alignSelf: 'flex-start',
                marginTop: '4px',
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '11px', padding: '5px 12px', borderRadius: '8px',
                background: '#0f172a', color: '#93c5fd',
                border: '1px solid #1e40af',
                textDecoration: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1e3a8a'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.color = '#93c5fd'; }}
            >
              {LINK_ICON} APPLY
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
export default JobCards;