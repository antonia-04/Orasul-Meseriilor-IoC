/* FUNCTII GLOBALE */

function shuffleElements(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const elements = Array.from(container.children);

    for (let i = elements.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [elements[i], elements[j]] = [elements[j], elements[i]];
    }

    elements.forEach(element => container.appendChild(element));
}

window.onload = function() {
    shuffleElements('.items-grid');

    shuffleElements('#drag-zone');

    initDragAndDrop();
};

function nextScene(sceneId) {
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });
    document.getElementById(sceneId).classList.add('active');
    if(sceneId === 'scena-1') {
        say("Hai să-l echipăm pe Matei! Alege echipamentul potrivit pentru el.");
    }
    else if(sceneId === 'scena-2') {
        say("Acum să alegem uneltele potrivite! Trage obiectele bune în cutie.");
    }
    else if(sceneId === 'scena-3') {
        say("Unde ar trebui să meargă Matei pentru a repara mașina? Deschide portalul spre atelier.");
    }
    else if(sceneId === 'scena-4') {
        say("Mașina este murdară! Folosește buretele pentru a curăța noroiul de pe ea.");
    }
    else if(sceneId === 'scena-5') {
        say("Haide să vopsim mașina! Alege o culoare frumoasă pentru mașina ta.");
    }
    else if(sceneId === 'scena-finala') {
        say("Felicitări! L-ai ajutat pe Matei să-și repare mașina! Apasă butonul pentru a începe din nou.");
    }
}

//audio scena initiala
document.addEventListener("DOMContentLoaded", () => {

    const introScene = document.getElementById("scena-intro");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                say("Salut! Eu sunt Matei și sunt mecanic. Haide să reparăm mașini împreună");
            }
        });
    }, {
        threshold: 0.5 // visible at least 50%
    });

    observer.observe(introScene);
});

/* LOGICA SCENA 1 (ECHIPARE) */
let equipmentCount = 0;
const totalEquipment = 3;

function chooseEquip(type, element, isCorrect) {
    if (element.classList.contains('solved')) return;

    if (isCorrect) {
        element.classList.add('solved');
        say("Bravo!");

        let wornItem = document.getElementById('wear-' + type);
        if (wornItem) {
            wornItem.classList.remove('hidden');
            wornItem.classList.add('pop-in');
        }

        equipmentCount++;
        updateProgressBar(equipmentCount);

        if (equipmentCount === totalEquipment) {
            say("Perfect! Matei este gata de muncă.");
            setTimeout(() => {
                let btn = document.getElementById('btn-next-1');
                btn.classList.remove('hidden');
                btn.classList.add('pulse-btn');
            }, 500);
        }

    } else {
        element.classList.remove('shake');
        void element.offsetWidth;
        element.classList.add('shake');
        say("Încearcă din nou!");
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }
}

function updateProgressBar(count) {
    let percentage = (count / totalEquipment) * 100;
    document.getElementById('equip-progress').style.width = percentage + '%';
    document.querySelector('.progress-text').innerText = count + '/' + totalEquipment;
}


/* LOGICA SCENA 2 (UNELTE) */

let toolsCollected = 0;
const totalToolsNeeded = 4;

function initDragAndDrop() {
    const draggables = document.querySelectorAll('.drag-item');
    const dropZone = document.getElementById('target-box');

    draggables.forEach(item => {
        let startX, startY, initialX, initialY;
        let currentX = 0;
        let currentY = 0;

        item.addEventListener('mousedown', dragStart);
        item.addEventListener('touchstart', dragStart, {passive: false});

        function dragStart(e) {
            if (item.classList.contains('solved')) return;

            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - currentX;
                initialY = e.touches[0].clientY - currentY;
            } else {
                initialX = e.clientX - currentX;
                initialY = e.clientY - currentY;
            }

            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchend', dragEnd);
            document.addEventListener('touchmove', drag, {passive: false});
        }

        function drag(e) {
            e.preventDefault();

            let clientX, clientY;
            if (e.type === "touchmove") {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            currentX = clientX - initialX;
            currentY = clientY - initialY;

            item.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1.1)`;
            item.style.zIndex = "1000";
        }

        function dragEnd(e) {
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchend', dragEnd);
            document.removeEventListener('touchmove', drag);

            item.style.zIndex = "";

            const itemRect = item.getBoundingClientRect();
            const hitbox = dropZone.querySelector('.hitbox');
            const boxRect = hitbox ? hitbox.getBoundingClientRect() : dropZone.getBoundingClientRect();

            const isOverlapping = !(itemRect.right < boxRect.left ||
                itemRect.left > boxRect.right ||
                itemRect.bottom < boxRect.top ||
                itemRect.top > boxRect.bottom);

            if (isOverlapping) {
                const type = item.getAttribute('data-type');
                if (type === 'good') {
                    handleSuccess(item);
                } else {
                    handleFailure(item);
                }
            } else {
                snapBack(item);
            }
        }

        function handleSuccess(element) {
            say('Bravo!');
            element.classList.add('solved');

            element.style.transform = `translate3d(${currentX}px, ${currentY + 50}px, 0) scale(0)`;
            element.style.opacity = "0";
            element.style.transition = "all 0.5s ease-in";

            dropZone.classList.add('box-pop');
            setTimeout(() => dropZone.classList.remove('box-pop'), 300);

            toolsCollected++;
            updateToolboxProgress(toolsCollected);

            if (toolsCollected === totalToolsNeeded) {
                say("Foarte bine! Matei are toate uneltele de care are nevoie.");
                setTimeout(() => {
                    let btn = document.getElementById('btn-next-2');
                    btn.classList.remove('hidden');
                    btn.classList.add('pulse-btn');
                    document.getElementById('toolbox-text').innerText = "BRAVO!";
                }, 600);
            }
        }

        function handleFailure(element) {
            say('Mai încearcă!');
            element.classList.add('shake-item');
            let img = element.querySelector('img');
            if(img) img.style.filter = "drop-shadow(0 0 15px red)";

            setTimeout(() => {
                element.classList.remove('shake-item');
                if(img) img.style.filter = "";
                snapBack(element);
            }, 500);
        }

        function snapBack(element) {
            currentX = 0;
            currentY = 0;
            element.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            element.style.transform = "translate3d(0, 0, 0)";
            setTimeout(() => {
                element.style.transition = "";
            }, 400);
        }
    });
}

function updateToolboxProgress(count) {
    let percentage = (count / totalToolsNeeded) * 100;
    document.getElementById('toolbox-progress').style.width = percentage + '%';
    document.getElementById('toolbox-text').innerText = count + '/' + totalToolsNeeded;
}


/* LOGICA SCENA 3 (PORTAL) */
function choosePlace(type, element) {
    if (document.querySelector('.card-selected') || document.querySelector('.card-centered')) return;

    if (type === 'correct') {
        say("Corect!");
        element.classList.add('card-selected');

        setTimeout(() => {

            document.querySelectorAll('.portal-3d').forEach(card => {
                if (card !== element) {
                    card.classList.add('card-faded');
                }
            });

            element.classList.add('card-centered');

            setTimeout(() => {
                let btn = document.getElementById('btn-next-3');
                if (btn) {
                    btn.classList.remove('hidden');
                    btn.classList.add('pulse-btn');
                }
            }, 800);

        }, 1000);

    } else {
        say("Mai încearcă.");
        element.classList.add('card-wrong');
        setTimeout(() => {
            element.classList.remove('card-wrong');
        }, 600);
    }
}

/* LOGICA SCENA 4 (SPALATORIE) */

let mudCleaned = 0;
const totalMud = 12;
let isSpongeActive = false;

document.addEventListener('mousedown', startSpongeDrag);
document.addEventListener('touchstart', startSpongeDrag, {passive: false});

function startSpongeDrag(e) {
    const sponge = document.getElementById('active-sponge');
    if (!sponge || e.target.closest('#active-sponge') !== sponge) return;

    e.preventDefault();

    let startX, startY, initialLeft, initialTop;
    const rect = sponge.getBoundingClientRect();

    if (e.type === 'touchstart') {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    } else {
        startX = e.clientX;
        startY = e.clientY;
    }

    document.addEventListener('mousemove', moveSponge);
    document.addEventListener('touchmove', moveSponge, {passive: false});
    document.addEventListener('mouseup', stopSponge);
    document.addEventListener('touchend', stopSponge);

    function moveSponge(e) {
        e.preventDefault();

        let clientX, clientY;
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const halfWidth = sponge.offsetWidth / 2;
        const halfHeight = sponge.offsetHeight / 2;

        sponge.style.position = 'fixed';
        sponge.style.left = (clientX - halfWidth) + 'px';
        sponge.style.top = (clientY - halfHeight) + 'px';

        sponge.style.bottom = 'auto';
        sponge.style.right = 'auto';

        checkMudCollision(sponge);
    }

    function stopSponge() {
        document.removeEventListener('mousemove', moveSponge);
        document.removeEventListener('touchmove', moveSponge);
        document.removeEventListener('mouseup', stopSponge);
        document.removeEventListener('touchend', stopSponge);
    }
}

function checkMudCollision(sponge) {
    const spongeRect = sponge.getBoundingClientRect();
    const mudSpots = document.querySelectorAll('.mud-spot.dirt');

    mudSpots.forEach(mud => {
        if (mud.classList.contains('mud-cleaned')) return;

        const mudRect = mud.getBoundingClientRect();

        const isOverlapping = !(spongeRect.right < mudRect.left ||
            spongeRect.left > mudRect.right ||
            spongeRect.bottom < mudRect.top ||
            spongeRect.top > mudRect.bottom);

        if (isOverlapping) {
            cleanSpot(mud);
        }
    });
}

function cleanSpot(mudElement) {
    mudElement.classList.remove('dirt');
    mudElement.classList.add('mud-cleaned');

    mudCleaned++;
    updateCleanProgress(mudCleaned);

    if (mudCleaned === totalMud) {
        say("Foarte bine!");
        setTimeout(() => {
            finishCleaning();
        }, 500);
    }
}

function updateCleanProgress(count) {
    let percentage = (count / totalMud) * 100;
    document.getElementById('clean-progress').style.width = percentage + '%';
    document.getElementById('clean-text').innerText = count + '/' + totalMud;
}

function finishCleaning() {
    const car = document.getElementById('main-car');
    car.classList.add('car-happy');
    document.querySelectorAll('.sparkle').forEach(el => el.classList.remove('hidden'));

    let btn = document.getElementById('btn-next-4');
    btn.classList.remove('hidden');
    btn.classList.add('pulse-btn');

    document.getElementById('active-sponge').style.display = 'none';
}

/* LOGICA SCENA 5 (VOPSITORIE) */

function paintCar(color) {
    const allLayers = document.querySelectorAll('.color-layer');
    allLayers.forEach(layer => {
        layer.classList.remove('visible');
    });

    const selectedLayer = document.getElementById('layer-' + color);
    if (selectedLayer) {
        if(color=='red') say("Roșu");
        if(color=='blue') say("Albastru");
        if(color=='green') say("Verde");
        if(color=='orange') say("Portocaliu");  
        setTimeout(() => {
            selectedLayer.classList.add('visible');
        }, 200);
    }

    const mist = document.getElementById('paint-mist');

    mist.classList.remove('mist-effect');
    void mist.offsetWidth;
    mist.classList.add('mist-effect');

    const nextBtn = document.getElementById('btn-next-5');
    if (nextBtn && nextBtn.classList.contains('hidden')) {
        setTimeout(() => {
            nextBtn.classList.remove('hidden');
            nextBtn.classList.add('pop-in');
        }, 1000);
    }
    say("Mașina arată grozav!");
}