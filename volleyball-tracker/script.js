// -------------------------
// 1. APPLICATION STATE
// -------------------------

const gameState = {
    currentSet: 1,

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


// -------------------------
// 6. INITIAL RENDER
// -------------------------

renderGame();