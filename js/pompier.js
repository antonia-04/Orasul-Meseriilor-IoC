document.addEventListener("DOMContentLoaded", () => {
    const introScene = document.getElementById("scena-intro");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                say("Bună! Eu sunt Andreea, prietena ta pompier! Știi ce face un pompier? Stinge focurile și salvează vieți! Vrei să învățăm împreună cum să fim pompieri buni?");
            }
        });
    }, {
        threshold: 0.5
    });
    observer.observe(introScene);
});

function nextScene(sceneId) {
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });
    document.getElementById(sceneId).classList.add('active');
    
    if(sceneId === "scena-1") {
        say("Alege echipamentul de pompier corect!");
    } else if(sceneId === "scena-2") {
        say("Hai să alegem echipamentul! Pune doar obiectele de pompier în geantă.");
    } else if(sceneId === "scena-3") {
        say("E timpul să învățăm despre tipurile de incendii! Apasă pe incendiul de la casă!");
    } else if(sceneId === "scena-4") {
        say("Acum hai să stingem focul! Apasă pe foc când îl vezi pe ecran!");
        startChaseGame();
    } else if(sceneId === "scena-5") {
        say("Ultimul joc! Ajută-mă să sting focurile! Când focul e mare, folosește furtunul. Când e mic, folosește stingătorul!");
        startTrafficGame();
    } else if(sceneId === "scena-final") {
        say("Bravoo! Ești un super pompier! Apasă pe căsuță pentru a încerca o nouă meserie!");
    }
}

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
        itemsWorn++;
        console.log("Obiecte purtate: " + itemsWorn);

        if (itemsWorn === 2) {
            say("Bravo! Ai ales echipamentul corect. Apasă butonul pentru a continua.");
            console.log("Ambele obiecte selectate! Afisez butonul.");
            setTimeout(() => {
                let btn = document.getElementById('btn-next-1');
                btn.classList.remove('hidden');
                btn.scrollIntoView({behavior: "smooth"});
            }, 500);
        }
    } else {
        say("Mai încearcă!");
        element.style.animation = "shake 0.4s";
        setTimeout(() => {
            element.style.animation = "";
        }, 400);
    }
}

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
            feedback.innerText = "Super!";
            feedback.style.color = "green";
            if(ramase === 2) {
                say("Bravo Încă două");
            } else {
                say("Bravo! Încă " + ramase);
            }
        } else {
            feedback.innerText = "Ai reusit!";
            feedback.style.color = "green";
            say("Perfect! Echipamentul e complet. Apasă butonul pentru a continua.");
            document.getElementById('btn-next-2').classList.remove('hidden');
        }
    } else {
        element.style.animation = "shake 0.4s";
        let feedback = document.getElementById('feedback-text');
        feedback.innerText = "Oops!";
        feedback.style.color = "red";
        say("Nu! Asta nu e pentru pompier.");
        setTimeout(() => {
            element.style.animation = "float 3s infinite ease-in-out";
        }, 400);
    }
}

let fireClicked = false;

function checkFire(fireType) {
    if (fireClicked) return;

    let msg = document.getElementById('result-message');
    say("Care este incendiul de la casă?");
    
    if (fireType === 'house') {
        fireClicked = true;
        let correctSign = document.querySelector('.correct-sign');
        correctSign.style.transform = "scale(1.2)";
        correctSign.style.border = "5px solid #4caf50";
        correctSign.style.boxShadow = "0 0 30px rgba(76, 175, 80, 0.8)";
        msg.innerHTML = "WOW! Corect!";
        msg.style.color = "green";
        say("Uau! Corect! Acesta e incendiul de la casă! Apasă butonul roșu pentru a continua.");
        document.getElementById('btn-next-3').classList.remove('hidden');
    } else {
        msg.innerText = "Oops!";
        msg.style.color = "red";
        say("Mai încearcă! Caută incendiul de la casă.");
        event.target.style.animation = "shake 0.4s";
        setTimeout(() => {
            event.target.style.animation = "";
        }, 400);
    }
}

let chaseScore = 0;
let chaseTimer = 20;
let chaseInterval = null;

function startChaseGame() {
    chaseScore = 0;
    chaseTimer = 20;
    document.getElementById('score').innerText = chaseScore;
    document.getElementById('timer').innerText = chaseTimer;
    document.getElementById('game-message').innerText = "";
    document.getElementById('btn-next-4').classList.add('hidden');
    
    let grid = document.getElementById('grid-game');
    grid.innerHTML = '';
    for(let i = 0; i < 9; i++) {
        let cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.onclick = () => catchFire(cell);
        grid.appendChild(cell);
    }
    
    chaseInterval = setInterval(() => {
        chaseTimer--;
        document.getElementById('timer').innerText = chaseTimer;
        if(chaseTimer <= 0 || chaseScore >= 5) {
            endChaseGame();
        }
    }, 1000);
    
    spawnFire();
}

function removeFire() {
    let cells = document.querySelectorAll('.grid-cell');
    cells.forEach(c => {
        c.innerHTML = '';
        c.classList.remove('has-fire', 'water');
    });
}

function spawnFire() {
    let cells = document.querySelectorAll('.grid-cell');
    cells.forEach(c => {
        c.innerHTML = '';
        c.classList.remove('has-fire', 'water');
    });
    
    let firePos = Math.floor(Math.random() * 9);
    let waterPositions = [];
    
    while(waterPositions.length < 2) {
        let pos = Math.floor(Math.random() * 9);
        if(pos !== firePos && !waterPositions.includes(pos)) {
            waterPositions.push(pos);
        }
    }
    
    let fireImg = document.createElement('img');
    fireImg.src = '../imagini/pompier/foc.svg';
    fireImg.alt = 'Foc';
    fireImg.className = 'character-sprite';
    cells[firePos].appendChild(fireImg);
    cells[firePos].classList.add('has-fire');
    
    waterPositions.forEach(pos => {
        let waterImg = document.createElement('img');
        waterImg.src = '../imagini/pompier/apa.svg';
        waterImg.alt = 'Apă';
        waterImg.className = 'character-sprite';
        cells[pos].appendChild(waterImg);
        cells[pos].classList.add('water');
    });
}

function catchFire(cell) {
    if(chaseScore >= 5) return;
    
    if(cell.classList.contains('has-fire')) {
        chaseScore++;
        document.getElementById('score').innerText = chaseScore;
        cell.style.backgroundColor = "#4caf50";
        say("Bravo! L-ai stins!");
        setTimeout(() => {
            if(chaseScore < 5) {
                spawnFire();
            }
        }, 500);
    } else if(cell.classList.contains('water')) {
        say("Nu! E apă!");
        cell.style.backgroundColor = "#2196f3";
        setTimeout(() => {
            cell.style.backgroundColor = "";
        }, 500);
    }
}

function endChaseGame() {
    clearInterval(chaseInterval);
    if(chaseScore >= 5) {
        document.getElementById('game-message').innerText = "Bravoo!";
        document.getElementById('game-message').style.color = "green";
        say("Felicitări! Ai stins toate focurile! Apasă buton pentru a continua.");
        document.getElementById('btn-next-4').classList.remove('hidden');
        removeFire();
    } else {
        document.getElementById('game-message').innerText = "Oopsie!";
        say("Timpul s-a terminat! Încearcă din nou!");
        setTimeout(() => {
            startChaseGame();
        }, 2000);
    }
}

let trafficScore = 0;
let currentEvent = '';
let trafficRound = 0;

function startTrafficGame() {
    trafficScore = 0;
    trafficRound = 0;
    document.getElementById('traffic-score').innerText = trafficScore;
    document.getElementById('traffic-message').innerText = "";
    document.getElementById('btn-final').classList.add('hidden');
    say("Când focul apare, folosește stingătorul!")
    say("Când persoana trebuie salvată, oferă ajutor!");
    nextRound();
}

function nextRound() {
    trafficRound++;
    if(trafficRound > 5) {
        return;
    }
    currentEvent = Math.random() > 0.5 ? 'fire' : 'save';
    let EventImg = document.getElementById('current-event');
    if(currentEvent === 'fire') {
        EventImg.src = '../imagini/pompier/foc-mare.svg';
        EventImg.alt = 'Foc mare';
    } else {
        EventImg.src = '../imagini/pompier/ajuta-persoana.svg';
        EventImg.alt = 'Ajută persoana';
    }
    EventImg.style.transform = "translateX(-100%)";
    setTimeout(() => {
        EventImg.style.transition = "transform 0.5s ease";
        EventImg.style.transform = "translateX(0)";
    }, 100);
}

function controlFire(action) {
    if(trafficRound > 5) return;
    let correct = false;
    if((currentEvent === 'fire' && action === 'extinguisher') || (currentEvent === 'save' && action === 'help')) {
        correct = true;
        trafficScore++;
        document.getElementById('traffic-score').innerText = trafficScore;
        document.getElementById('traffic-message').innerText = "Corect! 👍";
        document.getElementById('traffic-message').style.color = "green";
        say("Corect!");
    } else {
        document.getElementById('traffic-message').innerText = "Greșit! ❌";
        document.getElementById('traffic-message').style.color = "red";
        say("Greșit! Încearcă din nou!");
    }
    setTimeout(() => {
        if(trafficRound >= 5 && trafficScore >= 4) {
            document.getElementById('traffic-message').innerText = "Super!";
            document.getElementById('traffic-message').style.color = "green";
            say("Super! Ești un pompier excelent! Apasă butonul pentru a termina.");
            document.getElementById('btn-final').classList.remove('hidden');
            document.querySelector('.extinguisher-btn').disabled = true;
            document.querySelector('.help-btn').disabled = true;
        } else if(trafficRound >= 5) {
            document.getElementById('traffic-message').innerText = "Oopsie!";
            document.getElementById('traffic-message').style.color = "red";
            say("Hai să mai încercăm o dată!");
            setTimeout(() => {
                startTrafficGame();
            }, 2000);
        } else {
            nextRound();
        }
    }, 1500);
}