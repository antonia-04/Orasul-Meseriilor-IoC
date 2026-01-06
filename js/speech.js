let voicesReady = false;

speechSynthesis.onvoiceschanged = () => {
    voicesReady = true;
};

function stopAllSpeech() {
    speechSynthesis.cancel();
    removeInteractionBlocker();
}

function say(text) {
    function speakNow() {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = "ro-RO";

        const voices = speechSynthesis.getVoices();
        console.log("Available voices:", voices);
        const roVoice = voices.find(v => v.lang.toLowerCase().startsWith('ro'));

        if (roVoice) {
            msg.voice = roVoice;
        }

        msg.rate = 1;
        // Block user interaction while speech is playing
        msg.onstart = () => createInteractionBlocker();
        msg.onend = () => removeInteractionBlocker();
        msg.onerror = () => removeInteractionBlocker();

        speechSynthesis.speak(msg);
    }

    // If voices NOT ready yet → wait a bit then retry
    if (!voicesReady || speechSynthesis.getVoices().length === 0) {
        setTimeout(() => say(text), 100);
        return;
    }

    speakNow();
}

// Creates a full-screen transparent overlay that blocks pointer events
function createInteractionBlocker() {
    if (document.getElementById('interaction-blocker')) return;
    const div = document.createElement('div');
    div.id = 'interaction-blocker';
    Object.assign(div.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '2147483647',
        background: 'transparent',
        cursor: 'wait'
    });
    div.setAttribute('aria-hidden', 'true');
    document.body.appendChild(div);
}

function removeInteractionBlocker() {
    const el = document.getElementById('interaction-blocker');
    if (el && el.parentNode) el.parentNode.removeChild(el);
}

function speakOnFirstGesture(text) {
    function handler() {
        say(text);
        document.removeEventListener('click', handler);
        document.removeEventListener('keydown', handler);
    }
    document.addEventListener('click', handler);
    document.addEventListener('keydown', handler);
}
