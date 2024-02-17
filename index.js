const numRoundsDropdown = document.querySelector('#num-rounds');
const roundLengthDropdown = document.querySelector('#round-length');
const breakLengthDropdown = document.querySelector('#break-length');
const clock = document.querySelector('.clock');
const playButton = document.querySelector('.bx-play-circle');
const pauseButton = document.querySelector('.bx-pause-circle');
const reset = document.querySelector('.controls span');
const timerContainer = document.querySelector('.timer-container');
const roundSpan = document.querySelector('.current-round span');
let roundTime = 3*60;
let breakTime = 1*60;
let numRounds = 12;
let inter;
let breakInter;
let duringRound = true;
let currentRound = 1;

const initializeMenu = () => {
    for (let i = 1; i <= 12; i++) {
        if (i === 12) {
            numRoundsDropdown.innerHTML += `<option value="${i}" selected>${i}</option>`;
        } else {
            numRoundsDropdown.innerHTML += `<option value="${i}">${i}</option>`;
        }
    }

    for (let i = 1; i <= 6; i++) {
        if (i === 3) {
            roundLengthDropdown.innerHTML += `<option value="${i}" selected>${i}</option>`;
        } else {
            roundLengthDropdown.innerHTML += `<option value="${i}">${i}</option>`;
        }
    }

    for (let i = 1; i <= 5; i++) {
        breakLengthDropdown.innerHTML += `<option value="${i}">${i}</option>`;
    }
};

const setClockDisplay = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    clock.innerHTML = `${minutes}:${Math.floor(seconds/10)}${Math.floor(seconds%10)}`;
};

initializeMenu();

setClockDisplay(roundTime);

roundLengthDropdown.addEventListener('change', (event) => {
    roundTime = event.target.value * 60;
    resetTimer();
});

numRoundsDropdown.addEventListener('change', (event) => {
    numRounds = event.target.value;
    resetTimer();
});

breakLengthDropdown.addEventListener('change', (event) => {
    breakTime = event.target.value * 60;
    resetTimer();
});

function fight() {
    duringRound = true;
    timerContainer.classList?.remove("in-break");
    timerContainer.classList.add("in-round");
    roundSpan.innerHTML = currentRound++;
    inter = setInterval(async () => {
        roundTime--;
        setClockDisplay(roundTime);
        if (roundTime <= 0) {
            numRounds--;
            clearInterval(inter);
            if (numRounds <= 0) {
                pauseToPlayButton();
                timerContainer.classList?.remove("in-round");
                return;
            }
            rest();
        }
    }, 1000);
}

function rest() {
    duringRound = false;
    timerContainer.classList?.remove("in-round");
    timerContainer.classList.add("in-break");
    breakInter = setInterval(() => {
        breakTime--;
        setClockDisplay(breakTime);

        if (breakTime <= 0) {
            clearInterval(breakInter);
            breakTime = breakLengthDropdown.value * 60;
            roundTime = roundLengthDropdown.value * 60;
            fight();
        }
    }, 1000);
}

function pause() {
    clearInterval(inter);
    clearInterval(breakInter);
}

function playToPauseButton() {
    playButton.classList.add("inactive");
    pauseButton.classList.remove('inactive');
}

function pauseToPlayButton() {
    pauseButton.classList.add("inactive");
    playButton.classList.remove("inactive");
}

function resetTimer() {
    breakTime = breakLengthDropdown.value * 60;
    roundTime = roundLengthDropdown.value * 60;
    numRounds = numRoundsDropdown.value;
    currentRound = 1;
    roundSpan.innerHTML = "";
    setClockDisplay(roundTime);
    pause();
    duringRound = true;
    if (playButton.classList.contains("inactive")) {
        pauseToPlayButton();
    }
    timerContainer.classList?.remove("in-round");
    timerContainer.classList?.remove("in-break");
}

playButton.addEventListener('click', () => {
    if (numRounds > 0) {
        playToPauseButton();
        if (duringRound) {
            fight();
        } else {
            rest();
        }
    }
});

pauseButton.addEventListener('click', () => {
    pauseToPlayButton();
    pause();
    timerContainer.classList?.remove("in-round");
});

reset.addEventListener('click', resetTimer);