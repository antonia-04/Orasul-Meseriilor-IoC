let currentStage = 0;
const totalStages = 4;
let dropsCount = 0;
let rocksCount = 0;
let rainTime = 0;
let rainInterval;
const rainTarget = 5000; // 5 seconds

document.addEventListener("DOMContentLoaded", () => {

    const introScene = document.getElementById("scene-0");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                say("Bună! Eu sunt Strop. Hai să explorăm împreună circuitul apei în natură! Apasă butonul pentru a începe jocul.");
            }
        });
    }, {
        threshold: 0.5 // visible at least 50%
    });

    observer.observe(introScene);
});

function startGame() {
    document.getElementById('ui-header').style.display = 'flex';
    goToStage(1);
}

function goToStage(n) {
    document.querySelectorAll('.scene').forEach(el => el.classList.remove('active'));
    document.getElementById('next-btn').style.display = 'none';
    currentStage = n;
    document.getElementById(`scene-${n}`).classList.add('active');
    if(n===1){
        say("Evaporarea. Trage soarele peste apă pentru a o încălzi!");
    }
    else if(n===2){
        say("Condensarea. Adună stropii de apă în conturul norului!");
    }
    else if(n==3){
        say("Precipitațiile. Apasă pe nor pentru a începe ploaia!");
    }
    else if(n==4){
        say("Colectarea. Curăță pietrele din râu pentru a permite apei să curgă liber!");
    }
    else if(n===5){
        say("Felicitări! Ai completat circuitul apei în natură! Apasă butonul pentru a începe din nou.");
    }
    if(n <= totalStages) {
        document.getElementById('stage-title').textContent = getStageName(n);
        document.getElementById('progress-bar').style.width = `${(n/totalStages)*100}%`;
    } else {
        document.getElementById('ui-header').style.display = 'none';
    }
}

function nextStage() { goToStage(currentStage + 1); }

function getStageName(n) {
    switch(n) {
        case 1: return "1. Evaporarea";
        case 2: return "2. Condensarea";
        case 3: return "3. Precipitațiile";
        case 4: return "4. Colectarea";
        default: return "";
    }
}

function showNextButton() {
    const btn = document.getElementById('next-btn');
    btn.style.display = 'block';
}

// --- DRAG LOGIC ---
let selectedElement = null;
let offset = {x:0, y:0};
let dragType = "";

function startDrag(evt, type) {
    selectedElement = evt.currentTarget;
    dragType = type;
    const transform = selectedElement.getAttribute('transform');
    let tx = 0, ty = 0;
    if (transform) {
        const match = /translate\(([^,]+),\s*([^)]+)\)/.exec(transform);
        if (match) { tx = parseFloat(match[1]); ty = parseFloat(match[2]); }
    }
    const pt = getEventPoint(evt);
    offset.x = pt.x - tx;
    offset.y = pt.y - ty;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
}

function getEventPoint(evt) {
    const svg = selectedElement.ownerSVGElement;
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function drag(evt) {
    if(selectedElement) {
        evt.preventDefault();
        const pt = getEventPoint(evt);
        selectedElement.setAttribute('transform', `translate(${pt.x - offset.x}, ${pt.y - offset.y})`);
    }
}

function endDrag(evt) {
    if(!selectedElement) return;
    const transform = selectedElement.getAttribute('transform');
    const match = /translate\(([^,]+),\s*([^)]+)\)/.exec(transform);
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);

    if(dragType === 'sun' && currentStage === 1) {
        if(y > 250) {
            document.getElementById('s1-steam').setAttribute('opacity', '1');
            document.getElementById('msg-1').textContent = "Super! Apa se evaporă!";
            document.getElementById('msg-1').style.color = "#2ecc71";
            say("Uau! Apa se evaporă! Apasă butonul pentru a continua.");
            setTimeout(showNextButton, 1000);
        } else {
            document.getElementById('s1-steam').setAttribute('opacity', '0');
            document.getElementById('msg-1').textContent = "Trage Soarele peste apă pentru a o încălzi!";
            document.getElementById('msg-1').style.color = "#2c3e50";
        }
    }

    if(dragType === 'drop' && currentStage === 2) {
        // Target area
        if(x > 250 && x < 750 && y > 100 && y < 350) {
            selectedElement.style.display = 'none';
            dropsCount++;
            
            const target = document.getElementById('s2-target');
            target.setAttribute('stroke', '#FFF');
            setTimeout(() => target.setAttribute('stroke', '#A9D0F5'), 300);

            if(dropsCount >= 6) {
                document.getElementById('s2-final-cloud').setAttribute('opacity', '1');
                document.getElementById('s2-target').style.display = 'none';
                
                // Hide the instruction text
                document.getElementById('s2-instruction-text').style.display = 'none';

                document.getElementById('msg-2').textContent = "Bravo! Norul e plin!";
                say("Bravo! Norul e plin! Apasă butonul pentru a continua.");
                showNextButton();
            } else {
                document.getElementById('msg-2').textContent = `Adună stropii de apă în conturul norului! (${dropsCount}/6)`;
            }
        }
    }

    if(dragType === 'rock' && currentStage === 4) {
        if(!selectedElement.dataset.moved) {
            selectedElement.dataset.moved = "true";

            // selectedElement.setAttribute('opacity', '0.6');

            selectedElement.style.opacity = '0';
            selectedElement.style.transform = selectedElement.getAttribute('transform') + ' scale(0.3)';

            setTimeout(() => {
                        selectedElement.style.display = 'none';
                    }, 600);

            rocksCount++;
            document.getElementById('msg-4').textContent = `Curăță pietrele din râu! (${rocksCount}/5)`;
            if(rocksCount >= 5) {
                document.getElementById('s4-anim').beginElement();
                document.getElementById('msg-4').textContent = "Râul curge liber!";
                say("Râul curge liber! Natura te felicită. Apasă butonul pentru a încheia jocul.");
                setTimeout(showNextButton, 1500);
            }
        }
    }

    selectedElement = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', endDrag);
}

// SCENE 3 LOGIC: Rain with Gauge
function startRain() {
    if(currentStage !== 3) return;
    if(rainTime >= rainTarget) return;

    document.getElementById('s3-sky').setAttribute('fill', '#2c3e50');
    document.getElementById('s3-cloud-path').setAttribute('fill', '#4a4a4a');
    document.getElementById('s3-cloud-text').setAttribute('fill', '#fff');
    document.getElementById('s3-gauge-text').setAttribute('fill', '#fff'); // Make gauge text white

    document.getElementById('s3-rain').style.display = 'block';
    
    rainInterval = setInterval(() => {
        rainTime += 50;
        
        const remainingPct = 1 - (rainTime / rainTarget);
        const height = Math.max(0, remainingPct * 200);
        
        document.getElementById('water-level').setAttribute('height', height);
        document.getElementById('water-level').setAttribute('y', 2 + (200 - height));

        if(rainTime >= rainTarget) { 
            clearInterval(rainInterval);
            stopRain();
            document.getElementById('msg-3').textContent = "Norul s-a golit! Natura e fericită.";
            say("Norul s-a golit! Natura e fericită. Apasă butonul pentru a continua.");
            showNextButton();
        }
    }, 50);
}

function stopRain() {
    document.getElementById('s3-sky').setAttribute('fill', 'url(#realSky)');
    document.getElementById('s3-cloud-path').setAttribute('fill', 'white');
    document.getElementById('s3-cloud-text').setAttribute('fill', '#555');
    document.getElementById('s3-gauge-text').setAttribute('fill', '#333'); // Reset gauge text color

    document.getElementById('s3-rain').style.display = 'none';
    clearInterval(rainInterval);
}