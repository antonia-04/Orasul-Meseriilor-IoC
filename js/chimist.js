document.addEventListener("DOMContentLoaded", () => {

    const introScene = document.getElementById("scena-intro");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                say("Salut! Eu sunt Ana, prietena ta chimistă! Știi ce face un chimist? Amestecă lichide colorate și face magie în laborator! Vrei să învățăm să facem experimente împreună?");
            }
        });
    }, {
        threshold: 0.5 // visible at least 50%
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
        say("Alege hainele de protecție corecte!");
    else if(sceneId==="scena-2")
        say("Hai să facem ordine! Pune doar obiectele din laborator în cutia maro.")
    else if(sceneId==="scena-3")
        say("E timpul pentru experimente! Hai să facem o poțiune verde!")
    else if(sceneId==="scena-final")
        say("Bravoo! Ești un super chimist! Apasă pe căsuță pentru a încerca o nouă meserie!");
}

/* JOC 1*/
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

        console.log("Obiecte purtate: " + itemsWorn);

        if (itemsWorn === 2) {
            say("Bravo! Ai ales toate hainele de protecție corecte. Apasă butonul pentru a continua.");
            console.log("Ambele obiecte selectate! Afisez butonul.");
            
            setTimeout(() => {
                let btn = document.getElementById('btn-next-1');
                btn.classList.remove('hidden');
                
                btn.style.animation = "float 1s infinite"; 
                
                btn.scrollIntoView({behavior: "smooth"});
            }, 500);
        }

    } else {
        say("Mai încearcă!");
        element.style.animation = "shake 0.4s";
        element.style.borderColor = "#ff5252";

        setTimeout(() => {
            element.style.animation = "";
            element.style.borderColor = "#b2ebf2";
        }, 400);
    }
}

/* JOC 2 */
let goodItemsFound = 0;

function sortMe(element, isGood) {
    if (window.getComputedStyle(element).opacity === "0") return;

    if (isGood) {
        element.style.transition = "all 0.5s ease-in";
        element.style.transform = "translateY(150px) scale(0.2)";
        element.style.opacity = "0";
        element.style.pointerEvents = "none";

        goodItemsFound++;

        let ramase = 4 - goodItemsFound;
        let feedback = document.getElementById('feedback-text');

        if (ramase > 0) {
            feedback.innerText = "Super! Încă " + ramase;
            feedback.style.color = "green";
            if(ramase === 2)
                say("Super! Încă două");
            else
                say("Super! Încă " + ramase);
        } else {
            feedback.innerText = "Perfect! Laboratorul e curat.";
            say("Perfect! Laboratorul e curat. Apasă butonul pentru a continua.");
            document.getElementById('btn-next-2').classList.remove('hidden');
        }
    } else {
        element.style.animation = "shake 0.4s";
        let feedback = document.getElementById('feedback-text');
        feedback.innerText = "Nu! Asta e o jucărie.";
        feedback.style.color = "red";
        say("Nu! Asta e o jucărie.");
        setTimeout(() => {
            element.style.animation = "float 3s infinite ease-in-out";
        }, 400);
    }
}

/* JOC 3 */
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
        document.getElementById('result-message').innerText = "Mai pune o culoare...";
        say("Mai pune o culoare...");
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
    let msg = document.getElementById('result-message');
    let bubbles = document.getElementById('bubbles');

    if (mixedColors.includes('blue') && mixedColors.includes('yellow')) {
        liquid.style.transition = "background-color 1s";
        liquid.style.backgroundColor = "#4caf50"; // VERDE
        bubbles.style.display = "block";

        msg.innerHTML = "WOW! Ai făcut <span style='color:green'>VERDE</span>!";
        document.getElementById('btn-final').classList.remove('hidden');
        say("Uau! Ai făcut verde! Apasă butonul albastru pentru a continua.");

    } else {
        liquid.style.backgroundColor = "#795548"; // MARO
        msg.innerText = "Oh nu... a ieșit maro. Încearcă Galben + Albastru!";
        msg.style.color = "brown";
        say("O, nu. A ieșit maro. Apasă butonul de jos pentru a reseta. Încearcă galben și albastru!");
    }
}

function resetPotions() {
    mixedColors = [];
    let liquid = document.getElementById('liquid-main');
    liquid.style.height = "0%";
    liquid.style.backgroundColor = "transparent";
    document.getElementById('bubbles').style.display = "none";
    let msg = document.getElementById('result-message');
    msg.innerText = "Toarnă 2 culori...";
    msg.style.color = "black";
    say("Toarnă două culori...");
    document.getElementById('btn-final').classList.add('hidden');
}