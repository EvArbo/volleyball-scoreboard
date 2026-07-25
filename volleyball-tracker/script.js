// -------------------------
// 1. APPLICATION STATE
// -------------------------

const gameState = {
    elapsedSeconds: 0,
    isTimerRunning: false,

    teamOne: {
        score: 0,
        setsWon: 0
    },

    teamTwo: {
        score: 0,
        setsWon: 0
    }
};


// -------------------------
// 2. DOM REFERENCES
// -------------------------

const teamSections = document.querySelectorAll(".team");

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

    currentSetDisplay.textContent =
        gameState.currentSet;
    
    const currentSet =
        gameState.teamOne.setsWon
        + gameState.teamTwo.setsWon
        + 1;
    
    currentSetDisplay.textContent =
        currentSet;
}


// -------------------------
// 4. EVENT HANDLERS
// -------------------------

function increaseScore(event) {
    const clickedButton = event.currentTarget;

    const teamSection =
        clickedButton.closest(".team");

    const teamKey =
        teamSection.dataset.team;

    gameState[teamKey].score += 1;

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
}

function increaseSetsWon(event) {
    const teamSection = event.currentTarget.closest(".set-control");
    const teamKey = teamSection.dataset.team;

    gameState[teamKey].setsWon += 1;

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


// -------------------------
// 5. EVENT LISTENERS
// -------------------------

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


// -------------------------
// 6. INITIAL RENDER
// -------------------------

renderGame();