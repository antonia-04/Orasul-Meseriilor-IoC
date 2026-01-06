/* =========================================
   logica jocului doctorița - Silabe & Audio
   ========================================= */

function safeSay(text) {
    if (typeof say === "function") {
        say(text);
    } else {
        console.warn("audio nu functioneaza: say() lipseste");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        safeSay("Bună! Eu sunt Maria, doctorița ta! Apasă pe butonul de start ca să ne jucăm!");
        const startBtn = document.querySelector('#scena-intro .btn-icon-large');
        if(startBtn) startBtn.classList.add('pulse-element');
    }, 500);
});

function nextScene(sceneId) {
    document.querySelectorAll('.scene').forEach(scene => scene.classList.remove('active'));
    const targetScene = document.getElementById(sceneId);
    if(targetScene) {
        targetScene.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if(sceneId === "scena-1") {
        safeSay("Pasul unu. Apasă pe halat și pe stetoscop ca să mă îmbraci.");
    } 
    else if(sceneId === "scena-2") {
        safeSay("Pasul doi. Pune doar instrumentele medicale în trusă.");
    } 
    else if(sceneId === "scena-3") {
        startReadingGame();
    } 
    else if(sceneId === "scena-final") {
        safeSay("Bravo! Ești un doctor excelent! Apasă pe căsuță pentru a pleca.");
    }
}

/* --- JOC 1: ECHIPARE --- */
let itemsWorn = 0;
function chooseClothing(type, element, isCorrect) {
    if (element.classList.contains('used')) return;
    if (isCorrect) {
        safeSay("Bravo!");
        let clothingItem = document.getElementById('wear-' + type);
        if (clothingItem) clothingItem.classList.remove('hidden');
        element.classList.add('used');
        itemsWorn++;
        if (itemsWorn === 2) {
            safeSay("Bravo! Acum sunt echipată. Apasă pe săgeată.");
            let btn = document.getElementById('btn-next-1');
            if(btn) {
                btn.classList.remove('hidden');
                btn.classList.add('pulse-element');
            }
        }
    } else {
        safeSay("Nu, nu. Asta nu folosim la spital.");
        element.style.animation = "shake 0.4s";
    }
}

/* --- JOC 2: SORTARE --- */
let goodItemsFound = 0;
const totalGoodItems = 4;
function sortMe(element, isGood) {
    if (isGood) {
        safeSay("Corect!");
        element.style.opacity = "0";
        element.style.pointerEvents = "none";
        goodItemsFound++;
        
        let star = document.getElementById('star-' + goodItemsFound);
        if(star) star.style.opacity = "1";

        if (goodItemsFound === totalGoodItems) { 
            safeSay("Perfect! Trusa e gata. Apasă pe săgeată.");
            let btn = document.getElementById('btn-next-2');
            if(btn) {
                btn.classList.remove('hidden');
                btn.classList.add('pulse-element');
            }
        }
    } else {
        safeSay("Asta nu este pentru doctor.");
        element.style.animation = "shake 0.4s";
    }
}

/* --- JOC 3: CITIT / SILABE --- */
const medicalWords = [
    { src: '../imagini/doctorita/halat.svg', whole: 'Halat', syllables: 'HA - LAT' },
    { src: '../imagini/doctorita/plasture.svg', whole: 'Plasture', syllables: 'PLAS - TU - RE' },
    { src: '../imagini/doctorita/termometru.svg', whole: 'Termometru', syllables: 'TER - MO - ME - TRU' }
];

let currentWordIndex = 0;

function startReadingGame() {
    currentWordIndex = 0;
    updateWordDisplay();
}

function updateWordDisplay() {
    if (currentWordIndex < medicalWords.length) {
        const wordData = medicalWords[currentWordIndex];
        const imgElement = document.getElementById('reading-image');
        const syllablesElement = document.getElementById('syllables-text');
        const nextBtn = document.getElementById('btn-read-next');
        const finalBtn = document.getElementById('btn-final');

        // Resetăm elementele vizuale
        if(nextBtn) nextBtn.classList.add('hidden');
        if(finalBtn) finalBtn.classList.add('hidden');
        syllablesElement.innerHTML = ""; // Ștergem textul vechi
        syllablesElement.style.color = "#ec407a"; 

        imgElement.src = wordData.src;
        imgElement.classList.add('pulse-element');

        // 1. Maria spune cuvântul întreg (nedespărțit)
        safeSay(wordData.whole);

        // 2. Pauză de 2.5 secunde pentru ca cel mic să încerce să spună
        setTimeout(() => {
            // 3. Afișăm cuvântul despărțit în silabe pe ecran
            syllablesElement.innerHTML = wordData.syllables;
            
            // 4. Maria spune cuvântul despărțit corect
            safeSay("Spunem pe silabe: " + wordData.syllables);
            
            // 5. Afișăm săgeata după ce se termină explicația
            setTimeout(() => {
                if(nextBtn) {
                    nextBtn.classList.remove('hidden');
                    nextBtn.classList.add('pulse-element');
                }
            }, 2000);
        }, 2500);

    } else {
        // Finalul jocului de citit
        safeSay("Bravo! Ai învățat toate obiectele de doctor!");
        document.getElementById('syllables-text').innerHTML = "🌟 🌟 🌟";
        document.getElementById('btn-read-next').classList.add('hidden');
        
        let finalBtn = document.getElementById('btn-final');
        if(finalBtn) {
            finalBtn.classList.remove('hidden');
            finalBtn.classList.add('pulse-element');
        }
    }
}

function nextWord() {
    currentWordIndex++;
    updateWordDisplay();
}