const emojis = [
    " 🤓", " 🤓", " ☠️", " ☠️", " 😒", " 😒", " 😊", " 😊", " 😂", " 😂", " 👨‍💻", " 👨‍💻"
];
let openCards = [];
let score = 0;
let timeRemaining = 120; // 2 minutes in seconds
let timerInterval;
let penalty = 10; // Penalização por erro
let successSound = new Audio('success.mp3'); // Som de sucesso
let errorSound = new Audio('error.mp3'); // Som de erro

let shuffleEmojis = emojis.sort(() => (Math.random() > 0.5 ? 2 : -1));

for (let i = 0; i < emojis.length; i++) {
    let box = document.createElement("div");
    box.className = "item";
    box.innerHTML = shuffleEmojis[i];
    box.onclick = handleClick;
    document.querySelector(".game").appendChild(box);
}

// Timer
function startTimer() {
    timerInterval = setInterval(function () {
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('Tempo esgotado! Você perdeu!');
            saveHighScore();
        } else {
            timeRemaining--;
            document.getElementById("timer").innerText = formatTime(timeRemaining);
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function saveHighScore() {
    const highScore = localStorage.getItem('highScore');
    if (!highScore || score > highScore) {
        localStorage.setItem('highScore', score);
        alert(`Novo recorde! Sua pontuação é ${score}`);
    }
    document.getElementById("ranking").innerText = `Melhor Tempo: ${formatTime(score)}`;
}

// Score based on time remaining
function updateScore() {
    score += Math.max(0, timeRemaining); // Pontuação com base no tempo restante
    document.getElementById("score").innerText = `Pontos: ${score}`;
}

// Play sound effect
function playSound(isSuccess) {
    if (isSuccess) {
        successSound.play();
    } else {
        errorSound.play();
    }
}

// Card click logic
function handleClick() {
    if (openCards.length < 2) {
        this.classList.add("boxOpen");
        openCards.push(this);
    }

    if (openCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    if (openCards[0].innerHTML === openCards[1].innerHTML) {
        playSound(true);  // Sucesso
        openCards[0].classList.add("boxMatch");
        openCards[1].classList.add("boxMatch");
        updateScore();
    } else {
        playSound(false); // Erro
        openCards[0].classList.remove("boxOpen");
        openCards[1].classList.remove("boxOpen");
        score -= penalty; // Penaliza por erro
    }

    openCards = [];

    if (document.querySelectorAll(".boxMatch").length === emojis.length) {
        clearInterval(timerInterval);
        alert(`Você venceu! Pontuação final: ${score}`);
        saveHighScore();
    }
}

// Starting the game
startTimer();
