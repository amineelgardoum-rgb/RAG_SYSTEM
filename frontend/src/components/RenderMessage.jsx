import JobCards from "./jobCards.jsx";
import  parseJobTable  from "../utils/parseJobTable.js";
import  splitAroundTable  from "../utils/splitAroundTable.js";

function RenderMessage({ text }) {
  const { before, after, hasTable } = splitAroundTable(text);

  if (hasTable) {
    const jobs = parseJobTable(text);
    if (jobs && jobs.length > 0) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {before && (
            <p style={{ fontSize: '14px', color: '#cbd5e1', margin: 0, lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>
              {before}
            </p>
          )}
          <JobCards jobs={jobs} />
          {after && (
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
              {after}
            </p>
          )}
        </div>
      );
    }
  }

  // Plain text fallback
  return (
    <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {text}
    </pre>
  );
}
export default RenderMessage;