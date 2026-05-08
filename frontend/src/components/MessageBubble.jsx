import { useState } from "react";
import RenderMessage from "./renderMessage.jsx";
import { USER_ICON, BOT_ICON, COPY_ICON } from "./icons.jsx";
function MessageBubble({ msg }) {
  const isUser = msg.sender === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      gap: '10px',
      animation: 'fadeSlideIn 0.25s ease forwards',
    }}>
      <div style={{
        width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isUser ? '#1e40af' : '#0f172a',
        color: '#e2e8f0', marginTop: '2px',
        border: '1px solid ' + (isUser ? '#3b82f6' : '#334155'),
      }}>
        {isUser ? USER_ICON : BOT_ICON}
      </div>

      <div style={{
        maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '4px',
        alignItems: isUser ? 'flex-end' : 'flex-start',
      }}>
        <span style={{ fontSize: '11px', color: '#64748b', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>
          {isUser ? 'YOU' : 'SQL ASSISTANT'} · {msg.time}
        </span>

        <div style={{
          padding: '12px 16px',
          borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          background: isUser ? 'linear-gradient(135deg, #1e3a8a, #1e40af)' : '#0f1929',
          border: '1px solid ' + (isUser ? '#3b82f6' : '#1e293b'),
          color: isUser ? '#e0f2fe' : '#cbd5e1',
          fontSize: '14px', lineHeight: '1.7',
          fontFamily: "'Inter', sans-serif",
          boxShadow: isUser ? '0 2px 12px rgba(30,64,175,0.2)' : '0 2px 8px rgba(0,0,0,0.3)',
          width: '100%',
        }}>
          {isUser
            ? <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.text}</pre>
            : <RenderMessage text={msg.text} />
          }
        </div>

        {!isUser && (
          <button onClick={handleCopy} style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: copied ? '#22c55e' : '#475569',
            fontSize: '11px', padding: '2px 0', transition: 'color 0.15s',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {COPY_ICON} {copied ? 'COPIED' : 'COPY'}
          </button>
        )}
      </div>
    </div>
  );
}
export default MessageBubble;
