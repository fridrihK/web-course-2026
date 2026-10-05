let secretNumber = [];
let history = [];
let attempts = 0;
let gameOver = false;

const guessInput = document.getElementById('guess-input');
const checkBtn = document.getElementById('check-btn');
const newGameBtn = document.getElementById('new-game-btn');
const errorMessage = document.getElementById('error-message');
const attemptsCountEl = document.getElementById('attempts-count');
const historyList = document.getElementById('history-list');

function generateSecretNumber() {
    const digits = [];
    while (digits.length < 4) {
        const digit = Math.floor(Math.random() * 10);
        if (!digits.includes(digit)) {
            digits.push(digit);
        }
    }
    return digits;
}

function validateGuess(value) {
    
    if (value.length !== 4) {
        return 'Нужно ввести ровно 4 цифры';
    }
    
    if (!/^\d{4}$/.test(value)) {
        return 'Можно вводить только цифры';
    }
    
    const digits = value.split('');
    const unique = new Set(digits);
    if (unique.size !== 4) {
        return 'Все цифры должны быть разными';
    }
    return null; 
}

function countBullsAndCows(guess, secret) {
    let bulls = 0;
    let cows = 0;

    const guessNums = guess.map(function (d) {
        return Number(d);
    });

    for (let i = 0; i < 4; i++) {
        if (guessNums[i] === secret[i]) {
            bulls++;
        } else if (secret.includes(guessNums[i])) {
            cows++;
        }
    }

    return { bulls, cows };
}

function addAttempt(guess, bulls, cows) {
    attempts++;
    history.unshift({
        guess: guess,
        bulls: bulls,
        cows: cows,
        win: bulls === 4
    });
    render();
}

function render() {
    
    attemptsCountEl.textContent = attempts;

    
    historyList.innerHTML = '';
    history.forEach(function (item) {
        const li = document.createElement('li');
        li.className = 'history__item';
        if (item.win) {
            li.classList.add('history__item--win');
        }
        li.textContent = item.guess + ' → ' + item.bulls + ' бык(а), ' + item.cows + ' коров(ы)';
        historyList.appendChild(li);
    });
}

function handleCheck() {
    if (gameOver) return;

    const value = guessInput.value.trim();
    const error = validateGuess(value);

    if (error) {
        showError(error);
        return;
    }

    hideError();

    const guess = value.split('');
    const result = countBullsAndCows(guess, secretNumber);

    addAttempt(value, result.bulls, result.cows);

    guessInput.value = '';
    guessInput.focus();

    if (result.bulls === 4) {
        gameOver = true;
        guessInput.disabled = true;
        checkBtn.disabled = true;
        showError('Победа! Угадано за ' + attempts + ' попыток');
    }
}

function startNewGame() {
    secretNumber = generateSecretNumber();
    history = [];
    attempts = 0;
    gameOver = false;

    guessInput.disabled = false;
    checkBtn.disabled = false;
    guessInput.value = '';
    hideError();
    render();
    guessInput.focus();
}


function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
}

checkBtn.addEventListener('click', handleCheck);

guessInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        handleCheck();
    }
});

newGameBtn.addEventListener('click', startNewGame);

startNewGame();