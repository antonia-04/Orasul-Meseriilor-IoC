document.addEventListener("DOMContentLoaded", () => {
    const introScene = document.getElementById("scena-intro");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                say("Bună! Eu sunt Maria, doctorița ta! Vrei să înveți să ajuți pacienții împreună cu mine?");
            }
        });
    }, {
        threshold: 0.5
    });

    observer.observe(introScene);
});

/* navigare între scene */
function nextScene(sceneId) {
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });
    document.getElementById(sceneId).classList.add('active');
    
    if(sceneId==="scena-1")
        say("Alege instrumentele esențiale și halatul de doctor! Ai nevoie de două obiecte.");
    else if(sceneId==="scena-2")
        say("Pregătim trusa! Pune doar instrumentele medicale în cutia roșie.");
    else if(sceneId==="scena-3") {
        say("Acum citim! Citește cu voce tare cuvântul despărțit în silabe!");
        startReadingGame(); // Pornește jocul nou
    }
    else if(sceneId==="scena-final")
        say("Felicitări! Ești un super doctor! Apasă pe căsuță pentru a încerca o nouă meserie!");
}

/* JOC 1: ECHIPARE (fără schimbări) */
let itemsWorn = 0;

function chooseClothing(type, element, isCorrect) {
    if (element.classList.contains('used')) return;

    if (isCorrect) {
        say("Foarte bine!");

        let clothingItem = document.getElementById('wear-' + type);
        if (clothingItem) {
            clothingItem.classList.remove('hidden');
        }

        element.classList.add('used');
        element.style.borderColor = "#4caf50";
        element.style.backgroundColor = "#e8f5e9";

        itemsWorn++;

        if (itemsWorn === 2) {
            say("Super! Ești complet echipat! Apasă butonul pentru a continua.");
            
            setTimeout(() => {
                let btn = document.getElementById('btn-next-1');
                btn.classList.remove('hidden');
                btn.style.animation = "float 1s infinite"; 
                btn.scrollIntoView({behavior: "smooth"});
            }, 500);
        }

    } else {
        say("Nu e necesar! Mai încearcă!");
        element.style.animation = "shake 0.4s";
        element.style.borderColor = "#ff5252";

        setTimeout(() => {
            element.style.animation = "";
            element.style.borderColor = "#f48fb1";
        }, 400);
    }
}

/* JOC 2: SORTARE INSTRUMENTE (fără schimbări) */
let goodItemsFound = 0;
const totalGoodItems = 4;

function sortMe(element, isGood) {
    if (window.getComputedStyle(element).opacity === "0") return;
    
    let feedback = document.getElementById('feedback-text');

    if (isGood) {
        element.style.transition = "all 0.5s ease-in";
        element.style.transform = "translateY(150px) scale(0.2)"; 
        element.style.opacity = "0";
        element.style.pointerEvents = "none";

        goodItemsFound++;

        let ramase = totalGoodItems - goodItemsFound;

        if (ramase > 0) {
            feedback.innerText = "Super! Încă " + ramase + " instrumente.";
            feedback.style.color = "#388e3c";
            say("Super! Încă " + ramase);
        } else {
            feedback.innerText = "Perfect! Trusa medicală e completă.";
            say("Perfect! Trusa e completă. Apasă butonul pentru a continua.");
            document.getElementById('btn-next-2').classList.remove('hidden');
        }
    } else {
        element.style.animation = "shake 0.4s";
        feedback.innerText = "Nu! Asta nu e un instrument medical.";
        feedback.style.color = "#ff5252";
        say("Nu! Asta nu e un instrument.");
        setTimeout(() => {
            element.style.animation = "float 3s infinite ease-in-out";
            feedback.innerText = "Mai ai de găsit " + (totalGoodItems - goodItemsFound) + " obiecte corecte!";
            feedback.style.color = "#00838f";
        }, 400);
    }
}

/* JOC 3: JOCUL SILABELOR (Citire și Recunoaștere) */

const medicalWords = [
    { 
        src: '../imagini/doctorita/halat.svg', 
        syllables: 'HA - LAT',
        word: 'HALAT' // Cuvântul întreg pentru voce
    },
    { 
        src: '../imagini/doctorita/plasture.svg', 
        syllables: 'PLAS - TU - RE',
        word: 'PLASTURE'
    },
    { 
        src: '../imagini/doctorita/termometru.svg', 
        syllables: 'TER - MO - ME - TRU',
        word: 'TERMOMETRU'
    }
    // Stetoscop a fost eliminat
];

let currentWordIndex = 0;

function startReadingGame() {
    currentWordIndex = 0;
    document.getElementById('btn-final').classList.add('hidden');
    document.getElementById('btn-read-next').classList.remove('hidden');
    updateWordDisplay();
}

function updateWordDisplay() {
    if (currentWordIndex < medicalWords.length) {
        const wordData = medicalWords[currentWordIndex];
        
        const imgElement = document.getElementById('reading-image');
        const syllablesElement = document.getElementById('syllables-text');
        const nextBtn = document.getElementById('btn-read-next');

        // Aplică efect de fade out
        imgElement.style.opacity = 0;
        syllablesElement.style.opacity = 0;
        nextBtn.style.pointerEvents = 'none'; // Dezactivează butonul în timpul tranziției

        setTimeout(() => {
            // Actualizează conținutul
            imgElement.src = wordData.src;
            syllablesElement.innerHTML = wordData.syllables;
            
            // Re-afișează cu fade in
            imgElement.style.opacity = 1;
            syllablesElement.style.opacity = 1;

            nextBtn.innerText = `Am citit! ➡️`;
            nextBtn.style.pointerEvents = 'auto'; // Activează butonul

            // Vocea spune cuvântul întreg
            say("Te rog să citești cuvântul: " + wordData.word);

        }, 500); // 500ms pentru tranziția de fade

    } else {
        // Jocul s-a terminat
        document.getElementById('btn-read-next').classList.add('hidden');
        document.getElementById('btn-final').classList.remove('hidden');
        document.getElementById('syllables-text').innerHTML = '*** BRAVO! Ai citit toate cuvintele! ***';
        document.getElementById('syllables-text').style.color = '#388e3c';
        say("Bravo! Ai citit toate cuvintele de doctor. Apasă pe butonul albastru.");
    }
}

function nextWord() {
    currentWordIndex++;
    updateWordDisplay();
}