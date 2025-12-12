/* =========================================
   logica jocului chimist
   (foloseste functia 'say' din speech.js)
   ========================================= */

// functie ajutatoare pentru a evita erorile daca speech.js nu s-a incarcat
function safeSay(text) {
    if (typeof say === "function") {
        say(text);
    } else {
        console.warn("audio nu functioneaza: say() lipseste");
    }
}

// initializare la incarcarea paginii
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        safeSay("Salut! Eu sunt Ana. Apasă pe butonul de start ca să ne jucăm!");
        const startBtn = document.querySelector('.btn-icon-large');
        if(startBtn) startBtn.classList.add('pulse-element');
    }, 500);
});

/* --- navigare intre scene --- */
function nextScene(sceneId) {
    // ascunde toate scenele
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });
    // afiseaza scena ceruta
    document.getElementById(sceneId).classList.add('active');

    // actiuni specifice fiecarei scene
    if(sceneId === "scena-1") {
        safeSay("Pasul unu. Apasă pe ochelari și pe halat ca să mă îmbraci.");
        document.querySelectorAll('.items-rack .item').forEach(el => el.classList.add('pulse-element'));
    } 
    else if(sceneId === "scena-2") {
        safeSay("Pasul doi. Apasă doar pe obiectele de laborator pentru a le pune în cutie.");
    } 
    else if(sceneId === "scena-3") {
        safeSay("Pasul trei. Experimentul! Apasă pe sticluțe ca să amesteci culorile.");
    } 
    else if(sceneId === "scena-final") {
        safeSay("Bravo! Ești un super chimist! Apasă pe căsuță pentru a pleca.");
    }
}

/* --- joc 1: echipament --- */
let itemsWorn = 0;

function chooseClothing(type, element, isCorrect) {
    if (element.classList.contains('used')) return;

    if (isCorrect) {
        safeSay("Bravo!");

        let clothingItem = document.getElementById('wear-' + type);
        if (clothingItem) clothingItem.classList.remove('hidden');

        element.classList.add('used');
        element.classList.remove('pulse-element'); 
        element.style.borderColor = "#4caf50";
        element.style.backgroundColor = "#e8f5e9";

        itemsWorn++;

        if (itemsWorn === 2) {
            safeSay("Super! Acum sunt echipată. Apasă pe săgeată.");
            
            document.querySelectorAll('.items-rack .item').forEach(el => el.classList.remove('pulse-element'));

            setTimeout(() => {
                let btn = document.getElementById('btn-next-1');
                btn.classList.remove('hidden');
                btn.classList.add('pulse-element');
            }, 500);
        }

    } else {
        safeSay("Nu, nu. Asta nu e pentru laborator.");
        
        element.style.animation = "shake 0.4s";
        element.style.borderColor = "#ff5252";
        setTimeout(() => {
            element.style.animation = "";
            element.style.borderColor = "#b2ebf2";
        }, 400);
    }
}

/* --- joc 2: sortare --- */
let goodItemsFound = 0;

function sortMe(element, isGood) {
    if (window.getComputedStyle(element).opacity === "0") return;

    if (isGood) {
        safeSay("Corect!");
        
        element.style.transition = "all 0.5s ease-in";
        element.style.transform = "translateY(150px) scale(0.2)";
        element.style.opacity = "0";
        element.style.pointerEvents = "none";

        goodItemsFound++;
        
        let star = document.getElementById('star-' + goodItemsFound);
        if(star) star.classList.add('active');

        if (goodItemsFound === 4) { 
            safeSay("Ai făcut curățenie lună! Apasă pe săgeată.");
            document.getElementById('feedback-visual').innerHTML = "✅"; 
            
            let btn = document.getElementById('btn-next-2');
            btn.classList.remove('hidden');
            btn.classList.add('pulse-element');
        } else {
             document.getElementById('feedback-visual').innerHTML = "👍";
        }
    } else {
        safeSay("Asta nu e pentru laborator.");
        
        element.style.animation = "shake 0.4s";
        document.getElementById('feedback-visual').innerHTML = "❌";
        setTimeout(() => {
            element.style.animation = "float 4s infinite ease-in-out"; 
        }, 400);
    }
}

/* --- joc 3: potiuni --- */
let mixedColors = [];

function addPotion(color) {
    if (mixedColors.length >= 2) return;

    mixedColors.push(color);
    let liquid = document.getElementById('liquid-main');

    let potionImg = document.querySelector(`.potion[onclick*="${color}"]`);
    if (potionImg) {
        potionImg.style.transform = "rotate(45deg) translateY(20px)";
        setTimeout(() => potionImg.style.transform = "", 300);
    }

    if (mixedColors.length === 1) {
        liquid.style.height = "50%";
        liquid.style.backgroundColor = getColorCode(color);
        safeSay("Mai pune o culoare.");
    } else if (mixedColors.length === 2) {
        liquid.style.height = "85%";
        checkMix();
    }
}

function getColorCode(name) {
    if (name === 'red') return '#ff5252';
    if (name === 'blue') return '#2196f3';
    if (name === 'yellow') return '#ffeb3b';
    return '#ccc';
}

function checkMix() {
    let liquid = document.getElementById('liquid-main');
    let bubbles = document.getElementById('bubbles');

    if (mixedColors.includes('blue') && mixedColors.includes('yellow')) {
        liquid.style.transition = "background-color 1s";
        liquid.style.backgroundColor = "#4caf50"; 
        bubbles.style.display = "block";

        safeSay("Uau! Ai făcut verde! Apasă pe săgeată.");
        
        let btn = document.getElementById('btn-final');
        btn.classList.remove('hidden');
        btn.classList.add('pulse-element');

    } else {
        liquid.style.backgroundColor = "#795548"; 
        safeSay("O, nu. A ieșit maro. Apasă pe coșul de gunoi ca să golești paharul.");
    }
}

function resetPotions() {
    mixedColors = [];
    let liquid = document.getElementById('liquid-main');
    liquid.style.height = "0%";
    liquid.style.backgroundColor = "transparent";
    document.getElementById('bubbles').style.display = "none";
    
    safeSay("Am golit paharul. Încearcă din nou.");
    document.getElementById('btn-final').classList.add('hidden');
}