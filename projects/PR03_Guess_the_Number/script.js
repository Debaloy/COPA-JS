// Game Configuration
const MAX_ATTEMPTS = 10;
let secretNumber = null;
let currentAttempts = 0;
let gameWon = false;
let gameActive = true;

// DOM Elements
const guessInput = document.getElementById('guessInput');
const submitBtn = document.getElementById('submitBtn');
const newGameBtn = document.getElementById('newGameBtn');
const attemptsValue = document.getElementById('attemptsValue');
const remainingValue = document.getElementById('remainingValue');
const resultText = document.getElementById('resultText');
const resultCard = document.getElementById('resultCard');
const historyContent = document.getElementById('historyContent');
const maxAttemptsValue = document.getElementById('maxAttemptsValue');

// History toggle functionality
const historyCard = document.querySelector('.history-card');
const historyToggle = document.querySelector('.history-toggle');

if (historyCard && historyToggle) {
    historyToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        historyCard.classList.toggle('collapsed');
    });
    
    historyCard.addEventListener('click', (e) => {
        if (e.target === historyCard || e.target.classList.contains('history-header')) {
            historyCard.classList.toggle('collapsed');
        }
    });
}

// Initialize max attempts display
maxAttemptsValue.textContent = MAX_ATTEMPTS;

/**
 * Generate random number between min and max (inclusive)
 */
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Update the UI with current attempts
 */
function updateStatsUI() {
    attemptsValue.textContent = currentAttempts;
    const remaining = Math.max(0, MAX_ATTEMPTS - currentAttempts);
    remainingValue.textContent = remaining;
}

/**
 * Clear and reset the history list
 */
function clearHistory() {
    historyContent.innerHTML = `
        <div class="history-empty">
            <i class="fas fa-inbox"></i>
            <p>No guesses yet</p>
        </div>
    `;
}

/**
 * Add a guess to the history list
 */
function addToHistory(guess, clue) {
    // Remove empty history placeholder if it exists
    if (historyContent.children.length === 1 && historyContent.children[0].classList.contains('history-empty')) {
        historyContent.innerHTML = '';
    }
    
    const historyItem = document.createElement('div');
    historyItem.className = `history-item ${clue}`;
    
    const guessSpan = document.createElement('span');
    guessSpan.className = 'history-guess';
    guessSpan.textContent = guess;
    
    const clueSpan = document.createElement('span');
    clueSpan.className = 'history-clue';
    
    switch(clue) {
        case 'low':
            clueSpan.innerHTML = '<i class="fas fa-arrow-down"></i> Too Low';
            break;
        case 'high':
            clueSpan.innerHTML = '<i class="fas fa-arrow-up"></i> Too High';
            break;
        case 'win':
            clueSpan.innerHTML = '<i class="fas fa-trophy"></i> Correct!';
            break;
    }
    
    historyItem.appendChild(guessSpan);
    historyItem.appendChild(clueSpan);
    historyContent.appendChild(historyItem);
    
    // Auto-scroll to the newest guess
    historyItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Show result message with appropriate styling
 */
function showResult(message, type = 'info') {
    resultText.textContent = message;
    resultCard.classList.remove('win', 'loss');
    
    const icon = resultCard.querySelector('.result-icon');
    
    if (type === 'win') {
        resultCard.classList.add('win');
        icon.className = 'fas fa-trophy result-icon';
    } else if (type === 'loss') {
        resultCard.classList.add('loss');
        icon.className = 'fas fa-skull result-icon';
    } else {
        icon.className = 'fas fa-info-circle result-icon';
    }
}

/**
 * End the game
 */
function endGame(isWin) {
    gameActive = false;
    guessInput.disabled = true;
    submitBtn.disabled = true;
    
    if (isWin) {
        gameWon = true;
        showResult(`Amazing! You guessed the number ${secretNumber} in ${currentAttempts} ${currentAttempts === 1 ? 'attempt' : 'attempts'}!`, 'win');
    } else {
        showResult(`Game Over! The number was ${secretNumber}. Better luck next time!`, 'loss');
    }
}

/**
 * Reset the game completely
 */
function resetGame() {
    secretNumber = generateRandomNumber(1, 100);
    currentAttempts = 0;
    gameWon = false;
    gameActive = true;
    
    guessInput.disabled = false;
    submitBtn.disabled = false;
    guessInput.value = '';
    
    updateStatsUI();
    clearHistory();
    showResult('New game! Guess a number between 1 and 100. Good luck!', 'info');
    
    const icon = resultCard.querySelector('.result-icon');
    icon.className = 'fas fa-info-circle result-icon';
    
    guessInput.focus();
    
    // Debug (remove in production)
    console.log('New game started. Secret number:', secretNumber);
}

/**
 * Process the player's guess
 */
function processGuess() {
    if (!gameActive) {
        if (gameWon) {
            showResult('You already won! Click "New Game" to play again.', 'info');
        } else {
            showResult(`Game over! The number was ${secretNumber}. Start a new game.`, 'loss');
        }
        return;
    }
    
    if (currentAttempts >= MAX_ATTEMPTS && !gameWon) {
        endGame(false);
        return;
    }
    
    const rawValue = guessInput.value.trim();
    if (rawValue === '') {
        showResult('Please enter a number between 1 and 100!', 'info');
        guessInput.value = '';
        guessInput.focus();
        return;
    }
    
    const guess = Number(rawValue);
    if (isNaN(guess) || !Number.isInteger(guess) || guess < 1 || guess > 100) {
        showResult('Invalid guess! Please enter a whole number from 1 to 100.', 'info');
        guessInput.value = '';
        guessInput.focus();
        return;
    }
    
    currentAttempts++;
    updateStatsUI();
    
    if (guess === secretNumber) {
        gameWon = true;
        addToHistory(guess, 'win');
        endGame(true);
        return;
    }
    
    if (currentAttempts >= MAX_ATTEMPTS) {
        addToHistory(guess, guess < secretNumber ? 'low' : 'high');
        showResult(`Last attempt! That was ${guess < secretNumber ? 'too low' : 'too high'}.`, 'info');
        endGame(false);
        return;
    }
    
    if (guess < secretNumber) {
        showResult(`Too low! Try a higher number. (${MAX_ATTEMPTS - currentAttempts} attempts left)`, 'info');
        addToHistory(guess, 'low');
    } else {
        showResult(`Too high! Try a lower number. (${MAX_ATTEMPTS - currentAttempts} attempts left)`, 'info');
        addToHistory(guess, 'high');
    }
    
    guessInput.value = '';
    guessInput.focus();
}

/**
 * Handle Enter key press
 */
function handleKeyPress(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (submitBtn.disabled) return;
        processGuess();
    }
}

// Event Listeners
submitBtn.addEventListener('click', processGuess);
newGameBtn.addEventListener('click', resetGame);
guessInput.addEventListener('keypress', handleKeyPress);

// Initialize the game
resetGame();