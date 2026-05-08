function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 2px' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#94a3b8',
          animation: 'bounce 1.2s infinite',
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  );
}
export default TypingIndicator;