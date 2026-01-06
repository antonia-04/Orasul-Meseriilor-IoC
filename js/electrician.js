document.addEventListener("DOMContentLoaded", () => {
    const introScene = document.getElementById("scena-intro");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                say("Salut! Eu sunt Vlad, electricianul prietenos!  Știi ce face un electrician? Repară prize, instalează becuri și face ca luminile să strălucească!  Vrei să învățăm împreună cum funcționează electricitatea? ");
            }
        });
    }, {
        threshold: 0.5
    });

    observer.observe(introScene);
});

/* === NAVIGATION === */
function nextScene(sceneId) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById(sceneId).classList.add('active');
    
    if (sceneId === 'scena-1') {
        initFuseboxGame();
        say("Siguranțele au sărit! Urmărește secvența care clipește și repetă-o!");
    } else if (sceneId === 'scena-2') {
        initWireGame();
        say("Conectează firele de aceeași culoare! Trage de la stânga la dreapta.");
    } else if (sceneId === 'scena-3') {
        initBulbGame();
        say("Trage becurile în fitingurile corecte! Potrivește forma și culoarea.");
    } else if (sceneId === 'scena-finala') {
        say("Felicitări! Ești un super electrician! Ai terminat toate sarcinile!");
    }
}

/* === GAME 1: FUSEBOX SEQUENCE MEMORY === */
let fuseSequence = [];
let playerSequence = [];
let fuseLevel = 1;
let isPlaying = false;
let canClick = false;

function initFuseboxGame() {
    fuseLevel = 1;
    fuseSequence = [];
    playerSequence = [];
    isPlaying = false;
    canClick = false;
    
    const fuses = document.querySelectorAll('.fuse');
    fuses.forEach(fuse => {
        fuse.classList.remove('correct', 'wrong');
        fuse.onclick = () => handleFuseClick(fuse);
    });
    
    setTimeout(() => {
        startFuseLevel();
    }, 1000);
}

function startFuseLevel() {
    document.getElementById('fuse-level').textContent = `Nivel: ${fuseLevel}/3`;
    
    // Generate sequence
    if (fuseSequence.length === 0) {
        for (let i = 0; i < fuseLevel + 2; i++) {
            fuseSequence. push(Math.floor(Math. random() * 6));
        }
    }
    
    playerSequence = [];
    canClick = false;
    playSequence();
}

function playSequence() {
    isPlaying = true;
    let index = 0;
    
    const interval = setInterval(() => {
        if (index < fuseSequence.length) {
            flashFuse(fuseSequence[index]);
            index++;
        } else {
            clearInterval(interval);
            isPlaying = false;
            canClick = true;
            say("Acum tu! Apasă siguranțele în aceeași ordine.");
        }
    }, 800);
}

function flashFuse(index) {
    const fuse = document.querySelector(`.fuse[data-index="${index}"]`);
    fuse.classList.add('flash');
    
    setTimeout(() => {
        fuse.classList.remove('flash');
    }, 400);
}

function handleFuseClick(fuse) {
    if (!canClick || isPlaying) return;
    
    const index = parseInt(fuse.dataset.index);
    playerSequence.push(index);
    
    fuse.classList.add('flash');
    setTimeout(() => fuse.classList.remove('flash'), 300);
    
    // Check if correct
    const currentStep = playerSequence.length - 1;
    
    if (playerSequence[currentStep] !== fuseSequence[currentStep]) {
        // Wrong! 
        canClick = false;
        fuse.classList.add('wrong');
        say("Oh nu! Secvența este greșită. Hai să încercăm din nou!");
        
        setTimeout(() => {
            fuse.classList.remove('wrong');
            startFuseLevel();
        }, 1500);
        return;
    }
    
    fuse.classList.add('correct');
    setTimeout(() => fuse.classList.remove('correct'), 300);
    
    // Check if sequence complete
    if (playerSequence. length === fuseSequence.length) {
        canClick = false;
        
        if (fuseLevel < 3) {
            say("Perfect! Hai să trecem la nivelul următor!");
            fuseLevel++;
            fuseSequence = [];
            setTimeout(startFuseLevel, 1500);
        } else {
            say("Excelent! Ai reparat tabloul electric!");
            setTimeout(() => nextScene('scena-2'), 2500);
        }
    }
}

/* === GAME 2: WIRE CONNECTION === */
let wireConnections = [];
let currentWire = null;
let tempLine = null;
const svg = document.getElementById('wire-svg');

function initWireGame() {
    wireConnections = [];
    const connectors = document.querySelectorAll('.connector');
    
    connectors.forEach(connector => {
        connector.addEventListener('mousedown', startWireConnection);
        connector. classList.remove('connected');
    });
    
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
    
}

function startWireConnection(e) {
    if (e.target.dataset.side !== 'left') return;
    if (e.target.classList.contains('connected')) return;
    
    currentWire = {
        element: e.target,
        color: e.target.dataset.color,
        startPos: getConnectorPosition(e.target)
    };
    
    document.addEventListener('mousemove', dragWire);
    document.addEventListener('mouseup', endWireConnection);
}

function dragWire(e) {
    if (!currentWire) return;
    
    if (tempLine) {
        svg.removeChild(tempLine);
    }
    
    const rect = svg.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    tempLine = createSVGLine(
        currentWire.startPos.x,
        currentWire.startPos.y,
        endX,
        endY,
        currentWire.color,
        true
    );
    
    svg.appendChild(tempLine);
}

function endWireConnection(e) {
    document.removeEventListener('mousemove', dragWire);
    document.removeEventListener('mouseup', endWireConnection);
    
    if (tempLine) {
        svg.removeChild(tempLine);
        tempLine = null;
    }
    
    if (! currentWire) return;
    
    const target = e.target;
    if (target.classList.contains('connector') && 
        target.dataset.side === 'right' &&
        ! target.classList.contains('connected')) {
        
        if (target.dataset.color === currentWire.color) {
            const endPos = getConnectorPosition(target);
            const line = createSVGLine(
                currentWire.startPos. x,
                currentWire. startPos.y,
                endPos.x,
                endPos.y,
                currentWire.color,
                false
            );
            
            svg.appendChild(line);
            
            currentWire.element.classList.add('connected');
            target.classList.add('connected');
            
            wireConnections.push({
                left: currentWire.element,
                right: target,
                line: line
            });
            
            say("Perfect! Fire conectate!");
            
            if (wireConnections.length === 5) {
                setTimeout(() => {
                    say("Excelent! Toate firele sunt conectate corect!");
                    setTimeout(() => nextScene('scena-3'), 2500);
                }, 500);
            }
        } else {
            say("Atenție! Culorile nu se potrivesc!");
        }
    }
    
    currentWire = null;
}

function getConnectorPosition(element) {
    const rect = element.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    
    return {
        x: rect.left + rect.width / 2 - svgRect.left,
        y: rect.top + rect.height / 2 - svgRect.top
    };
}

function createSVGLine(x1, y1, x2, y2, color, isTemp) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line. setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line. setAttribute('y2', y2);
    line.setAttribute('stroke', getColorHex(color));
    line. setAttribute('stroke-width', isTemp ? '3' : '5');
    line.setAttribute('stroke-linecap', 'round');
    if (isTemp) {
        line.setAttribute('stroke-dasharray', '10,5');
        line.setAttribute('opacity', '0.6');
    }
    return line;
}

function getColorHex(colorName) {
    const colors = {
        'red': '#e74c3c',
        'blue': '#3498db',
        'green': '#2ecc71',
        'yellow': '#f1c40f',
        'purple': '#9b59b6'
    };
    return colors[colorName] || '#000';
}

/* === GAME 3: BULB INSTALLATION === */
let bulbsInstalled = 0;

function initBulbGame() {
    bulbsInstalled = 0;
    const fixtures = document.querySelectorAll('.fixture');
    
    fixtures.forEach(fixture => {
        const slot = fixture.querySelector('.fixture-slot');
        slot.innerHTML = '';
        slot.classList.remove('filled');
        
        fixture.addEventListener('dragover', allowDrop);
        fixture.addEventListener('drop', dropBulb);
    });
    
}

function dragBulb(e) {
    e.dataTransfer.setData('type', e.target.dataset.type);
    e.dataTransfer.setData('color', e.target. dataset.color);
    e. dataTransfer.setData('element', e.target.outerHTML);
}

function allowDrop(e) {
    e.preventDefault();
}

function dropBulb(e) {
    e.preventDefault();
    
    const fixture = e.currentTarget;
    const slot = fixture.querySelector('.fixture-slot');
    
    if (slot.classList.contains('filled')) return;
    
    const bulbType = e.dataTransfer.getData('type');
    const bulbColor = e.dataTransfer. getData('color');
    const fixtureType = fixture.dataset.type;
    const fixtureColor = fixture.dataset.color;
    
    if (bulbType === fixtureType && bulbColor === fixtureColor) {
        const bulbHTML = e.dataTransfer.getData('element');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = bulbHTML;
        const bulb = tempDiv.firstChild;
        
        bulb.classList.add('hidden');
        bulb.style.width = '100%';
        bulb.style. height = '100%';
        bulb.removeAttribute('draggable');
        bulb.removeAttribute('ondragstart');
        
        slot.appendChild(bulb);
        slot.classList.add('filled');
        
        const originalBulbs = document.querySelectorAll('.draggable-bulb');
        originalBulbs.forEach(originalBulb => {
            if (originalBulb. dataset.type === bulbType && 
                originalBulb.dataset.color === bulbColor &&
                ! originalBulb.classList.contains('hidden')) {
                originalBulb.classList.add('hidden');
            }
        });
        
        bulbsInstalled++;
        say("Foarte bine! Becul este instalat corect!");
        
        if (bulbsInstalled === 4) {
            setTimeout(() => {
                say("Felicitări! Ai instalat toate becurile corect!  Ești un electrician adevărat!");
                setTimeout(() => nextScene('scena-finala'), 3000);
            }, 500);
        }
    } else {
        say("Nu! Acest bec nu se potrivește aici!");
    }
}
