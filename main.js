let gameContainer = document.querySelector(".container");
let level = document.querySelector("select");
let toolTip = document.getElementById("tooltip");
let levelTime = document.querySelector(".info .levelTime > span");
let remainingTime = document.querySelector(".info .remainingTime > span");
let userMark = document.querySelector(".info .score > .mark");
let totalMark = document.querySelector(".info .score > .total");
let startBtn = document.querySelector(".startBtn");
let playAgain = document.querySelector(".playAgain");
let theWord = document.querySelector(".the-word");
let userInput = document.querySelector(".input");
let upcomingWords = document.querySelector(".upcoming-words");
let scoreTable = document.querySelector("table");
let finishDiv = document.querySelector(".finish");

let scoresList = [];
// Levels
const levels = {
  "Easy": 9,
  "Normal": 7,
  "Diffcult": 5
};

// Check if the user choose the Game level or not
window.onload = function () {
  if (level.value == "") {
    toolTip.style.display = "block";
  }
}

let msgDiv = document.createElement("div");
msgDiv.id = 'msgDiv';
msgDiv.style.cssText =
  "position: relative; display: flex; flex-direction: column; align-items: center;\
  padding: 15px; margin: 15px 0; background-color: #fff;";

let closeBtn = document.createElement("span");
closeBtn.innerHTML = "x";
closeBtn.style.cssText =
  "position: absolute; right: 0; top: 0px; padding: 0px 5px;\
  cursor: pointer; color: white; background-color: red;";

let msgTitle = document.createElement("h3");
msgTitle.style.cssText = "margin: 0; color: #795548;";
msgTitle.textContent = "Game Instructions ";

let msgP = document.createElement("p");
msgP.style.cssText = "margin-top: 15px; font-weight: bold; color: #9c27b0;";

msgDiv.appendChild(closeBtn);
msgDiv.appendChild(msgTitle);
msgDiv.appendChild(msgP);

// Create Game Rules
function gameRules(value) {
  let levelName = document.createElement('span');
  levelName.innerHTML = value;
  if (value === "Easy") {
    msgP.innerHTML = `You choose the <span class="levelInfo">${value}</span> level,
    so the time for all words will be <span class="levelInfo">${levels[value]}</span> Seconds
    except the first word, it's time will be <span class="levelInfo">${levels[value] + 3}</span> Seconds`;
  } else if (value === "Normal") {
    msgP.innerHTML = `You choose the <span class="levelInfo">${value}</span> level,
    so the time for all words will be <span class="levelInfo">${levels[value]}</span> Seconds
    except the first word, it's time will be <span class="levelInfo">${levels[value] + 3}</span> Seconds`;
  } else {
    msgP.innerHTML = `You choose the <span class="levelInfo">${value}</span> level,
    so the time for all words will be <span class="levelInfo">${levels[value]}</span> Seconds
    except the first word, it's time will be <span class="levelInfo">${levels[value] + 3}</span> Seconds`;
  }
  gameContainer.appendChild(msgDiv);
}

// Close the Game Instruction Div
closeBtn.onclick = function () {
  document.getElementById('msgDiv').remove();
}

// Default level
let selectedLevel, levelSeconds;

// Settings the values for our Selectors
level.addEventListener("change", function () {
  if (level.value !== "") {
    toolTip.style.display = "none";
    selectedLevel = level.value;
    levelSeconds = levels[selectedLevel]; 
    levelTime.textContent = levelSeconds;
    remainingTime.textContent = levelSeconds;
    gameRules(level.value);
  }
});

// play agian btn
playAgain.onclick = function () {
  location.reload(true);
};

// Check if there are scores in LocalStorage
if (window.localStorage.getItem('scores')) {
  scoresList = JSON.parse(window.localStorage.getItem('scores'));
  addScore(scoresList);
}

// Check LocalStorage
function checkLocalStorage(userLevel,userScore,total) {
  const scoreObject = {
    id: Date.now(),
    date: getDateTimeNow(),
    level: userLevel,
    score: userScore,
    totalMark: total,
  };
  if (window.localStorage.getItem("scores")) {
    scoresList = JSON.parse(window.localStorage.getItem("scores"));
  }
  scoresList.push(scoreObject);
  addScore(scoresList);
}

// Add the score to the LocalStorage and the document
function addScore(scoresList) {
  /*
  Empty the table rows except the table header each time when we try to add any score
  to prevent adding any dublicated data
  */
  if (scoresList.length > 0) {
    while (scoreTable.rows.length > 1) {
      scoreTable.deleteRow(1);
    };
  }
  // Add the score to page
  scoresList.forEach((userScore) => {
    let tr = document.createElement("tr");
    tr.id = userScore.id;
    let scoreDate = document.createElement("td");
    scoreDate.innerHTML = userScore.date;
    let level = document.createElement("td");
    level.innerHTML = userScore.level;
    let score = document.createElement("td");
    score.innerHTML = `${userScore.score} / ${userScore.totalMark}`;
    let delBtn = document.createElement("td");
    delBtn.innerHTML = '<i class="del fas fa-trash-alt"></i>';
    
    tr.appendChild(scoreDate);
    tr.appendChild(level);
    tr.appendChild(score);
    tr.appendChild(delBtn);
    scoreTable.appendChild(tr)
    
    // Add the score to the LocalStorage agin
    window.localStorage.setItem("scores", JSON.stringify(scoresList));
    
    // Delete the score from each of the page and the LocalStorage
    document.querySelectorAll(".del").forEach((i) => {
      i.addEventListener('click', function (e) {
        console.log(e.target.parentNode.parentNode);
        scoreTable.removeChild(e.target.parentNode.parentNode);
        scoresList = JSON.parse(window.localStorage.getItem("scores"));
        scoresList = scoresList.filter((score) => score.id != e.target.parentNode.parentNode.id);
        window.localStorage.setItem("scores", JSON.stringify(scoresList));
      })
    });
  });
}

// Get current date and time
function getDateTimeNow() {
  let current = new Date();
  let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
  let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
  let dateTime = cDate + '  ' + cTime;
  return dateTime;
}

// Disable the Past event
userInput.onpaste = (e) => {
  e.preventDefault();
};

// Fetchimh the rondom words
async function fetchData() {
  try {
    let data = await fetch("https://www.quotable.io/random");
    let randomQuote = await data.json();
    
    const words = randomQuote.content.split(" ");
    let wordsLength = words.length;
    totalMark.textContent = words.length;
    
    // Start Btn
    startBtn.onclick = function (e) {
      if (level.value == "") {
        e.preventDefault();
      } else {
        this.remove();
        userInput.focus();
        randomWord();
      }
    };
    
    // Generate Random Words
    function randomWord() {
      let word = words[Math.floor(Math.random() * words.length)];
      let wordIndex = words.indexOf(word);
      // Remove this word from the Array
      words.splice(wordIndex, 1);
      theWord.textContent = word;
      upcomingWords.textContent = "";
      for (let i = 0; i < words.length; i++) {
        let wordDiv = document.createElement("div");
        wordDiv.innerHTML = words[i];
        upcomingWords.appendChild(wordDiv);
      }
      time();
    }
    
    // Function for the time
    function time() {
      // Check if the word is the first word, then we will add another 3 seconds for the level time
      if (words.length === wordsLength - 1) {
        remainingTime.textContent = levelSeconds + 3;
      } else {
        remainingTime.textContent = levelSeconds;
      }
      let start = setInterval(() => {
        remainingTime.textContent--;
        if (remainingTime.textContent === "0") {
          clearInterval(start);
          // Compare the user input with the random
          if (theWord.textContent === userInput.value) {
            // Empty the input field and increse the user score by 1
            userInput.value = "";
            userInput.focus();
            userMark.textContent++;
            if (words.length > 0) {
              randomWord();
            } else {
              upcomingWords.innerHTML = randomQuote.content;
              userInput.disabled = "true";
              userInput.classList.add("disabled");
              theWord.remove();
              
              // Setting the following data to the localstorage
              checkLocalStorage(selectedLevel, userMark.textContent, wordsLength);
              
              let span = document.createElement("span");
              span.className = "good";
              span.textContent = "Congratulations!";
              finishDiv.appendChild(span);
            }
          } else {
            upcomingWords.innerHTML = randomQuote.content;
            userInput.disabled = "true";
            userInput.classList.add("disabled");
            
            // Setting the following data to the localstorage
            checkLocalStorage(selectedLevel, userMark.textContent, wordsLength);
            
            let span = document.createElement("span");
            span.className = "bad";
            span.textContent = "Game over!";
            finishDiv.appendChild(span);
          }
        }
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
}
fetchData();