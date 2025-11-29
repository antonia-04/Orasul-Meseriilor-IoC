let voicesReady = false;

speechSynthesis.onvoiceschanged = () => {
    voicesReady = true;
};

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
        speechSynthesis.speak(msg);
    }

    // If voices NOT ready yet → wait a bit then retry
    if (!voicesReady || speechSynthesis.getVoices().length === 0) {
        setTimeout(() => say(text), 100);
        return;
    }

    speakNow();
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
