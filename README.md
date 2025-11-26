# 🏙️ Orașul Meseriilor

**Orașul Meseriilor** este o aplicație web interactivă și educativă, destinată copiilor de grupă mare (5-6 ani). Scopul proiectului este de a familiariza copiii cu diverse meserii prin intermediul unor mini-jocuri vizuale și intuitive.

Proiect realizat pentru disciplina **Interacțiune Om-Calculator (IOC)**.

## 🎮 Funcționalități Principale

### 1. Pagina de Start (Landing Page)
* **Animații CSS:** Clădiri care plutesc și nori care se mișcă pe fundal.
* **Design Atractiv:** Titlu animat și culori vibrante.
* **Navigare simplă:** Buton de start intuitiv.

### 2. Harta Orașului (Meniu Principal)
* Prezentarea personajelor/meseriilor pe o stradă virtuală.
* **Feedback vizual:** Personajele active "dansează" pentru a invita copilul la joacă.
* Interfață bazată pe imagini (SVG), fără text inutil, ideală pentru preșcolari.

### 3. Mini-Joc: Laboratorul Chimistei 👩‍🔬
TBA
## 🛠️ Tehnologii Utilizate

Proiectul este construit folosind tehnologii Web standard (Vanilla), fără framework-uri externe, pentru a demonstra înțelegerea conceptelor de bază:

* **HTML5:** Structura semantică a paginilor.
* **CSS3:**
    * **Flexbox & Grid:** Pentru așezarea elementelor (ex: grila de butoane 3x2).
    * **Keyframe Animations:** Pentru efectele de plutire, apariție (fade-in) și feedback (shake/tremurat la greșeală).
    * **Responsive Design:** Unități relative (`vh`, `vw`, `%`) pentru adaptare pe ecrane.
* **JavaScript:**
    * Manipulare DOM pentru logica jocurilor.
    * Gestionarea stărilor (trecerea de la o scenă la alta).
    * Feedback imediat (validarea răspunsurilor corecte/greșite).

## 📂 Structura Proiectului

```text
Orasul-Meseriilor/
│
├── css/
│   ├── style.css           # Stiluri generale (Start & Oraș)
│   ├── style-oras.css      # Stiluri specifice pentru meniul cu personaje
│   └── style-chimist.css   # Stiluri pentru mini-jocul Chimist (Grid, Animatii)
│
├── js/
│   ├── script.js           # Scripturi generale
│   └── chimist.js          # Logica jocului de chimie (Dress Up, Sortare, Potiuni)
│
├── imagini/
│   ├── chimist/            # SVG-uri pentru joc (halat, eprubete, manechin, etc.)
│   ├── cladiri-toate.svg   # Grafica pentru fundal
│   ├── strada.svg          # Fundalul orașului
│   └── ...alte resurse
│
├── jocuri/
│   └── chimist.html        # Pagina de joc (Single Page Application logic)
│
├── index.html              # Pagina de start
├── oras.html               # Meniul principal
└── README.md               # Documentația proiectului
