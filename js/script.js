function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.style.display = 'none';
  });

  const selectedScreen = document.getElementById(screenId);
  if (selectedScreen) selectedScreen.style.display = '';
}

/* Mostrar pantalla inicial */
showScreen('loginScreen');


/* CONTROL DE MÚSICA */
const musicMain = document.getElementById("musicMain");
const musicMenu = document.getElementById("musicMenu");
const musicLevels = document.getElementById("musicLevels");

function playMenuMusic() {
  if (musicLevels) musicLevels.pause();
  if (musicMain) musicMain.pause();
  musicMenu.currentTime = 0;
  musicMenu.play();
}

function playLevelMusic() {
  if (musicMenu) musicMenu.pause();
  if (musicMain) musicMain.pause();
  musicLevels.currentTime = 0;
  musicLevels.play();
}

/* BOTONES */

const btnWelcome = document.getElementById('goLoginBtn');
const btnLogin = document.getElementById('btnlogin');
const btnToRegister = document.getElementById('toRegister');
const btnRegister = document.getElementById('btnRegister');
const btnContinueRegister = document.getElementById('btnContinue');

const btnPlay = document.getElementById('btnPlay');
const btnToMenu = document.getElementById('btnToMenu');

const btnLevels = document.getElementById('btnLevels');
const btnSettings = document.getElementById('btnSettings');
const btnMultiplayer = document.getElementById('btnMultiplayer');

const backFromLevels = document.getElementById('backFromLevels');
const backFromSettings = document.getElementById('backFromSettings');
const backFromMultiplayer = document.getElementById('backFromMulti');

const btnVictoryContinue = document.getElementById('btnVictoryContinue');

const btnMultiLocal = document.getElementById('btnMultiLocal');
const btnStartLocal = document.getElementById('btnStartLocal');
const btnSupport = document.getElementById('btnSupport');


/* LOGIN */

btnLogin.addEventListener('click', () => {
  const emailField = document.getElementById('loginEmail').value.trim();
  const passField = document.getElementById('loginPass').value.trim();
  const loginMsg = document.getElementById('loginMsg');

  if (!emailField || !passField) {
    loginMsg.textContent = "Por favor llena todos los campos.";
    return;
  }

  loginMsg.textContent = "";
  showScreen('mainScreen');

  playMenuMusic();
});

btnToRegister.addEventListener('click', () => showScreen('registerScreen'));

btnRegister.addEventListener('click', () => {
  const email = document.getElementById('regEmail').value.trim();
  const user = document.getElementById('regUser').value.trim();
  const pass = document.getElementById('regPass').value.trim();
  const registerMsg = document.getElementById('registerMsg');

  if (!email || !user || !pass) {
    registerMsg.textContent = "Por favor completa todos los campos.";
    return;
  }

  registerMsg.textContent = "";
  showScreen('congratsScreen');
});

btnContinueRegister.addEventListener('click', () => {
  showScreen('mainScreen');
  playMenuMusic();
});


/* MENÚ PRINCIPAL */

btnPlay.addEventListener('click', () => {
  showScreen('menuScreen');
  playMenuMusic();
});

btnLevels.addEventListener('click', () => showScreen('levelsScreen'));
btnSettings.addEventListener('click', () => showScreen('settingsScreen'));
btnMultiplayer.addEventListener('click', () => showScreen('multiplayerScreen'));

backFromLevels.addEventListener('click', () => showScreen('menuScreen'));
backFromSettings.addEventListener('click', () => showScreen('menuScreen'));
backFromMultiplayer.addEventListener('click', () => showScreen('menuScreen'));

btnToMenu.addEventListener('click', () => showScreen('menuScreen'));
btnVictoryContinue.addEventListener('click', () => showScreen('menuScreen'));


/* ================================
   SELECCIÓN DE NIVELES
================================ */

document.querySelectorAll('.level').forEach(levelBtn => {
  levelBtn.addEventListener('click', (e) => {
    const selectedLevel = parseInt(e.currentTarget.dataset.level);

    if (musicMenu) musicMenu.pause();
    playLevelMusic();

    startGame(selectedLevel);
    showScreen('gameScreen');
  });
});

const btnReset = document.getElementById('resetBtn');
btnReset?.addEventListener('click', () => startGame(currentLevel));


/* =========================================
        SISTEMA DE NIVELES Y PAREJAS
========================================= */

const board = document.getElementById('board');
const pairsFoundText = document.getElementById('pairsFound');

let firstCard = null;
let secondCard = null;
let boardLocked = false;
let matchedPairs = 0;
let currentLevel = 1;

/* CANTIDAD DE PARES POR NIVEL */
const levelPairs = {
  1: 4,
  2: 6,
  3: 8,
  4: 10,
  5: 14
};

/* LISTA GRANDE DE IMÁGENES (TÚ LAS CAMBIAS) */
const cardImages = [
  'img/imagen 1.jpg',
  'img/imagen 2.jpg',
  'img/imagen 3.jpg',
  'img/imagen 4.jpg',
  'img/imagen 5.jpg',
  'img/imagen 6.jpg',
  'img/imagen 7.jpg',
  'img/imagen 8.jpg',
  'img/imagen 9.jpg',
  'img/imagen 10.jpg',
  'img/imagen 11.jpg',
  'img/imagen 12.jpg',
  'img/imagen 13.jpg',
  'img/imagen 14.jpg',
  'img/imagen 15.jpg',
  'img/imagen 16.jpg',
  'img/imagen 17.jpg',
  'img/imagen 18.jpg'
];

const backImage = 'img/imagen respaldo.jpg';


/* =========================================
        CREAR MAZO POR NIVEL
========================================= */

function buildDeck(level) {
  const needed = levelPairs[level];
  const imgs = cardImages.slice(0, needed);

  let deck = [];

  imgs.forEach((img, idx) => {
    deck.push({ name: "carta" + (idx + 1), img });
    deck.push({ name: "carta" + (idx + 1), img });
  });

  for (let i = deck.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[r]] = [deck[r], deck[i]];
  }

  return deck;
}


/* =========================================
           RENDER DEL TABLERO
========================================= */

function renderBoard(deck) {
  board.innerHTML = "";

  deck.forEach(cardData => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = cardData.name;

    card.innerHTML = `
      <div class="card-inner">
        <img class="back" src="${backImage}">
        <img class="front" src="${cardData.img}">
      </div>
    `;

    card.addEventListener("click", onCardClick);
    board.appendChild(card);
  });
}


/* =========================================
             INICIAR JUEGO
========================================= */

function startGame(level = 1) {
  currentLevel = level;
  matchedPairs = 0;
  pairsFoundText.textContent = matchedPairs;

  firstCard = null;
  secondCard = null;
  boardLocked = false;

  const deck = buildDeck(level);
  renderBoard(deck);
}


/* =========================================
          LÓGICA DE CLIC Y PAREJAS
========================================= */

function onCardClick(e) {
  const card = e.currentTarget;

  if (boardLocked) return;
  if (card === firstCard) return;
  if (card.classList.contains("matched")) return;

  card.classList.add("flip");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  boardLocked = true;
  checkMatch();
}

function checkMatch() {
  const match = firstCard.dataset.name === secondCard.dataset.name;

  if (match) {
    setTimeout(() => {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");

      matchedPairs++;
      pairsFoundText.textContent = matchedPairs;

      if (matchedPairs === levelPairs[currentLevel]) {
        setTimeout(() => showScreen("victoryScreen"), 400);
      }

      resetSelection();
    }, 300);
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetSelection();
    }, 700);
  }
}

function resetSelection() {
  firstCard = null;
  secondCard = null;
  boardLocked = false;
}


/* Inicio */
startGame(1);