

/*  Helpers: pantalla  */
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
  const el = document.getElementById(screenId);
  if (el) el.style.display = '';
}

/* mostrar login al inicio */
showScreen('loginScreen');

/*  Música (safe play)  */
const musicMain = document.getElementById('musicMain');
const musicMenu = document.getElementById('musicMenu');
const musicLevels = document.getElementById('musicLevels');

function safePlay(audio) {
  if (!audio) return;
  try {
    const p = audio.play();
    if (p && p.catch) p.catch(()=>{/* autoplay bloqueado */});
  } catch (e) { /* ignore */ }
}
function pauseAllMusic() {
  [musicMain, musicMenu, musicLevels].forEach(a => { if (a) a.pause(); });
}
function playMainMusic()   { pauseAllMusic(); if (musicMain) { musicMain.currentTime = 0; safePlay(musicMain); } }
function playMenuMusic()   { pauseAllMusic(); if (musicMenu) { musicMenu.currentTime = 0; safePlay(musicMenu); } }
function playLevelsMusic() { pauseAllMusic(); if (musicLevels) { musicLevels.currentTime = 0; safePlay(musicLevels); } }

/*  Botones y elementos UI  */
const btnWelcome = document.getElementById('goLoginBtn');
const btnLogin = document.getElementById('btnlogin');
const btnToRegister = document.getElementById('toRegister');
const btnRegister = document.getElementById('btnRegister');
const btnContinueRegister = document.getElementById('btnContinue');

const btnPlay = document.getElementById('btnPlay');
const btnLevels = document.getElementById('btnLevels');
const btnSettings = document.getElementById('btnSettings');
const btnMultiplayer = document.getElementById('btnMultiplayer');

const backFromLevels = document.getElementById('backFromLevels');
const backFromSettings = document.getElementById('backFromSettings');
const backFromMultiplayer = document.getElementById('backFromMulti');

const btnStartLocal = document.getElementById('btnStartLocal');
const multiLevelSelect = document.getElementById('multiLevelSelect');
const playerCountSelect = document.getElementById('playerCount');
const btnReset = document.getElementById('resetBtn');
const btnVictoryContinue = document.getElementById('btnVictoryContinue');
const btnToMenu = document.getElementById('btnToMenu');

/*  Navegación / Login  */
btnWelcome?.addEventListener('click', () => showScreen('loginScreen'));

btnLogin?.addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value.trim();
  const msgEl = document.getElementById('loginMsg');
  if (!email || !pass) {
    if (msgEl) msgEl.textContent = 'Por favor llena todos los campos.';
    return;
  }
  if (msgEl) msgEl.textContent = '';
  showScreen('mainScreen');
  playMainMusic();
});

btnToRegister?.addEventListener('click', () => showScreen('registerScreen'));
btnRegister?.addEventListener('click', () => showScreen('congratsScreen'));
btnContinueRegister?.addEventListener('click', () => { showScreen('mainScreen'); playMainMusic(); });

btnPlay?.addEventListener('click', () => { showScreen('menuScreen'); playMenuMusic(); });
btnLevels?.addEventListener('click', () => { showScreen('levelsScreen'); playLevelsMusic(); });
btnSettings?.addEventListener('click', () => showScreen('settingsScreen'));
btnMultiplayer?.addEventListener('click', () => showScreen('multiplayerScreen'));

backFromLevels?.addEventListener('click', () => { showScreen('menuScreen'); playMenuMusic(); });
backFromSettings?.addEventListener('click', () => { showScreen('menuScreen'); playMenuMusic(); });
backFromMultiplayer?.addEventListener('click', () => { showScreen('menuScreen'); playMenuMusic(); });

btnToMenu?.addEventListener('click', () => { stopTimer(); showScreen('menuScreen'); playMenuMusic(); });

/* Niveles */
const levelPairs = {
  1: 4,
  2: 6,
  3: 8,
  4: 10,
  5: 14
};

const levelTimes = {
  1: 45,
  2: 60,
  3: 75,
  4: 90,
  5: 120
};

const cardImages = [
  'img/imagen 1.jpg','img/imagen 2.jpg','img/imagen 3.jpg','img/imagen 4.jpg','img/imagen 5.jpg',
  'img/imagen 6.jpg','img/imagen 7.jpg','img/imagen 8.jpg','img/imagen 9.jpg','img/imagen 10.jpg',
  'img/imagen 11.jpg','img/imagen 12.jpg','img/imagen 13.jpg','img/imagen 14.jpg','img/imagen 15.jpg',
  'img/imagen 16.jpg','img/imagen 17.jpg','img/imagen 18.jpg'
];

let imagesPerLevel = {
  nivel1: ['img/imagen 1.jpg', 'img/imagen 2.jpg', 'img/imagen 3.jpg', 'img/imagen 4.jpg'],
  nivel2: ['img/imagen 1.jpg', 'img/imagen 2.jpg', 'img/imagen 3.jpg', 'img/imagen 4.jpg', 'img/imagen 5.jpg', 'img/imagen 6.jpg'],
  nivel3: ['img/imagen 1.jpg', 'img/imagen 2.jpg', 'img/imagen 3.jpg', 'img/imagen 4.jpg', 'img/imagen 5.jpg', 'img/imagen 6.jpg', 'img/imagen 7.jpg', 'img/imagen 8.jpg'],
  nivel4: ['img/imagen 1.jpg', 'img/imagen 2.jpg', 'img/imagen 3.jpg', 'img/imagen 4.jpg', 'img/imagen 5.jpg', 'img/imagen 6.jpg', 'img/imagen 7.jpg', 'img/imagen 8.jpg', 'img/imagen 9.jpg', 'img/imagen 10.jpg', 'img/imagen 11.jpg', 'img/imagen 12.jpg'],
  nivel5: ['img/imagen 1.jpg', 'img/imagen 2.jpg', 'img/imagen 3.jpg', 'img/imagen 4.jpg', 'img/imagen 5.jpg', 'img/imagen 6.jpg', 'img/imagen 7.jpg', 'img/imagen 8.jpg', 'img/imagen 9.jpg', 'img/imagen 10.jpg', 'img/imagen 11.jpg', 'img/imagen 12.jpg', 'img/imagen 13.jpg', 'img/imagen 14.jpg', 'img/imagen 15.jpg', 'img/imagen 16.jpg', 'img/imagen 17.jpg', 'img/imagen 18.jpg']
};

const backImage = 'img/imagen respaldo.jpg';

/* Estado */
const board = document.getElementById('board');
const pairsFoundText = document.getElementById('pairsFound');
const pairsTotalText = document.getElementById('pairsTotal');

let currentLevel = 1;
let matchedPairs = 0;
let firstCard = null;
let secondCard = null;
let boardLocked = false;

let gameTimer = null;
let timeLeft = 0;

let totalPlayers = 1;
let turn = 1;
let scoreP1 = 0;
let scoreP2 = 0;

/* Variables de nombres de jugadores */
let player1Name = 'Jugador 1';
let player2Name = 'Jugador 2';

/*  Obtener imágenes por nivel  */
function getImagesForLevel(level) {
  const key = 'nivel' + level;
  if (imagesPerLevel[key] && imagesPerLevel[key].length > 0) 
    return imagesPerLevel[key].slice();
  return cardImages.slice();
}

/*  Construcción del mazo  */
function buildDeck(level) {
  const pairs = levelPairs[level] || levelPairs[1];
  const imgs = getImagesForLevel(level);

  while (imgs.length < pairs) {
    imgs.push(...cardImages.slice(0, pairs - imgs.length));
    if (imgs.length === 0) break;
  }

  const chosen = imgs.slice(0, pairs);
  let deck = [];

  for (let i = 0; i < chosen.length; i++) {
    const img = chosen[i];
    const name = 'carta' + (i + 1);
    deck.push({ name, img });
    deck.push({ name, img });
  }

  for (let i = deck.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[r]] = [deck[r], deck[i]];
  }

  return deck;
}

/*  Render del tablero  */
function renderBoard(deck) {
  if (!board) return;
  board.innerHTML = '';

  deck.forEach(cardData => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.name = cardData.name;
    card.innerHTML = `
      <div class="card-inner">
        <img class="back" src="${backImage}" alt="back">
        <img class="front" src="${cardData.img}" alt="front">
      </div>
    `;
    card.addEventListener('click', onCardClick);
    board.appendChild(card);
  });

  if (pairsTotalText) pairsTotalText.textContent = levelPairs[currentLevel] || 0;
}

/*  Reset game  */
function resetGameState() {
  matchedPairs = 0;
  firstCard = null;
  secondCard = null;
  boardLocked = false;
  scoreP1 = 0;
  scoreP2 = 0;
  turn = 1;
  updateScoreUI();
  updateTurnUI();
}

/*  Iniciar Juego  */
function startGame(level = 1) {
  stopTimer();

  currentLevel = Number(level) || 1;

  resetGameState();

  const deck = buildDeck(currentLevel);
  renderBoard(deck);

  if (pairsFoundText) pairsFoundText.textContent = matchedPairs;

  timeLeft = levelTimes[currentLevel] || 60;
  updateTimeUI();
  startTimer();

  showScreen('gameScreen');
  playLevelsMusic();
}

/*  Timer  */
function startTimer() {
  stopTimer();
  gameTimer = setInterval(() => {
    timeLeft--;
    updateTimeUI();
    if (timeLeft <= 0) {
      stopTimer();
      onTimeUp();
    }
  }, 1000);
}

function stopTimer() {
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
}

function updateTimeUI() {
  const t = document.getElementById('timeLeft');
  if (t) t.textContent = timeLeft;
}

/*  Turnos  */
function updateTurnUI() {
  const t = document.getElementById('TurnCounter') || document.getElementById('turnCounter');
  if (t) t.textContent = turn;
}

function updateScoreUI() {
  const s1 = document.getElementById('scoreP1');
  const s2 = document.getElementById('scoreP2');
  if (s1) s1.textContent = scoreP1;
  if (s2) s2.textContent = scoreP2;
}

/*  Mostrar pantalla de victoria  */
function showVictoryScreen(title, message) {
  const victoryTitle = document.getElementById('victoryTitle');
  const victoryMessage = document.getElementById('victoryMessage');
  
  if (victoryTitle) victoryTitle.textContent = title;
  if (victoryMessage) victoryMessage.textContent = message;
  
  showScreen('victoryScreen');
}

/*  Lógica de cartas  */
/* LÓGICA DE LAS CARTAS */

function onCardClick(e) {
  const card = e.currentTarget;

  // Reglas básicas
  if (boardLocked) return;
  if (card === firstCard) return;
  if (card.classList.contains('matched')) return;

  // Voltear carta
  card.classList.add('flip');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  // Segunda carta
  secondCard = card;
  boardLocked = true;

  const isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    processMatch();
  } else {
    processFail();
  }
}

/*CUANDO HAY MATCH*/
function processMatch() {
  setTimeout(() => {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    matchedPairs++;

    if (pairsFoundText) pairsFoundText.textContent = matchedPairs;

    // Sumatoria de puntaje
    if (totalPlayers === 1) {
      scoreP1 += 100;
    } else {
      if (turn === 1) scoreP1 += 100;
      else scoreP2 += 100;
    }

    updateScoreUI();

    resetSelection();

    // Revisar si ganó
    checkIfWin();

  }, 350);
}

/* CUANDO NO HAY MATCH*/
function processFail() {
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    // Cambiar turno SOLO si son 2 jugadores
    if (totalPlayers === 2) {
      turn = (turn === 1) ? 2 : 1;
      updateTurnUI();
    }

    resetSelection();
  }, 700);
}

/* 
    RESETEAR SELECCIÓN*/
function resetSelection() {
  firstCard = null;
  secondCard = null;
  boardLocked = false;
}

/* VERIFICAR VICTORIA*/

function checkIfWin() {
  const totalPairs = levelPairs[currentLevel] || 0;

  if (matchedPairs === totalPairs) {
    stopTimer();
    pauseAllMusic();

    if (totalPlayers === 2) {
      // Determinar quién ganó
      let msg = "";
      if (scoreP1 > scoreP2) msg = "Ganador: " + player1Name + " 🥇";
      else if (scoreP2 > scoreP1) msg = "Ganador: " + player2Name + " 🥇";
      else msg = "Empate — Ambos jugadores quedaron iguales 😐";

      showVictoryScreen("¡Partida completada!", msg);

    } else {
      showVictoryScreen("¡Ganaste!", "Completaste todas las parejas.");
    }
  }
}

/* TIEMPO AGOTADO */

function onTimeUp() {
  stopTimer();
  pauseAllMusic();

  const totalPairs = levelPairs[currentLevel] || 0;

  if (totalPlayers === 2) {

    if (scoreP1 > scoreP2) {
      showVictoryScreen("⏳ Tiempo Agotado", "Ganador: " + player1Name + " 🥇");

    } else if (scoreP2 > scoreP1) {
      showVictoryScreen("⏳ Tiempo Agotado", "Ganador: " + player2Name + " 🥇");

    } else {
      showVictoryScreen("GAME OVER", "Empate — Nadie ganó 😐");
    }

  } else {

    if (matchedPairs === totalPairs) {
      showVictoryScreen("¡Ganaste!", "Completaste el nivel.");
    } else {
      showVictoryScreen("GAME OVER", "No completaste el nivel.");
    }
  }
}

/*  Multijugador  */
document.querySelectorAll('.mpLevelBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const level = btn.dataset.level;
    const selected = document.getElementById('mpSelectedLevel');
    if (selected) selected.value = level;
  });
});

btnStartLocal?.addEventListener('click', () => {
  let levelToStart = 1;
  const mpSelected = document.getElementById('mpSelectedLevel');
  if (mpSelected && mpSelected.value) {
    levelToStart = parseInt(mpSelected.value, 10) || 1;
  }

  totalPlayers = playerCountSelect ? parseInt(playerCountSelect.value, 10) || 1 : 1;

  // Guardar nombres
  const name1 = document.getElementById('p1Name').value.trim();
  const name2 = document.getElementById('p2Name').value.trim();

  player1Name = name1 || 'Jugador 1';
  player2Name = name2 || 'Jugador 2';

  //  Mostrar nombres en pantalla del juego
  const p1label = document.getElementById('nameP1');
  const p2label = document.getElementById('nameP2');

  if (p1label) p1label.textContent = player1Name;
  if (p2label) p2label.textContent = player2Name;

  // Reset scores & turnos
  scoreP1 = 0;
  scoreP2 = 0;
  turn = 1;
  updateScoreUI();
  updateTurnUI();

  playLevelsMusic();
  startGame(levelToStart);
});

/*  Selección desde pantalla Levels  */
document.querySelectorAll('.level').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const lvl = parseInt(e.currentTarget.dataset.level, 10) || 1;

    totalPlayers = 1;
    scoreP1 = 0; 
    scoreP2 = 0; 
    turn = 1;
    updateScoreUI(); 
    updateTurnUI();

    playLevelsMusic();
    startGame(lvl);
  });
});

/*  Reset  */
btnReset?.addEventListener('click', () => {
  scoreP1 = 0;
  scoreP2 = 0;
  turn = 1;
  updateScoreUI();
  updateTurnUI();
  startGame(currentLevel);
});

/*  Continue en pantalla de victoria  */
btnVictoryContinue?.addEventListener('click', () => {
  stopTimer();
  showScreen('menuScreen');
  playMenuMusic();
});

/* Inicialización */
updateTimeUI();
updateTurnUI();
updateScoreUI();