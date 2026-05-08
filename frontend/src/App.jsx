import { useState, useEffect, useRef } from 'react';
import TypingIndicator from "./components/TypingIndicator.jsx";
import MessageBubble from "./components/MessageBubble.jsx";
import { DB_ICON, SEND_ICON, CLEAR_ICON, BOT_ICON, REFRESH_ICON } from "./components/icons.jsx";
import { getTime, extractText } from "./utils/helpers.js";
import logger from "./utils/logger.js";


export default function App() {
  const [messages, setMessages] = useState([{
    id: 1,
    text: "Connected to database. I'm your SQL Assistant — ask me anything about your data, schema, or run queries in plain English.",
    sender: 'bot',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sessionCount, setSessionCount] = useState(1);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { 
    logger.info("Application started");
    scrollToBottom(); 
  }, []);
  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

  const handleSend = async () => {
    const query = input.trim();
    if (!query || isLoading) return;

    logger.info(`User query: ${query}`);
    setMessages(prev => [...prev, { id: Date.now(), text: query, sender: 'user', time: getTime() }]);
    setInput('');
    setIsLoading(true);
    setSessionCount(c => c + 1);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network error: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      logger.info("Response received from backend", { answer: data.answer });
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: extractText(data.answer),
        sender: 'bot',
        time: getTime(),
      }]);
    } catch (error) {
      logger.error(`Chat error: ${error.message}`);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: '⚠ Connection error. Verify the server is running at http://127.0.0.1:8000',
        sender: 'bot',
        time: getTime(),
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleClear = () => {
    logger.info("Session cleared by user");
    setMessages([{ id: Date.now(), text: 'Session cleared. Ready for a new conversation.', sender: 'bot', time: getTime() }]);
    setSessionCount(1);
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    logger.info("Credentials refresh requested");
    setIsRefreshing(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/refresh', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Refresh failed');
      const data = await response.json();
      logger.info("Refresh success", data);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: '✅ Credentials and session refreshed successfully.',
        sender: 'bot',
        time: getTime(),
      }]);
    } catch (error) {
      logger.error(`Refresh error: ${error.message}`);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: '❌ Failed to refresh credentials. Please check the backend.',
        sender: 'bot',
        time: getTime(),
      }]);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060c18; min-height: 100vh; font-family: 'Inter', sans-serif; }
        #root { width: 100%; height: 100vh; display: flex; align-items: stretch; justify-content: center; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-5px); opacity: 1; } }
        @keyframes pulse-border { 0%, 100% { border-color: #1e3a8a; } 50% { border-color: #3b82f6; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
        .send-btn:hover:not(:disabled) { background: #2563eb !important; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,0.4) !important; }
        .send-btn:active:not(:disabled) { transform: translateY(0); }
        .clear-btn:hover { background: #1e293b !important; color: #f87171 !important; border-color: #7f1d1d !important; }
        .refresh-btn:hover:not(:disabled) { background: #1e293b !important; color: #3b82f6 !important; border-color: #1d4ed8 !important; }
        .refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .spinning { animation: spin 1s linear infinite; }
        input[type="text"]::placeholder { color: #334155; }
        input[type="text"]:disabled { opacity: 0.5; }
      `}</style>

      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', height: '100vh', background: '#080f1f', borderLeft: '1px solid #0f1929', borderRight: '1px solid #0f1929' }}>

        {/* HEADER */}
        <header style={{ padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #0f1929', background: '#06091a', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93c5fd', border: '1px solid #2563eb', boxShadow: '0 0 16px rgba(37,99,235,0.2)' }}>
              {DB_ICON}
            </div>
            <div>
              <h1 style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0', letterSpacing: '-0.01em' }}>SQL Assistant</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.6)', display: 'inline-block' }} />
                <span style={{ fontSize: '11px', color: '#64748b', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>CONNECTED · DB v14.2</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#475569', fontFamily: "'JetBrains Mono', monospace", background: '#0f1929', padding: '4px 10px', borderRadius: '6px', border: '1px solid #1e293b' }}>
              {sessionCount} msg{sessionCount !== 1 ? 's' : ''}
            </span>
            <button 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              className="refresh-btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0a1020', border: '1px solid #1e293b', borderRadius: '8px', color: '#64748b', fontSize: '11px', padding: '6px 10px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}
            >
              <span className={isRefreshing ? 'spinning' : ''}>{REFRESH_ICON}</span> REFRESH
            </button>
            <button onClick={handleClear} className="clear-btn" style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0a1020', border: '1px solid #1e293b', borderRadius: '8px', color: '#64748b', fontSize: '11px', padding: '6px 10px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>
              {CLEAR_ICON} CLEAR
            </button>
          </div>
        </header>

        {/* MESSAGES */}
        <main className="chat-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', animation: 'fadeSlideIn 0.25s ease forwards' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', animation: 'pulse-border 1.5s ease infinite' }}>
                {BOT_ICON}
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: '#0f1929', border: '1px solid #1e293b' }}>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* INPUT */}
        <footer style={{ padding: '16px 24px 20px', borderTop: '1px solid #0f1929', background: '#06091a', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#0a1020', border: '1px solid #1e293b', borderRadius: '14px', padding: '0 10px 0 18px', height: '52px', transition: 'border-color 0.2s' }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask anything about your database..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#cbd5e1', fontSize: '14px', lineHeight: '1', fontFamily: "'Inter', sans-serif", height: '24px', padding: 0 }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="send-btn"
              style={{ width: '38px', height: '38px', borderRadius: '10px', background: input.trim() && !isLoading ? '#1d4ed8' : '#0f172a', border: '1px solid ' + (input.trim() && !isLoading ? '#3b82f6' : '#1e293b'), color: input.trim() && !isLoading ? '#fff' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed', transition: 'all 0.2s', flexShrink: 0 }}
            >
              {SEND_ICON}
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}