var errors = 0;
var timer;
var seconds = 0;
var cardList = [
    "asteroid", "astronauts", "comet", "earth", "jupiter",
    "moon", "nebula", "rocket", "saturn", "sun"
];

var cardSet;
var board = [];
var rows = 4;
var columns = 5;
var card1Selected = null;
var card2Selected = null;
var matches = 0;

window.onload = function () {
    shuffleCards();
    startGame();
    startTimer();
};

function shuffleCards() {
    cardSet = cardList.concat(cardList); // Create pairs
    for (let i = cardSet.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
    }
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let cardImg = cardSet.pop();

            let card = document.createElement("img");
            card.id = `${r}-${c}`;
            card.src = "assets/image/back.jpg";
            card.setAttribute("data-value", cardImg);
            card.classList.add("card");
            card.addEventListener("click", selectCard);
            document.getElementById("board").append(card);
        }
    }
}

function selectCard() {
    if (this.src.includes("back.jpg") && card2Selected === null) {
        this.src = `assets/image/${this.getAttribute("data-value")}.jpg`;

        if (card1Selected === null) {
            card1Selected = this;
        } else {
            card2Selected = this;
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    let matchSound = document.getElementById("match-sound");
    let wrongSound = document.getElementById("wrong-sound");

    if (card1Selected.getAttribute("data-value") === card2Selected.getAttribute("data-value")) {
        matchSound.play();
        matches++;
        if (matches === cardList.length) {
            clearInterval(timer);
            document.getElementById("win-sound").play();
            document.getElementById("restart-btn").style.display = "block";
            showMeteorShower();
        }
    } else {
        card1Selected.src = "assets/image/back.jpg";
        card2Selected.src = "assets/image/back.jpg";
        errors++;
        document.getElementById("errors").innerText = errors;
        wrongSound.play();
    }

    card1Selected = null;
    card2Selected = null;
}

let timeLeft = 120; // 2 minutes in seconds

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            triggerAsteroidImpact();
            return;
        }

        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        document.getElementById("timer").innerText =
            `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        timeLeft--;
    }, 1000);
}

function triggerAsteroidImpact() {
    // Show asteroid video and Game Over message
    document.getElementById("asteroid-video").classList.remove("hidden");
    document.getElementById("game-over").classList.remove("hidden");

    // Disable all cards
    const allCards = document.querySelectorAll(".card");
    allCards.forEach(card => card.removeEventListener("click", selectCard));
}



function restartGame() {
    document.getElementById("restart-sound").play();
    location.reload(); // Reloads the page, triggering shuffle and reset
}
