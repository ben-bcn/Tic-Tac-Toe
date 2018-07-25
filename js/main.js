!function(){

const players = [
  {name: 'player1', marker : "box-filled-1", img: "img/o.svg"},
  {name: 'player2', marker : "box-filled-2", img: "img/x.svg"}
];

let computerRival = false;

// contain for player moves
const boxVals = ["","","","","","","","",""];
// counter for tracking place in game
let counter   = 0;

// Containers showing who's turn it is
const player1Container   = document.getElementById("player1");
const player2Container   = document.getElementById("player2");

const board     = document.getElementById('board');
const pageBody  = board.parentNode;

// The boxes within thboard
const boxes     = document.querySelectorAll(".box");

// Buttons on the first screen
const buttons   = document.querySelectorAll('[type="button"]');

let curPlayer   = players[0].marker;
let curImg      = players[0].img;

const startPageTemplate   = `<header>
                      <h1>Tic Tac Toe</h1>
                      <p>Add your names if you like:</p>
                      <p>
                      <input type="text" id="participant-1" placeholder="Enter player 1 name" value=""></input>
                      <input type="text" id="participant-2" placeholder="Enter player 2 name" value=""></input>
                      </p>
                      <a href="#" class="button">Start game</a>
                      <p>or</p>
                      <a href="#" class="button">Play against computer</a>
                    </header>`;

const winPageTemplate     = `<header>
                      <h1>Tic Tac Toe</h1>
                      <p class="message"></p>
                      <a href="#" class="button">New game</a>
                    </header>`;

function loadPage(page,optionalClass,messageText,playerName){
  const createPage  = document.createElement('div');

  if(page === "start"){
    createPage.classList.add('screen', 'screen-start');
    createPage.innerHTML  = startPageTemplate;
  } else if(page === "finish"){
    createPage.classList.add('screen', 'screen-win', optionalClass);
    createPage.setAttribute("id", "finish");
    createPage.innerHTML  = winPageTemplate;

    const message = createPage.querySelector(".message");
    message.textContent = messageText + " " +playerName;
  }

  // Add page & hide board on page load
  pageBody.insertBefore(createPage,board);

  // hide the board
  board.style.display = 'none';
}

function startGame(){
  const startHtml         = document.querySelector(".screen-start");
  startHtml.style.display = "none";
  board.style.display     = 'block';
  player1Container.classList.add('active');
  boxHover();

  // Add Player Names, optional
  const nameField1  = document.getElementById("participant-1");
  const nameField2  = document.getElementById("participant-2");

  players[0].name   = (computerRival) ? "You" : nameField1.value;
  players[1].name   = (computerRival) ? "Computer" : nameField2.value;

  // Append player names if it were entered
  if(players[0].name) {
    player1Container.innerHTML = player1Container.innerHTML + "<p>"+players[0].name+"</p>";
  }
  if(players[1].name) {
    player2Container.innerHTML = player2Container.innerHTML + "<p>"+players[1].name+"</p>";
  }
}

function evaluateMove(){

  const allwins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]];

  let result = false;

  // Iterate through winning combinations & compare to logged moves
  for(i=0; i < allwins.length; i++){
    if(boxVals[allwins[i][0]] == curPlayer && boxVals[allwins[i][1]] == curPlayer && boxVals[allwins[i][2]] == curPlayer){
      // Found a winning combination!!!
      result = true;
      return true;
    }
  };
  return result;

}

function selectBox(e,boxNum){

  //check for presence of select class
  const classPresent  = e.target.classList.item(1);

  // If the selected class is not present then remove the background image
  if(!classPresent){

    // Add record of move to log & increment move counter
    boxVals[ boxNum ] = curPlayer;
    counter++;

    // If we've had enough moves, see if we have a winner
    if(evaluateMove() && counter > 4){
      showResult("WINNER");
    } else {

      // No winner
      // Are there more moves available to the players?
      if(counter < 9){
        // change the box and switch player turn
        e.target.classList.add(curPlayer);

        // Swith key variables & UI elements to account for player turn change
        if(curPlayer === players[1].marker){
          // Player 1
          curPlayer   = players[0].marker;
          curImg      = players[0].img;
        } else {
          // Player 2
          curPlayer   = players[1].marker;
          curImg      = players[1].img;
        }

        player1Container.classList.toggle('active');
        player2Container.classList.toggle('active');

        if(computerRival && curPlayer === players[1].marker){
          // enable an element which blocks user clicks while compiuter is making a move
          const blocker = document.getElementById("blocker");
          blocker.style.display = "block";

          // Add a slight delay before computer move, for realism
          setTimeout(function(){
            computerMove();
            // remove blocker to enable clicks again
            blocker.style.display = "none";
          },800);
        }

      } else{
        showResult("DRAW");
      }
    }

  }
}

function mouseEvents(e){
  //check for presence of select class
  const classPresent  = e.target.classList.item(1);

  // If the selected class is not present then remove the background image
  if(!classPresent && e.type === "mouseover"){
    e.target.style.backgroundImage = "url('"+curImg+"')";
  } else if(!classPresent && e.type === "mouseout"){
    e.target.removeAttribute("style");
  }

}

// Create event listeners for click, mouseover & mouseout
function boxHover(){

  for(i = 0; i < boxes.length; i++){
    const boxNum = i;
    //claim the cell on click
    boxes[i].addEventListener('click',(e) => selectBox(e,boxNum));

    // rollover states
    boxes[i].addEventListener('mouseover',(e) => mouseEvents(e));
    boxes[i].addEventListener('mouseout',(e) => mouseEvents(e));
  };
}

function showResult(result){

  let winClass    = "";
  let messageText = "Winner";
  let playerName  = "";

  if(result=== "DRAW"){
    winClass = "screen-win-tie";
    messageText = "It's a Tie!";
  } else if(result == "WINNER"){
    winClass = (curPlayer === players[0].marker) ? "screen-win-one" : "screen-win-two";
    playerName = (curPlayer === players[0].marker) ? players[0].name : players[1].name;
  }
  // Load end page to display result
  loadPage("finish",winClass,messageText,playerName);
}

// When playing against computer, execute move
function computerMove(){

  const optionalMoves = [];

  // identify the unoccupied cells & add them to optionalMoves array
  for(i=0; i < boxVals.length; i++){
    if(!boxVals[i]) optionalMoves.push(i);
  };

  //randomise a selection from the optional moves
  var rand = optionalMoves[Math.floor(Math.random() * optionalMoves.length)];

  // simulate a click on the chosen cell
  boxes[rand].click();
}

// Load the start page
loadPage("start");

// Listeners for clicks on buttons
document.addEventListener('click',(e) => {
  e.preventDefault();
  if(e.target && e.target.className === 'button'){
    const btnContent   = e.target.textContent;

    if(btnContent === "Start game"){
      startGame();
    } else if(btnContent === "Play against computer"){
      computerRival = true;
      startGame();
    } else if (btnContent === "New game"){
      // Reload page & start again
      window.location.reload();
    }
   }
});

}();
