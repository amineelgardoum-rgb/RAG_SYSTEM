const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const extractText = (answer) => {
    if (typeof answer === 'string') return answer;
    if (Array.isArray(answer)) {
        return answer
            .map(block => (typeof block === 'object' ? block?.text || JSON.stringify(block) : String(block)))
            .join('\n');
    }
    if (typeof answer === 'object' && answer !== null) {
        return answer.text || answer.content || JSON.stringify(answer, null, 2);
    }
    return String(answer);

};

export  {
    getTime,
    extractText
}
