const scoreButtons = document.querySelectorAll(".score-button");
const subtractButtons = document.querySelectorAll(".subtract-button");

console.log(scoreButtons);

function increaseScore(event) {
    const clickedButton = event.currentTarget;
    const currentScore = Number(clickedButton.textContent);
    const newScore = currentScore + 1;
    clickedButton.textContent = newScore;
}

function decreaseScore(event) {
    console.log("decrease time!")
    const clickedButton = event.currentTarget;
    const parent = clickedButton.parentElement;
    const scoreButton = parent.querySelector(".score-button");
    console.log(scoreButton);
    const currentScore = Number(scoreButton.textContent);
    let newScore = currentScore;
    if (currentScore >= 1) {
        newScore = currentScore - 1;
    }
    scoreButton.textContent = newScore;
}

for (i in [0,1]) {
    scoreButtons[i].addEventListener("click", increaseScore)
    subtractButtons[i].addEventListener("click", decreaseScore)
}

