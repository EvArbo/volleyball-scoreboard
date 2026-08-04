// -------------------------
// 1. APPLICATION STATE
// -------------------------

const gameState = {
    initialTimerSeconds: 0,
    remainingSeconds: 0,
    isTimerRunning: false,

    teamOne: {
        name: "Team 1",
        score: 0,
        setsWon: 0
    },

    teamTwo: {
        name: "Team 2",
        score: 0,
        setsWon: 0
    },

    rules: {
        isAREnabled: false,
        setsToWin: 2,
        setLength: 25,
        lastSetLength: 25
    }
};

let timerIntervalId = null;

let timerEntryDigits = "";
let isEnteringTimer = false;
let alarmTimeoutIds = [];



// -------------------------
// 2. DOM REFERENCES
// -------------------------

const teamSections = document.querySelectorAll(".team");

const teamNameInputs =
    document.querySelectorAll(".team-name-input");

const teamOneNameInput = document.querySelector("#team-one-name");

const teamTwoNameInput = document.querySelector("#team-two-name");

const teamOneSetsDisplay =
    document.querySelector(".team-one-sets");

const teamTwoSetsDisplay =
    document.querySelector(".team-two-sets");

const currentSetDisplay =
    document.querySelector(".current-set");

const scoreButtons =
    document.querySelectorAll(".score-button");

const subtractButtons =
    document.querySelectorAll(".subtract-button");

const setAddButtons =
    document.querySelectorAll(".set-add-button");

const setSubtractButtons =
    document.querySelectorAll(".set-subtract-button");

const featuresToggleButton =
    document.querySelector(".features-toggle-button");

const featuresMenu =
    document.querySelector(".features-menu");

const resetScoresButton =
    document.querySelector(".reset-scores-button");

const resetMatchButton =
    document.querySelector(".reset-match-button");

const autoRulingButton =
    document.querySelector(".auto-ruling-button");

const rulesMenu =
    document.querySelector(".rules-menu");

const ruleAddButtons =
    document.querySelectorAll(".rule-add-button");

const ruleSubtractButtons =
    document.querySelectorAll(".rule-subtract-button");

const configureRulesButton =
    document.querySelector(".configure-rules-button");

const setsToWinDisplay =
    document.querySelector(".sets-to-win-display");

const setLengthDisplay =
    document.querySelector(".set-length-display");

const lastSetLengthDisplay =
    document.querySelector(".last-set-length-display");
const timerToggleButton =
    document.querySelector(".timer-toggle-button");

const timerInput =
    document.querySelector(".timer-input");

const timerResetButton =
    document.querySelector(".timer-reset-button");




// -------------------------
// 3. RENDERING
// -------------------------

function renderGame() {
    for (const teamSection of teamSections) {
        const teamKey = teamSection.dataset.team;
        const teamData = gameState[teamKey];

        const scoreDisplay =
            teamSection.querySelector(".score-button");

        scoreDisplay.textContent = teamData.score;
    }

    teamOneSetsDisplay.textContent =
        gameState.teamOne.setsWon;

    teamTwoSetsDisplay.textContent =
        gameState.teamTwo.setsWon;
    
    const currentSet =
        gameState.teamOne.setsWon
        + gameState.teamTwo.setsWon
        + 1;
    
    currentSetDisplay.textContent =
        currentSet;
    
    configureRulesButton.hidden =
        !gameState.rules.isAREnabled;

    autoRulingButton.classList.toggle(
        "active",
        gameState.rules.isAREnabled
    );

    autoRulingButton.textContent =
        gameState.rules.isAREnabled
            ? "Automatic Rules: On"
            : "Automatic Rules: Off";

    setsToWinDisplay.textContent =
        gameState.rules.setsToWin;
    
    setsToWinDisplay.textContent =
        gameState.rules.setsToWin;

    setLengthDisplay.textContent =
        gameState.rules.setLength;

    lastSetLengthDisplay.textContent =
        gameState.rules.lastSetLength;

    timerInput.value =
        formatTimer(gameState.remainingSeconds);

    timerToggleButton.textContent =
        gameState.isTimerRunning
            ? "Pause"
            : "Start";

    timerResetButton.textContent = "Reset";

    timerInput.value =
        formatTimer(gameState.remainingSeconds);

    timerToggleButton.textContent =
        gameState.isTimerRunning
            ? "Pause"
            : "Start";

    timerResetButton.textContent = "Reset";
}


// -------------------------
// 4. EVENT HANDLERS
// -------------------------

function handleTeamNameKeyDown(event) {
    if (event.key === "Enter") {
        event.currentTarget.blur();
    }
}

function increaseScore(event) {
    const clickedButton = event.currentTarget;

    const teamSection =
        clickedButton.closest(".team");

    const teamKey =
        teamSection.dataset.team;

    gameState[teamKey].score += 1;

    evaluateRules();
    renderGame();
}


function decreaseScore(event) {
    const clickedButton = event.currentTarget;

    const teamSection =
        clickedButton.closest(".team");

    const teamKey =
        teamSection.dataset.team;

    if (gameState[teamKey].score > 0) {
        gameState[teamKey].score -= 1;
    }

    renderGame();
}

function resetScores() {
    gameState.teamOne.score = 0;
    gameState.teamTwo.score = 0;

    renderGame();

    featuresMenu.hidden = true;
    featuresToggleButton.setAttribute(
        "aria-expanded",
        "false"
    )
}

function increaseSetsWon(event) {
    const teamSection = event.currentTarget.closest(".set-control");
    const teamKey = teamSection.dataset.team;

    gameState[teamKey].setsWon += 1;

    if (
        gameState.rules.isAREnabled &&
        hasWonGame(gameState[teamKey].setsWon)
    ) {
        endGame(teamKey);
    }

    renderGame();
}

function decreaseSetsWon(event) {
    const teamSection = event.currentTarget.closest(".set-control");
    const teamKey = teamSection.dataset.team;

    if (gameState[teamKey].setsWon > 0) {
        gameState[teamKey].setsWon -= 1;
    }

    renderGame();
}

function toggleFeaturesMenu() {
    featuresMenu.hidden =
        !featuresMenu.hidden;

    featuresToggleButton.setAttribute(
        "aria-expanded",
        String(!featuresMenu.hidden)
    );
}

function resetMatch() {
    const shouldReset =
        window.confirm(
            "Reset the entire match? Scores, sets, and the timer will be cleared."
        );

    if (!shouldReset) {
        return;
    }

    gameState.teamOne.score = 0;
    gameState.teamTwo.score = 0;

    gameState.teamOne.setsWon = 0;
    gameState.teamTwo.setsWon = 0;

    gameState.elapsedSeconds = 0;
    gameState.isTimerRunning = false;

    renderGame();

    featuresMenu.hidden = true;
    featuresToggleButton.setAttribute(
        "aria-expanded",
        "false"
    );
}

function getCurrentSetLength() {
    const currentSet = 
        gameState.teamOne.setsWon +
        gameState.teamTwo.setsWon +
        1;
    const finalPossibleSet = 
        gameState.rules.setsToWin * 2 - 1;

    if (currentSet == finalPossibleSet) {
        return gameState.rules.lastSetLength;
    }

    return gameState.rules.setLength;
}

function hasWonSet(teamScore, opponentScore) {
    const targetScore = getCurrentSetLength();
    if (teamScore >= targetScore && teamScore >= opponentScore + 2) {
        return true;
    }
    return false;
}

function hasWonGame(setsWon) {
    const targetSetsToWin = gameState.rules.setsToWin;
    if (setsWon >= targetSetsToWin) {
        return true
    }
    return false
}

function endSet(winningTeamKey) {
    gameState[winningTeamKey].setsWon += 1;

    gameState.teamOne.score = 0;
    gameState.teamTwo.score = 0;
}

function endGame(winningTeamKey) {
    const winningTeamName =
        winningTeamKey === "teamOne"
            ? teamOneNameInput.value
            : teamTwoNameInput.value;

    alert(`${winningTeamName} won the match! 🏐`);
}

function evaluateRules() {
    if (!gameState.rules.isAREnabled) {
        return;
    }

    if (hasWonSet(gameState.teamOne.score, gameState.teamTwo.score)) {
        endSet("teamOne");
        if (hasWonGame(gameState.teamOne.setsWon)) {
            endGame("teamOne");
        }
    } else if (hasWonSet(gameState.teamTwo.score, gameState.teamOne.score)) {
        endSet("teamTwo");
        if (hasWonGame(gameState.teamTwo.setsWon)) {
            endGame("teamTwo");
        }
    }

    renderGame();
}

function toggleAutomaticRules() {
    gameState.rules.isAREnabled =
        !gameState.rules.isAREnabled;

    if (!gameState.rules.isAREnabled) {
        rulesMenu.hidden = true;
    }

    renderGame();
}

function increaseRule(event) {
    const ruleControl =
        event.currentTarget.closest(".rule-control");

    const ruleKey =
        ruleControl.dataset.rule;

    gameState.rules[ruleKey]++;

    renderGame();
}

function decreaseRule(event) {
    const ruleControl =
        event.currentTarget.closest(".rule-control");

    const ruleKey =
        ruleControl.dataset.rule;

    if (gameState.rules[ruleKey] > 1) {
        gameState.rules[ruleKey] -= 1;
    }

    renderGame();
}

function toggleRulesMenu() {
    rulesMenu.hidden = !rulesMenu.hidden;

    configureRulesButton.setAttribute(
        "aria-expanded",
        String(!rulesMenu.hidden)
    );

    configureRulesButton.textContent =
        rulesMenu.hidden
            ? "Configure Rules ▼"
            : "Configure Rules ▲";
}

function parseTimerInput(timerText) {
    const parts = timerText.split(":");

    if (parts.length !== 2) {
        return null;
    }

    const minutes = Number(parts[0]);
    const seconds = Number(parts[1]);

    if (
        !Number.isInteger(minutes) ||
        !Number.isInteger(seconds) ||
        minutes < 0 ||
        seconds < 0 ||
        seconds > 59
    ) {
        return null;
    }

    return minutes * 60 + seconds;
}

function formatTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}

function toggleTimer() {
    isEnteringTimer = false;

    if (gameState.isTimerRunning) {
        pauseTimer();
    } else {
        startTimer();
    }

    renderGame();
}

function startTimer() {
    stopTimerSound();

    if (gameState.remainingSeconds <= 0) {
        gameState.remainingSeconds =
            gameState.initialTimerSeconds;
    }

    if (gameState.remainingSeconds <= 0) {
        return;
    }

    gameState.isTimerRunning = true;
    timerIntervalId = setInterval(timerTick, 1000);
}

function pauseTimer() {
    gameState.isTimerRunning = false;

    clearInterval(timerIntervalId);
    timerIntervalId = null;
}

function timerTick() {
    if (gameState.remainingSeconds > 0) {
        gameState.remainingSeconds--;
    }

    if (gameState.remainingSeconds === 0) {
        pauseTimer();
        playTimerSound();
    }

    renderGame();
}

function resetTimer() {
    stopTimerSound();

    if (
        !gameState.isTimerRunning &&
        gameState.remainingSeconds ===
            gameState.initialTimerSeconds
    ) {
        gameState.initialTimerSeconds = 0;
    }

    pauseTimer();

    gameState.remainingSeconds =
        gameState.initialTimerSeconds;

    renderGame();
}

const alarmSound = [
    // Main melody
    { freq: 293.66, duration: 192 }, // D4
    { freq: 369.99, duration: 192 }, // F#4
    { freq: 392.00, duration: 192 }, // G4
    { freq: 293.66, duration: 192 }, // D4
    { freq: 0,      duration: 192 },

    { freq: 369.99, duration: 192 }, // F#4
    { freq: 392.00, duration: 192 }, // G4
    { freq: 293.66, duration: 192 }, // D4

    { freq: 0,      duration: 192 },
    { freq: 293.66, duration: 192 }, // D4
    { freq: 369.99, duration: 192 }, // F#4
    { freq: 392.00, duration: 192 }, // G4
    { freq: 440.00, duration: 192 }, // A4
    { freq: 493.88, duration: 192 }, // B4
    { freq: 440.00, duration: 192 }, // A4
    { freq: 392.00, duration: 192 }, // G4

    { freq: 369.99, duration: 192 }, // F#4 / Gb4
    { freq: 0,      duration: 192 },
    { freq: 0,      duration: 192 },
    { freq: 369.99, duration: 192 }, // F#4 / Gb4

    { freq: 0,      duration: 192 },
    { freq: 0,      duration: 192 },
    { freq: 369.99, duration: 192 }, // F#4 / Gb4
    { freq: 392.00, duration: 192 }, // G4
    { freq: 392.00, duration: 192 }, // G4
];

function playFrequency(frequency, duration) {
    const audioContext = new AudioContext();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.value = 0.2;

    oscillator.start();

    setTimeout(() => {
        oscillator.stop();
        audioContext.close();
    }, duration);
}

const audioContext = new AudioContext();

function playTimerSound() {
    let noteStartTime = audioContext.currentTime;

    for (const note of alarmSound) {
        const durationInSeconds =
            note.duration / 1000;

        if (note.freq !== 0) {
            const oscillator =
                audioContext.createOscillator();

            const gainNode =
                audioContext.createGain();

            oscillator.type = "triangle";
            oscillator.frequency.value =
                note.freq;

            oscillator.connect(gainNode);
            gainNode.connect(
                audioContext.destination
            );

            gainNode.gain.value = 0.2;

            oscillator.start(noteStartTime);

            oscillator.stop(
                noteStartTime
                + durationInSeconds
            );
        }

        noteStartTime += durationInSeconds;
    }
}

function stopTimerSound() {
    for (const timeoutId of alarmTimeoutIds) {
        clearTimeout(timeoutId);
    }

    alarmTimeoutIds = [];
}

function timerDigitsToSeconds(digits) {
    const placeValues = [1, 10, 60, 600];
    const reversedDigits =
        digits.split("").reverse();

    let totalSeconds = 0;

    for (
        let i = 0;
        i < reversedDigits.length;
        i++
    ) {
        totalSeconds +=
            Number(reversedDigits[i])
            * placeValues[i];
    }

    return totalSeconds;
}

function handleTimerKeydown(event) {
    const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        "Enter"
    ];

    const isDigit = /^[0-9]$/.test(event.key);

    if (!isDigit && !allowedKeys.includes(event.key)) {
        event.preventDefault();
        return;
    }

    const isNumberKey = /^[0-9]$/.test(event.key);

    if (isNumberKey) {
        event.preventDefault();

        pauseTimer();

        if (!isEnteringTimer) {
            timerEntryDigits = "";
            isEnteringTimer = true;
        }

        timerEntryDigits =
            (timerEntryDigits + event.key).slice(-4);

        const enteredSeconds =
            timerDigitsToSeconds(timerEntryDigits);

        gameState.initialTimerSeconds = enteredSeconds;
        gameState.remainingSeconds = enteredSeconds;

        renderGame();
        return;
    }

    if (event.key === "Backspace") {
        event.preventDefault();

        pauseTimer();

        timerEntryDigits =
            timerEntryDigits.slice(0, -1);

        const enteredSeconds =
            timerEntryDigits === ""
                ? 0
                : timerDigitsToSeconds(timerEntryDigits);

        gameState.initialTimerSeconds = enteredSeconds;
        gameState.remainingSeconds = enteredSeconds;

        isEnteringTimer = true;

        renderGame();
        return;
    }

    if (event.key === "Enter") {
        isEnteringTimer = false;
        timerInput.blur();
    }
}


// -------------------------
// 5. EVENT LISTENERS
// -------------------------

for (const teamNameInput of teamNameInputs) {
    teamNameInput.addEventListener(
        "keydown",
        handleTeamNameKeyDown
    );
}

teamOneNameInput.addEventListener("input", () => {
    gameState.teamOne.name = teamOneNameInput.value || "Team 1";
});

teamTwoNameInput.addEventListener("input", () => {
    gameState.teamTwo.name = teamTwoNameInput.value || "Team 2";
});

for (const scoreButton of scoreButtons) {
    scoreButton.addEventListener(
        "click",
        increaseScore
    );
}

for (const subtractButton of subtractButtons) {
    subtractButton.addEventListener(
        "click",
        decreaseScore
    );
}

for (const setAddButton of setAddButtons) {
    setAddButton.addEventListener(
        "click",
        increaseSetsWon
    );
}

for (const setSubtractButton of setSubtractButtons) {
    setSubtractButton.addEventListener(
        "click",
        decreaseSetsWon
    );
}

featuresToggleButton.addEventListener(
    "click",
    toggleFeaturesMenu
);

resetScoresButton.addEventListener(
    "click",
    resetScores
);

resetMatchButton.addEventListener(
    "click",
    resetMatch
);

timerToggleButton.addEventListener(
    "click",
    toggleTimer
);

timerResetButton.addEventListener(
    "click",
    resetTimer
);

autoRulingButton.addEventListener(
    "click",
    toggleAutomaticRules
);

configureRulesButton.addEventListener(
    "click",
    toggleRulesMenu
);

for (const ruleAddButton of ruleAddButtons) {
    ruleAddButton.addEventListener(
        "click",
        increaseRule
    );
}

for (const ruleSubtractButton of ruleSubtractButtons) {
    ruleSubtractButton.addEventListener(
        "click",
        decreaseRule
    );
}

timerInput.addEventListener(
    "keydown",
    handleTimerKeydown
);

timerInput.addEventListener("blur", function () {
    isEnteringTimer = false;
});

timerInput.addEventListener("paste", function (event) {
    event.preventDefault();
});



// -------------------------
// 6. INITIAL RENDER
// -------------------------

renderGame();