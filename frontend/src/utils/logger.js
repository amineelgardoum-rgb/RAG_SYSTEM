const API_BASE_URL = 'http://127.0.0.1:8000';

const sendLog = async (level, message, name = 'frontend', metadata = null) => {
    try {
        await fetch(`${API_BASE_URL}/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level, message, name, metadata }),
        });
    } catch (err) {
        console.error('Failed to send log to backend:', err);
    }
};

export const logger = {
    info: (message, metadata = null) => {
        console.log(`[INFO] ${message}`, metadata || '');
        sendLog('info', message, 'frontend', metadata);
    },
    error: (message, metadata = null) => {
        console.error(`[ERROR] ${message}`, metadata || '');
        sendLog('error', message, 'frontend', metadata);
    },
    warn: (message, metadata = null) => {
        console.warn(`[WARN] ${message}`, metadata || '');
        sendLog('warn', message, 'frontend', metadata);
    },
    debug: (message, metadata = null) => {
        console.debug(`[DEBUG] ${message}`, metadata || '');
        sendLog('debug', message, 'frontend', metadata);
    }
};

export default logger;
