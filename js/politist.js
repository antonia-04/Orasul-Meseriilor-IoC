document.addEventListener("DOMContentLoaded", () => {

    const introScene = document.getElementById("scena-intro");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                say("Bună! Eu sunt Andrei, prietenul tău polițist! Știi ce face un polițist? Ajută oamenii și păzește ordinea în oraș! Vrei să învățăm împreună cum să fim polițiști buni?");
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
        say("Alege uniforma de polițist corectă!");
    else if(sceneId==="scena-2")
        say("Hai să alegem echipamentul! Pune doar obiectele de polițist în gentuță.")
    else if(sceneId==="scena-3")
        say("E timpul să învățăm despre semnele de circulație! Apasă pe semnul care arată trecerea de pietoni!")
    else if(sceneId==="scena-4") {
        say("Acum hai să prindem hoțul! Apasă pe hoț când îl vezi pe ecran!");
        startChaseGame();
    }
    else if(sceneId==="scena-5") {
        say("Ultimul joc! Ajută-mă să dirijez traficul! Când mașina e roșie, apasă STOP. Când e verde, apasă TRECI!");
        startTrafficGame();
    }
    else if(sceneId==="scena-final")
        say("Bravoo! Ești un super polițist! Apasă pe căsuță pentru a încerca o nouă meserie!");
}

/* JOC 1: ECHIPARE */
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
            say("Bravo! Ai ales uniforma corectă. Apasă butonul pentru a continua.");
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

/* JOC 2: SORTARE */
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
            feedback.innerText = "Perfect! Echipamentul e complet.";
            say("Perfect! Echipamentul e complet. Apasă butonul pentru a continua.");
            document.getElementById('btn-next-2').classList.remove('hidden');
        }
    } else {
        element.style.animation = "shake 0.4s";
        let feedback = document.getElementById('feedback-text');
        feedback.innerText = "Nu! Asta nu e pentru polițist.";
        feedback.style.color = "red";
        say("Nu! Asta nu e pentru polițist.");
        setTimeout(() => {
            element.style.animation = "float 3s infinite ease-in-out";
        }, 400);
    }
}

/* JOC 3: SEMNE DE CIRCULATIE */
let signClicked = false;

function checkSign(signType) {
    if (signClicked) return;

    let msg = document.getElementById('result-message');
    
    if (signType === 'crosswalk') {
        signClicked = true;
        
        let correctSign = document.querySelector('.correct-sign');
        correctSign.style.transform = "scale(1.2)";
        correctSign.style.border = "5px solid #4caf50";
        correctSign.style.boxShadow = "0 0 30px rgba(76, 175, 80, 0.8)";
        
        msg.innerHTML = "WOW! Corect! Acesta e semnul de <span style='color:#2196f3'>trecere pietoni</span>!";
        msg.style.color = "green";
        say("Uau! Corect! Acesta e semnul de trecere pietoni! Apasă butonul albastru pentru a continua.");
        
        document.getElementById('btn-next-3').classList.remove('hidden');
        
    } else {
        msg.innerText = "Mai încearcă! Caută semnul cu omulețul care trece strada.";
        msg.style.color = "red";
        say("Mai încearcă! Caută semnul cu omulețul care trece strada.");
        
        event.target.style.animation = "shake 0.4s";
        setTimeout(() => {
            event.target.style.animation = "";
        }, 400);
    }
}

/* JOC 4: PRINDE HOTUL */
let chaseScore = 0;
let chaseTimer = 20;
let chaseInterval = null;
let thiefInterval = null;

function startChaseGame() {
    chaseScore = 0;
    chaseTimer = 20;
    document.getElementById('score').innerText = chaseScore;
    document.getElementById('timer').innerText = chaseTimer;
    document.getElementById('game-message').innerText = "Apasă pe hoț când apare!";
    document.getElementById('btn-next-4').classList.add('hidden');
    
    // Create grid
    let grid = document.getElementById('grid-game');
    grid.innerHTML = '';
    for(let i = 0; i < 9; i++) {
        let cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.onclick = () => catchThief(cell);
        grid.appendChild(cell);
    }
    
    // Start timer
    chaseInterval = setInterval(() => {
        chaseTimer--;
        document.getElementById('timer').innerText = chaseTimer;
        
        if(chaseTimer <= 0 || chaseScore >= 5) {
            endChaseGame();
        }
    }, 1000);
    
    // Spawn thief
    spawnThief();
}

function spawnThief() {
    let cells = document.querySelectorAll('.grid-cell');
    cells.forEach(c => {
        c.innerHTML = '';
        c.classList.remove('has-thief', 'citizen');
    });
    
    // Random positions for thief and citizens
    let thiefPos = Math.floor(Math.random() * 9);
    let citizenPositions = [];
    
    while(citizenPositions.length < 2) {
        let pos = Math.floor(Math.random() * 9);
        if(pos !== thiefPos && !citizenPositions.includes(pos)) {
            citizenPositions.push(pos);
        }
    }
    
    // Add thief
    let thiefImg = document.createElement('img');
    thiefImg.src = '../imagini/politist/hot.svg';
    thiefImg.alt = "Hoț";
    thiefImg.className = 'character-sprite';
    cells[thiefPos].appendChild(thiefImg);
    cells[thiefPos].classList.add('has-thief');
    
    // Add citizens
    citizenPositions.forEach(pos => {
        let citizenImg = document.createElement('img');
        citizenImg.src = '../imagini/politist/cetatean.svg';
        citizenImg.alt = "Cetățean";
        citizenImg.className = 'character-sprite';
        cells[pos].appendChild(citizenImg);
        cells[pos].classList.add('citizen');
    });
}

function catchThief(cell) {
    if(chaseScore >= 5) return;
    
    if(cell.classList.contains('has-thief')) {
        chaseScore++;
        document.getElementById('score').innerText = chaseScore;
        cell.style.backgroundColor = "#4caf50";
        say("Bravo! L-ai prins!");
        
        setTimeout(() => {
            if(chaseScore < 5) {
                spawnThief();
            }
        }, 500);
        
    } else if(cell.classList.contains('citizen')) {
        say("Nu! E un cetățean!");
        cell.style.backgroundColor = "#ff5252";
        setTimeout(() => {
            cell.style.backgroundColor = "";
        }, 500);
    }
}

function endChaseGame() {
    clearInterval(chaseInterval);
    
    if(chaseScore >= 5) {
        document.getElementById('game-message').innerText = "Felicitări! Ai prins toți hoții!";
        say("Felicitări! Ai prins toți hoții! Apasă butonul pentru a continua.");
        document.getElementById('btn-next-4').classList.remove('hidden');
    } else {
        document.getElementById('game-message').innerText = "Timpul s-a terminat! Mai încearcă!";
        say("Timpul s-a terminat! Încearcă din nou!");
        setTimeout(() => {
            startChaseGame();
        }, 2000);
    }
}

/* JOC 5: DIRIJARE TRAFIC */
let trafficScore = 0;
let currentCarColor = '';
let trafficRound = 0;

function startTrafficGame() {
    trafficScore = 0;
    trafficRound = 0;
    document.getElementById('traffic-score').innerText = trafficScore;
    document.getElementById('traffic-message').innerText = "Ce trebuie să faci?";
    document.getElementById('btn-final').classList.add('hidden');
    
    nextCar();
}

function nextCar() {
    trafficRound++;
    
    if(trafficRound > 5) {
        return;
    }
    
    // Random color
    currentCarColor = Math.random() > 0.5 ? 'red' : 'green';
    
    let carImg = document.getElementById('current-car');
    if(currentCarColor === 'red') {
        carImg.src = '../imagini/politist/masina-rosie.svg';
        carImg.alt = "Mașină roșie";
    } else {
        carImg.src = '../imagini/politist/masina-verde.svg';
        carImg.alt = "Mașină verde";
    }
    
    // Animation
    carImg.style.transform = "translateX(-100%)";
    setTimeout(() => {
        carImg.style.transition = "transform 0.5s ease";
        carImg.style.transform = "translateX(0)";
    }, 100);
}

function controlTraffic(action) {
    if(trafficRound > 5) return;
    
    let correct = false;
    
    if((currentCarColor === 'red' && action === 'stop') || 
       (currentCarColor === 'green' && action === 'go')) {
        correct = true;
        trafficScore++;
        document.getElementById('traffic-score').innerText = trafficScore;
        document.getElementById('traffic-message').innerText = "Corect! 👍";
        document.getElementById('traffic-message').style.color = "green";
        say("Corect!");
    } else {
        document.getElementById('traffic-message').innerText = "Greșit! Încearcă din nou! ❌";
        document.getElementById('traffic-message').style.color = "red";
        say("Greșit! Încearcă din nou!");
    }
    
    setTimeout(() => {
        if(trafficRound >= 5 && trafficScore >= 4) {
            document.getElementById('traffic-message').innerText = "Perfect! Ești un diriginte de trafic excelent!";
            say("Perfect! Ești un diriginte de trafic excelent! Apasă butonul pentru a termina.");
            document.getElementById('btn-final').classList.remove('hidden');
        } else if(trafficRound >= 5) {
            document.getElementById('traffic-message').innerText = "Hai să mai încercăm o dată!";
            say("Hai să mai încercăm o dată!");
            setTimeout(() => {
                startTrafficGame();
            }, 2000);
        } else {
            nextCar();
        }
    }, 1500);
}