# 🏙️ Orașul Meseriilor

**Orașul Meseriilor** este o aplicație web interactivă și educativă, destinată copiilor de grupă mare (5-6 ani). Scopul proiectului este de a familiariza copiii cu diverse meserii prin intermediul unor mini-jocuri vizuale și intuitive.

Proiect realizat pentru disciplina **Interacțiune Om-Calculator (IOC)**.

## 🎮 Funcționalități principale

### 1. Pagina de Start (Landing Page)

### 2. Harta Orașului (Meniu Principal)
* Prezentarea personajelor/meseriilor pe o stradă virtuală.

### 3. Mini-jocuri pentru fiecare meserie
- chimist (Antonia)
- meteorolog (Mihai)
- 
## 🛠️ Tehnologii utilizate
* **HTML5** - Structura semantică.
* **CSS3** - Animații, Grid, Flexbox și design responsive.
* **JavaScript** - Logica jocurilor și manipularea elementelor (fără framework-uri).

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
