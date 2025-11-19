/* Comando que "puxa" os elementos do html */
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const cloud = document.querySelector('.cloud');
const gameOverImage = document.getElementById('gameOverImage');
const startScreen = document.getElementById('startScreen');
const mainGameBoard = document.getElementById('mainGameBoard');
const mainScoreContainer = document.getElementById('mainScoreContainer');
const recordeStartDisplay = document.getElementById('recordeStartDisplay');
const startButton = document.getElementById('startButton'); 

// NOVOS ELEMENTOS DO SCORE
const scoreDisplay = document.getElementById('scoreDisplay');
const recordeDisplay = document.getElementById('recordeDisplay');

// ELEMENTO DE ÁUDIO
const coinSound = new Audio('./audio/coin.mp3');
// OBS: Você precisa ter o arquivo 'coin.mp3' na pasta 'audio/'

let score = 0;
let recorde = 0;
let gameStarted = false;
let loop;
let scoreInterval;

// Variável para controlar a duração ATUAL da animação do pipe.
// CORREÇÃO: Isso evita a aplicação repetitiva da mesma duração.
let currentPipeDuration = 1.5; 

// --- FUNÇÕES DE ÁUDIO ---
const playCoinSound = () => {
    coinSound.currentTime = 0;
    coinSound.play().catch(e => console.log("Erro ao tocar som:", e));
};

// --- FUNÇÕES DE SCORE E RECORDE ---
const loadRecorde = () => {
    const savedRecorde = localStorage.getItem('marioRecorde');
    if (savedRecorde) {
        recorde = parseInt(savedRecorde);
    }
    recordeDisplay.textContent = `Recorde: ${recorde}`;
    if (recordeStartDisplay) {
        recordeStartDisplay.textContent = `Recorde: ${recorde}`;
    }
};

const updateScore = () => {
    score += 1;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    checkDifficulty();
};

const saveRecorde = () => {
    if (score > recorde) {
        recorde = score;
        localStorage.setItem('marioRecorde', recorde);
        recordeDisplay.innerHTML = `Recorde: **NOVO RECORDE!** ${recorde}`;
    }
};

// --- FUNÇÕES DO JOGO ---

function reset() {
    window.location.reload();
}


const checkDifficulty = () => {
    let newDuration = 1.5; // Duração padrão

    if (score < 50) {
        newDuration = 1.5;
    } else if (score >= 50 && score < 150) {
        newDuration = 1.2;
    } else if (score >= 150 && score < 300) {
        newDuration = 0.9;
    } else if (score >= 300) {
        newDuration = 0.6;
    }

    
    if (newDuration !== currentPipeDuration) {
        pipe.style.animationDuration = `${newDuration}s`;
        currentPipeDuration = newDuration; // Atualiza o controle
    }
};

const jump = () => {
    // A lógica do pulo só será acionada pelo listener de teclado.
};

const startGame = () => {
    if (gameStarted) return;

    gameStarted = true;

    playCoinSound();

    startScreen.style.display = 'none';

    mainGameBoard.style.display = 'block';
    mainScoreContainer.style.display = 'block';

    pipe.style.animationDuration = '1.5s'; // Define a duração inicial no start

    loop = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {

            // AÇÕES DE GAME OVER
            pipe.style.animation = 'none';
            cloud.style.animation = 'none';
            mario.style.animation = 'none';

            pipe.style.left = `${pipePosition}px`;
            mario.style.bottom = `${marioPosition}px`;

            gameOverImage.style.display = 'block';

            saveRecorde();

            clearInterval(loop);
            clearInterval(scoreInterval);
        }
    }, 10);

    scoreInterval = setInterval(() => {
        if (gameOverImage.style.display === 'none') {
            updateScore();
        }
    }, 200);
};


loadRecorde();

// ------------------------------------
// EVENT LISTENERS FINAIS
// ------------------------------------

// NOVO: Listener para o clique no botão
startButton.addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    const key = event.key;

    // INICIA O JOGO se apertar ESPAÇO/ENTER e o jogo não começou
    if ((key === ' ' || key === 'Enter') && !gameStarted) {
        startGame();
        return;
    }

    // Executa o pulo
    if ((key === ' ' || key === 'ArrowUp') && gameOverImage.style.display === 'none' && gameStarted) {

        if (!mario.classList.contains('jump')) {
            mario.classList.add('jump');
            setTimeout(() => {
                mario.classList.remove('jump');
            }, 500);
        }
    }

    // Reinicia
    if (key === 'r' || key === 'R') {
        reset();
    }
});

// Pressionar seta para baixo (agachar)
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
        mario.classList.add('agachar');
    }
});

// Soltar a seta para baixo (levantar)
document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowDown') {
        mario.classList.remove('agachar');
    }
});