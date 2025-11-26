/* Comando que "puxa" os elementos do html */
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const cloud = document.querySelector('.cloud');
const gameOverImage = document.getElementById('gameOverImage');
// Elemento da imagem de Vitória
const youWinImage = document.getElementById('youWinImage'); 
const startScreen = document.getElementById('startScreen');
const mainGameBoard = document.getElementById('mainGameBoard');
const mainScoreContainer = document.getElementById('mainScoreContainer');
const recordeStartDisplay = document.getElementById('recordeStartDisplay');
const startButton = document.getElementById('startButton'); 

// Elementos do Score
const scoreDisplay = document.getElementById('scoreDisplay');
const recordeDisplay = document.getElementById('recordeDisplay');

// ELEMENTOS DE ÁUDIO
const jumpSound = new Audio('./audio/smb_jump-small.wav'); 
const coinSound = new Audio('./audio/smb_coin.wav'); 
const marioDieSound = new Audio('./audio/smb_mariodie.wav'); 
// Áudio de vitória opcional (comente ou remova se não tiver o arquivo)
// const youWinSound = new Audio('./audio/smb_world_clear.wav'); 

let score = 0;
let recorde = 0;
let gameStarted = false;
let gameEnded = false; // Flag para saber se o jogo terminou
let loop;
let scoreInterval;
let currentPipeDuration = 1.5; 

// --- FUNÇÕES DE ÁUDIO ---
const playJumpSound = () => {
    jumpSound.currentTime = 0;
    jumpSound.volume = 0.5; 
    jumpSound.play().catch(e => console.log("Erro ao tocar som do Pulo:", e));
};

const playCoinSoundForScore = () => {
    coinSound.currentTime = 0;
    coinSound.volume = 0.7; 
    coinSound.play().catch(e => console.log("Erro ao tocar som de Moeda no Score:", e));
};

const playMarioDieSound = () => {
    marioDieSound.currentTime = 0;
    marioDieSound.play().catch(e => console.log("Erro ao tocar som de Morte:", e));
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
    
    // Toca o som de COIN a cada 50 pontos
    if (score > 0 && score % 50 === 0) {
        playCoinSoundForScore();
    }

    // CHECAGEM PRINCIPAL: Se o score for 200, para o jogo e mostra a tela de vitória
    if (score === 100) {
        handleYouWin();
        return; 
    }
    
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

// Função para parar o jogo e mostrar a tela de vitória
const handleYouWin = () => {
    gameEnded = true;
    
    // Para os intervalos de colisão e score
    clearInterval(loop);
    clearInterval(scoreInterval);

    // Para as animações 
    pipe.style.animation = 'none';
    cloud.style.animation = 'none';
    mario.style.animation = 'none';

    // Fixa as posições e remove classes
    mario.classList.remove('jump');
    mario.style.bottom = `0px`;
    pipe.style.left = `${pipe.offsetLeft}px`; 

    // Mostra a tela de Vitória e esconde a de Game Over
    youWinImage.style.display = 'block';
    gameOverImage.style.display = 'none'; 

    // Salva o recorde
    saveRecorde();

    // Atualiza o placar final
    scoreDisplay.textContent = `Pontuação: ${score} - PARABÉNS!`;
};

const startGame = () => {
    if (gameStarted) return;

    gameStarted = true;

    startScreen.style.display = 'none';
    mainGameBoard.style.display = 'block';
    mainScoreContainer.style.display = 'block';
    pipe.style.animationDuration = '1.5s'; 

    loop = setInterval(() => {
        // Se o jogo terminou (colisão ou vitória), sai do loop
        if (gameEnded) return; 

        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

        // Condição de colisão (Game Over)
        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {

            playMarioDieSound();
            gameEnded = true; 
            
            // Para animações e fixa posições
            pipe.style.animation = 'none';
            cloud.style.animation = 'none';
            mario.style.animation = 'none';
            pipe.style.left = `${pipePosition}px`;
            mario.style.bottom = `${marioPosition}px`;
            mario.classList.remove('jump'); 

            // Mostra a tela de Game Over
            gameOverImage.style.display = 'block';
            youWinImage.style.display = 'none'; 

            saveRecorde();

            clearInterval(loop);
            clearInterval(scoreInterval);
        }
    }, 10);

    scoreInterval = setInterval(() => {
        // Atualiza o placar apenas se o jogo não tiver terminado
        if (!gameEnded) { 
            updateScore();
        }
    }, 200);
};


loadRecorde();

// ------------------------------------
// EVENT LISTENERS FINAIS
// ------------------------------------

// Listener para o clique no botão
startButton.addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    const key = event.key;

    // INICIA O JOGO
    if ((key === ' ' || key === 'Enter') && !gameStarted) {
        startGame();
        return;
    }

    // Executa o pulo (apenas se o jogo estiver rodando e não tiver terminado)
    if ((key === ' ' || key === 'ArrowUp') && gameStarted && !gameEnded) { 

        if (!mario.classList.contains('jump')) {
            mario.classList.add('jump');
            
            playJumpSound();
            
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
    if (event.key === 'ArrowDown' && gameStarted && !gameEnded) { 
        mario.classList.add('agachar');
    }
});

// Soltar a seta para baixo (levantar)
document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowDown') {
        mario.classList.remove('agachar');
    }
});