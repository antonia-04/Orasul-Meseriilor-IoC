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
    // Oprește toate sunetele în curs
    stopAllSpeech();
    
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });
    document.getElementById(sceneId).classList.add('active');
    
    if(sceneId==="scena-1")
        say("Alege 2 obiecte pentru polițist!");
    else if(sceneId==="scena-2")
        say("Apasă pe obiectele care aparțin polițistului.")
    else if(sceneId==="scena-3") {
        say("Care este semnul de trecere pentru pietoni?");
    }
    else if(sceneId==="scena-4") {
        say("Apasă pe hoț pentru a-l prinde!");
        startChaseGame();
    }
    else if(sceneId==="scena-5") {
        say("Apasă pe mașina VERDE!");
        startTrafficGame();
    }
    else if(sceneId==="scena-final")
        say("Bravoo! Ești super polițist!");
}

/* JOC 1: ECHIPARE */
let itemsWorn = 0;

function chooseClothing(type, element, isCorrect) {
    if (element.classList.contains('used')) return;

    // Oprește orice sunet în curs
    stopAllSpeech();

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

    // Oprește orice sunet în curs
    stopAllSpeech();

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
                say("Bravo! Încă două");
            else
                say("Bravo! Încă " + ramase);
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

    // Oprește orice sunet în curs
    stopAllSpeech();

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

/* JOC 3: STAI/MERGI */
let gestureScore = 0;
let currentGesture = '';
let gestureGameActive = false;
let canAnswer = false;

function startGestureGame() {
    gestureScore = 0;
    gestureGameActive = true;
    canAnswer = false;
    
    document.getElementById('gesture-score').textContent = '0';
    document.getElementById('game-msg-3').textContent = '';
    document.getElementById('btn-next-3').classList.add('hidden');
    
    // Setare inițială
    document.getElementById('gesture-emoji').textContent = '👮';
    document.getElementById('gesture-label').textContent = '';
    document.getElementById('gesture-instruction').textContent = 'Așteaptă instrucțiunile...';
    
    say("Ascultă cu atenție! Când polițistul spune STAI, apasă butonul roșu! Când spune MERGI, apasă butonul verde!");
    
    setTimeout(() => {
        showNextGesture();
    }, 5000);
}

function showNextGesture() {
    if (!gestureGameActive) return;
    
    // Oprește orice sunet în curs
    stopAllSpeech();
    
    canAnswer = false;
    
    // Dezactivează butoanele temporar
    const buttons = document.querySelectorAll('.gesture-btn');
    buttons.forEach(btn => btn.classList.add('disabled'));
    
    // Reset display
    document.getElementById('gesture-emoji').textContent = '🤔';
    document.getElementById('gesture-label').textContent = '???';
    document.getElementById('gesture-instruction').textContent = 'Pregătește-te...';
    
    setTimeout(() => {
        // Alege aleator între STAI și MERGI
        currentGesture = Math.random() > 0.5 ? 'stai' : 'mergi';
        
        const emoji = document.getElementById('gesture-emoji');
        const label = document.getElementById('gesture-label');
        const instruction = document.getElementById('gesture-instruction');
        const box = document.getElementById('police-gesture-box');
        
        if (currentGesture === 'stai') {
            emoji.textContent = '✋';
            label.textContent = 'STAI!';
            label.style.color = '#c62828';
            label.style.borderColor = '#c62828';
            box.style.borderColor = '#ef5350';
            box.style.background = 'linear-gradient(135deg, #ffebee, #ffcdd2)';
            say('STAI!');
            instruction.textContent = 'Ce trebuie să faci?';
        } else {
            emoji.textContent = '👉';
            label.textContent = 'MERGI!';
            label.style.color = '#2e7d32';
            label.style.borderColor = '#2e7d32';
            box.style.borderColor = '#66bb6a';
            box.style.background = 'linear-gradient(135deg, #e8f5e9, #c8e6c9)';
            say('MERGI!');
            instruction.textContent = 'Ce trebuie să faci?';
        }
        
        // Activează butoanele după o scurtă pauză
        setTimeout(() => {
            canAnswer = true;
            buttons.forEach(btn => btn.classList.remove('disabled'));
        }, 800);
        
    }, 1000);
}

function answerGesture(answer) {
    if (!gestureGameActive || !canAnswer) return;
    
    // Oprește orice sunet în curs
    stopAllSpeech();
    
    canAnswer = false;
    
    const msg = document.getElementById('game-msg-3');
    const instruction = document.getElementById('gesture-instruction');
    const buttons = document.querySelectorAll('.gesture-btn');
    buttons.forEach(btn => btn.classList.add('disabled'));
    
    if (answer === currentGesture) {
        // Răspuns corect!
        gestureScore++;
        document.getElementById('gesture-score').textContent = gestureScore;
        
        msg.textContent = '🎉 SUPER! Foarte bine!';
        msg.style.background = 'linear-gradient(135deg, #c8e6c9, #a5d6a7)';
        msg.style.color = '#1b5e20';
        instruction.textContent = '✅ Corect!';
        say('Super! Foarte bine!');
        
        // Animație de succes
        document.getElementById('police-gesture-box').style.transform = 'scale(1.1)';
        setTimeout(() => {
            document.getElementById('police-gesture-box').style.transform = 'scale(1)';
        }, 300);
        
        if (gestureScore >= 5) {
            setTimeout(() => {
                endGestureGame();
            }, 2000);
        } else {
            setTimeout(() => {
                msg.textContent = '';
                showNextGesture();
            }, 2000);
        }
    } else {
        // Răspuns greșit
        msg.textContent = '❌ Greșit! Mai încearcă!';
        msg.style.background = 'linear-gradient(135deg, #ffcdd2, #ef9a9a)';
        msg.style.color = '#b71c1c';
        instruction.textContent = '❌ Încearcă din nou!';
        say('Greșit! Încearcă din nou!');
        
        // Animație de eroare (shake)
        const box = document.getElementById('police-gesture-box');
        box.style.animation = 'shake 0.5s';
        setTimeout(() => {
            box.style.animation = '';
        }, 500);
        
        setTimeout(() => {
            msg.textContent = '';
            showNextGesture();
        }, 2000);
    }
}

function endGestureGame() {
    gestureGameActive = false;
    canAnswer = false;
    
    // Oprește orice sunet în curs
    stopAllSpeech();
    
    const msg = document.getElementById('game-msg-3');
    const btn = document.getElementById('btn-next-3');
    const emoji = document.getElementById('gesture-emoji');
    const label = document.getElementById('gesture-label');
    const instruction = document.getElementById('gesture-instruction');
    
    emoji.textContent = '🎉';
    label.textContent = 'BRAVO!';
    label.style.color = '#1565c0';
    label.style.borderColor = '#1976d2';
    
    instruction.textContent = '🌟 Ai terminat perfect!';
    
    msg.textContent = '🏆 Felicitări! Ești un copil ascultător!';
    msg.style.background = 'linear-gradient(135deg, #fff9c4, #fff59d)';
    msg.style.color = '#f57f17';
    
    say('Bravo! Ești un copil foarte ascultător! Ai înțeles toate semnalele polițistului!');
    btn.classList.remove('hidden');
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
        c.style.backgroundColor = "";
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
    
    // Add thief with visual indicator (red highlight)
    let thiefContainer = document.createElement('div');
    thiefContainer.className = 'thief-wrapper';
    
    let thiefImg = document.createElement('img');
    thiefImg.src = '../imagini/politist/hot.svg';
    thiefImg.alt = "Hoț";
    thiefImg.className = 'character-sprite';
    thiefContainer.appendChild(thiefImg);
    
    cells[thiefPos].appendChild(thiefContainer);
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
        
        // Show catch animation
        let catchAnim = document.getElementById('catch-animation');
        catchAnim.classList.remove('hidden');
        
        say("Bravo! L-ai prins!");
        
        setTimeout(() => {
            catchAnim.classList.add('hidden');
            if(chaseScore < 5) {
                spawnThief();
            }
        }, 800);
        
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
        // Hide the entire grid
        let gridContainer = document.getElementById('grid-game');
        gridContainer.style.display = 'none';
        
        document.getElementById('game-message').innerText = "🎉 Felicitări! Ai prins toți hoții! 🎉";
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

/* JOC 5: INTERSECȚIE - 4 MAȘINI CU SEMAFOARE INDIVIDUALE */
let intersectionScore = 0;
let carsGuided = 0;
let trafficGameActive = false;
let currentGreenCar = null;
const carDirections = ['top', 'left', 'right', 'bottom'];
let trafficTimeout = null;

function startTrafficGame() {
    intersectionScore = 0;
    carsGuided = 0;
    trafficGameActive = true;
    currentGreenCar = null;
    
    // Update UI
    document.getElementById('intersection-score').innerText = carsGuided;
    document.getElementById('traffic-intersection-message').innerText = "Apasă pe mașina care are VERDE la semafor! 🚦";
    document.getElementById('btn-final').classList.add('hidden');
    
    // Initialize all lights to red
    carDirections.forEach(direction => {
        setCarLight(direction, 'red');
    });
    
    say("Apasă pe mașina care are verde la semafor ca să deblochezi intersecția!");
    
    // Start first round
    nextGreenCar();
}

function setCarLight(direction, color) {
    const carStation = document.querySelector(`.car-station.${direction}`);
    const trafficLight = document.querySelector(`.car-station.${direction} .traffic-light-individual`);
    const carClickable = document.querySelector(`.car-station.${direction} .car-clickable`);
    const redLight = document.querySelector(`.car-station.${direction} .light-dot.red`);
    const greenLight = document.querySelector(`.car-station.${direction} .light-dot.green`);
    
    if(color === 'green') {
        if(redLight) redLight.classList.remove('active');
        if(greenLight) greenLight.classList.add('active');
        if(carStation) carStation.classList.add('highlighted');
        if(trafficLight) trafficLight.classList.add('highlighted');
        if(carClickable) carClickable.classList.add('highlighted');
    } else {
        if(redLight) redLight.classList.add('active');
        if(greenLight) greenLight.classList.remove('active');
        if(carStation) carStation.classList.remove('highlighted');
        if(trafficLight) trafficLight.classList.remove('highlighted');
        if(carClickable) carClickable.classList.remove('highlighted');
    }
}

function nextGreenCar() {
    if(carsGuided >= 5) {
        endTrafficGame();
        return;
    }
    
    // Turn all lights to red
    carDirections.forEach(direction => {
        setCarLight(direction, 'red');
    });
    
    // Pick random car for green light - must be different from current
    let availableCars = carDirections.filter(car => car !== currentGreenCar);
    currentGreenCar = availableCars[Math.floor(Math.random() * availableCars.length)];
    setCarLight(currentGreenCar, 'green');
    
    say("Apasă pe mașina cu semafor verde!");
    document.getElementById('traffic-intersection-message').innerText = "Apasă pe mașina cu VERDE! 🚦";
    
    // Clear any previous timeout
    if(trafficTimeout) clearTimeout(trafficTimeout);
    
    // If not clicked within 8 seconds, try again
    trafficTimeout = setTimeout(() => {
        if(trafficGameActive) {
            say("Ai întârziat! Apasă mai repede!");
            document.getElementById('traffic-intersection-message').innerText = "Ai întârziat! Apasă mai repede! ⏱️";
            setTimeout(() => {
                nextGreenCar();
            }, 1500);
        }
    }, 8000);
}

function clickCar(direction) {
    if(!trafficGameActive || currentGreenCar === null) return;
    
    const carClickable = document.querySelector(`.car-station.${direction} .car-clickable`);
    if(!carClickable) return;
    
    if(direction === currentGreenCar) {
        // CORRECT! This car has green light
        clearTimeout(trafficTimeout);
        carsGuided++;
        document.getElementById('intersection-score').innerText = carsGuided;
        
        // Show animation
        carClickable.classList.add('car-correct');
        say("Corect! Mașina a trecut!");
        document.getElementById('traffic-intersection-message').innerText = "✅ Bravo! Mașina a trecut!";
        
        setTimeout(() => {
            carClickable.classList.remove('car-correct');
            nextGreenCar();
        }, 1000);
        
    } else {
        // WRONG! This car had red light
        carClickable.classList.add('car-wrong');
        say("Nu! Asta era ROȘU! Trebuia să aștepți!");
        document.getElementById('traffic-intersection-message').innerText = "❌ Era ROȘU! Trebuia să aștepți!";
        
        setTimeout(() => {
            carClickable.classList.remove('car-wrong');
        }, 800);
    }
}

function endTrafficGame() {
    trafficGameActive = false;
    clearTimeout(trafficTimeout);
    
    // Turn all lights to red
    carDirections.forEach(direction => {
        setCarLight(direction, 'red');
    });
    
    if(carsGuided >= 4) {
        // Win condition: guided 4 out of 5
        document.getElementById('traffic-intersection-message').innerText = "🎉 Bravo! Intersecția e sigură și deblocată!";
        say("Bravo! Ești un polițist excelent! Intersecția e sigură și deblocată!");
        document.getElementById('btn-final').classList.remove('hidden');
    } else {
        // Lose: retry
        document.getElementById('traffic-intersection-message').innerText = "Hai să mai încercăm o dată!";
        say("Hai să mai încercăm o dată!");
        setTimeout(() => {
            startTrafficGame();
        }, 2500);
    }
}
