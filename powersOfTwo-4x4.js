/* CPSC 1045-001
 * Final Project
 * November 18, 2019
 * Name: Emily Mackay
 * Student ID: 100305076
*/


let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let numberOfMoves = 0;
let cardBoardArr = [];
let selectedCardArr = [];
let emptyTilesArr = [];

// used to hold the draw styles for each of the cards, to ensure the number appears centered on the card.
let cardStyle = [
  [0, "rgba(255, 255, 255, 0.0)", "0px Arial", 0, 0], // 2^0 empty transparent square
  // cardNumber, cardColour, numberTextStyle, numberCoorX, numberCoorY
  [2, "#ef9a9a", "bold 75px Arial", -20, 25],    // 2^1
  [4, "#9fa8da", "bold 75px Arial", -22, 25],    // 2^2
  [8, "#abebc6", "bold 75px Arial", -20, 25],    // 2^3
  [16, "#fad7a0", "bold 65px Arial", -38, 20],   // 2^4
  [32, "#90caf9", "bold 65px Arial", -37, 20],   // 2^5
  [64, "#d1c4e9", "bold 65px Arial", -37, 20],   // 2^6
  [128, "#b2ebf2", "bold 60px Arial", -52, 20],  // 2^7
  [256, "#80cbc4", "bold 60px Arial", -50, 20],  // 2^8
  [512, "#ce93d8", "bold 60px Arial", -50, 20],  // 2^9
  [1024, "#edbb99", "bold 55px Arial", -63, 20], // 2^10
  [2048, "#f8bbd0", "bold 55px Arial", -60, 20], // 2^11
  [4096, "#bcaaa4", "bold 55px Arial", -62, 20], // 2^12
];

// holds the coordinates for each of the 16 tiles. Used to clear a tile when selecting/deselecting and when combining cards.
let tileCoordinates = [
  [0, 0, 0],
  [1, 200, 0],
  [2, 400, 0],
  [3, 600, 0],
  [4, 0, 200],
  [5, 200, 200],
  [6, 400, 200],
  [7, 600, 200],
  [8, 0, 400],
  [9, 200, 400],
  [10, 400, 400],
  [11, 600, 400],
  [12, 0, 600],
  [13, 200, 600],
  [14, 400, 600],
  [15, 600, 600],
];

// holds the adjacent tiles indexes for each of the 16 tiles. Used in the checkEqualAndAdjacent() function.
let adjacentCards = [
  [0, 1, 4],
  [1, 0, 2, 5],
  [2, 1, 3, 6],
  [3, 2, 7],
  [4, 0, 5, 8],
  [5, 1, 4, 6, 9],
  [6, 2, 5, 7, 10],
  [7, 3, 6, 11],
  [8, 4, 9, 12],
  [9, 5, 8, 10, 13],
  [10, 6, 9, 11, 14],
  [11, 7, 10, 15],
  [12, 8, 13],
  [13, 9, 12, 14],
  [14, 10, 13, 15],
  [15, 11, 14]
];



function setUp() {
  document.getElementById("level").innerHTML = "1";
  document.getElementById("target").innerHTML = "1024";
  document.getElementById("moves").innerHTML = numberOfMoves;
  createStartingBoard();
  cardClicked();
}//setUp()



function Card(x, y, num) {
  // each card will hold its value, its index, x and y coordinates and have a selected boolean value
  // it also holds a Path circle property in order to allow it to be clicked.
  this.num = num;
  this.selected = false;
  this.index = null;
  this.x = x;
  this.y = y;
  this.circle = new Path2D();

  // will take the values from the cardStyle multi-dimensional array to draw the cards.
  this.draw = function(cardNumber, cardColour, numberTextStyle, numberCoorX, numberCoorY) {
    this.circle.arc(this.x, this.y, 75, 0, 2*Math.PI);
    ctx.fillStyle = cardColour;
    ctx.fill(this.circle);
    ctx.save();
    ctx.font = numberTextStyle;
    ctx.fillStyle = "white";
    ctx.translate(this.x, this.y);
    ctx.fillText(cardNumber, numberCoorX, numberCoorY);
    ctx.restore();
  }

  // this Object function draws the white circle around it to have it "selected"
  this.select = function() {
    ctx.strokeStyle = "white";
    this.circle.arc(this.x, this.y, 75, 0, 2*Math.PI);
    ctx.lineWidth = 10;
    ctx.stroke(this.circle);
    this.selected = true;
    this.clickCount++;
  }
}//object Card()



// draws a randomized starting board and stores each of the 16 cards in an array of Objects
function createStartingBoard() {
  let r, newCard, index;
  cardBoardArr.length = 0;
  numberOfMoves = 0;
  document.getElementById("moves").innerHTML = numberOfMoves;
  document.getElementById("messages").innerHTML = "";
  for (let i = 100; i <= 800; i += 200) {
    for (let j = 100; j <= 800; j += 200) {
      r = Math.floor((Math.random() * 3) + 1); //will get a random value from the cardStyle array to make randomized cards
      newCard = new Card(j, i, cardStyle[r][0]);
      newCard.draw(cardStyle[r][0], cardStyle[r][1], cardStyle[r][2], cardStyle[r][3], cardStyle[r][4]);
      cardBoardArr.push(newCard); //stores the cards in an array
      index = cardBoardArr.indexOf(newCard); //finds the index and sets the card's index property in the Object array
      newCard.index = index;
    }
  }
}//createCards()




function cardClicked() {
  canvas.addEventListener("click", function(event) {
    for (let j = 0; j < cardBoardArr.length; j++) {
      // checks if the click is in the circle "Path", which is a property of the Card object, + makes sure we can't select 'blank' tiles
      if (ctx.isPointInPath(cardBoardArr[j].circle, event.offsetX, event.offsetY) && cardBoardArr[j].num != 0) {
        document.getElementById("messages").innerHTML = "";
        // checks for selected boolean property and whether 2 are already selected
        if (!cardBoardArr[j].selected && selectedCardArr.length < 2) {
          cardBoardArr[j].select();
          selectedCardArr.push([cardBoardArr[j], j]);
          if (selectedCardArr.length == 2) { // if 2 are selected, will check and combine if check returns true
            if (checkEqualAndAdjacent()) {
              combineCards();
              selectedCardArr.length = 0; // emptys the selected array so that 2 new ones can be chosen
              findEmptyTiles(); // adds empty tiles to another array
            }
          }
        }
        // this else section allows the user to "deselect" in case they re-think their move.
        // can only be done if only 1 is selected, as once 2 are selected, the comparison & combining of cards will start.
        else if (cardBoardArr[j].selected) {
          let clr = findStyle(cardBoardArr[j].num);
          cardBoardArr[j].selected = false;
          ctx.clearRect(tileCoordinates[j][1], tileCoordinates[j][2], 200, 200); // clears only that tile of the board
          cardBoardArr[j].draw(cardStyle[clr][0], cardStyle[clr][1], cardStyle[clr][2], cardStyle[clr][3], cardStyle[clr][4]);
          for (let m = 0; m < selectedCardArr.length; m++) {
            if(selectedCardArr[m][1] == j) {
              selectedCardArr.splice(m, 1); // splices the selected card from the selected array
              return;
            }
          } //end for loop
        } //end if (selected)
      } //end circle check
    } //end for loop
  }); //end event listener
}//cardClicked()



function findStyle(cardNumber) {
  let colour;
  for (let i = 0; i < cardStyle.length; i++) {
    if (cardStyle[i][0] == cardNumber) {
      return i; // finds the colour/style depending on the card's stored number to redraw it later.
    }
  }
}//findStyle()




function checkEqualAndAdjacent() {
  let firstSelectedCardNumber = selectedCardArr[0][0].num;
  let secondSelectedCardNumber = selectedCardArr[1][0].num;
  let firstSelectedIndex = selectedCardArr[0][1];
  let secondSelectedIndex = selectedCardArr[1][1];

  if (firstSelectedCardNumber == secondSelectedCardNumber) { //checks if both numbers are equal
    for (let m = 0; m < adjacentCards.length; m++) {
      if (firstSelectedIndex == adjacentCards[m][0]) { //finds the 1st index in the adjacent Array
        for (let n = 0; n < adjacentCards[m].length; n++) {
          if (secondSelectedIndex == adjacentCards[m][n]) { //checks if the 2nd index is adjacent to the first
            return true;
          }
        }
      }
    }
  }
  return false; //if one or other check doesn't work, then will return false.
}//checkEqualAndAdjacent()




function combineCards() {
  let addedCardNumber = selectedCardArr[0][0].num + selectedCardArr[1][0].num; //adds the two cards' values
  let clr = findStyle(addedCardNumber); //finds the style of the new number

  for (let i = 0; i < cardBoardArr.length; i++) {
    // clears the 1st selected card so that the 1st selected card appears to "slide" and combine with the 2nd
    if (selectedCardArr[0][1] == i) {
      ctx.clearRect(tileCoordinates[i][1], tileCoordinates[i][2], 200, 200);
      cardBoardArr[i].num = 0; // blank tiles will have a property of 0
      cardBoardArr[i].selected = false;
    }
    if (selectedCardArr[1][1] == i) {
      // clears the tile and draws the new combined card, updates the number property
      ctx.clearRect(tileCoordinates[i][1], tileCoordinates[i][2], 200, 200);
      cardBoardArr[i].draw(cardStyle[clr][0], cardStyle[clr][1], cardStyle[clr][2], cardStyle[clr][3], cardStyle[clr][4]);
      cardBoardArr[i].num = addedCardNumber;
      cardBoardArr[i].selected = false;
    }
  }
  numberOfMoves++;
  document.getElementById("moves").innerHTML = numberOfMoves;
}//combineCards()



function findEmptyTiles() {
  // this will run each time a card is combined so that an array of empty tiles is kept up to date
  // this will be used to find which tiles are able to have new cards generated on them!
  emptyTilesArr.length = 0;
  for (let i = 0; i < cardBoardArr.length; i++) {
    if (cardBoardArr[i].num == 0) {
      emptyTilesArr.push(cardBoardArr[i]);
    }
  }
}



function generateCard() {
  let randomEmptyIndex;
  let randomIndexOnBoard;
  let r;
  findEmptyTiles();
  if (emptyTilesArr.length == 0) {
    //prevents an out of bounds error from occuring
    document.getElementById("messages").innerHTML = "Cannot generate a new card. The board is already full!";
    return;
  }

  randomEmptyIndex = Math.floor((Math.random() * emptyTilesArr.length)); //finds a random number
  randomIndexOnBoard = emptyTilesArr[randomEmptyIndex].index; //finds the index of the random number
  r = Math.floor((Math.random() * 3) + 1);
  cardBoardArr[randomIndexOnBoard].num = cardStyle[r][0]; //updates the number property
  cardBoardArr[randomIndexOnBoard].draw(cardStyle[r][0], cardStyle[r][1], cardStyle[r][2], cardStyle[r][3], cardStyle[r][4]);
}//generateCard()



/******* USED TO FOR TESTING AND DEVELOPING ********/
function printArray() {
  console.log("\n***** THE CARD ARRAY *****");
  for (let i = 0; i < cardBoardArr.length; i++) {
    console.log(cardBoardArr[i]);
  }
  console.log("\n===== SELECTED ARRAY =====");
  for (let j = 0; j < selectedCardArr.length; j++) {
    console.log(selectedCardArr[j]);
  }
  console.log("\n----- EMPTY ARRAY -----");
  for (let k = 0; k < emptyTilesArr.length; k++) {
  console.log(emptyTilesArr[k]);
  }
}//printArray()
