/* CPSC 1045-001
 * Final Project
 * November 18, 2019
 * Name: Emily Mackay
*/


let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let numberOfMoves = 0;
let cardBoardArr = [];
let selectedCardArr = [];
let emptyTilesArr = [];

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

let tileCoordinates = [
  [0, 0, 0],
  [1, 200, 0],
  [2, 400, 0],
  [3, 0, 200],
  [4, 200, 200],
  [5, 400, 200],
  [6, 0, 400],
  [7, 200, 400],
  [8, 400, 400],
];

let adjacentCards = [
  [0, 1, 3],
  [1, 0, 2, 4],
  [2, 1, 5],
  [3, 0, 4, 6],
  [4, 1, 3, 5, 7],
  [5, 2, 4, 8],
  [6, 3, 7],
  [7, 4, 6, 8],
  [8, 5, 7],
];



function setUp() {
  document.getElementById("level").innerHTML = "1";
  document.getElementById("target").innerHTML = "1024";
  document.getElementById("allotted").innerHTML = "10";
  document.getElementById("moves").innerHTML = numberOfMoves;
  createStartingBoard();
  cardClicked();
}//setUp()




function Card(x, y, num) {
  this.num = num;
  this.selected = false;
  this.index = null;
  this.x = x;
  this.y = y;
  this.circle = new Path2D();

  this.generate = function(cardNumber, cardColour, numberTextStyle, numberCoorX, numberCoorY) {
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

  this.select = function() {
    ctx.strokeStyle = "white";
    this.circle.arc(this.x, this.y, 75, 0, 2*Math.PI);
    ctx.lineWidth = 10;
    ctx.stroke(this.circle);
    this.selected = true;
    this.clickCount++;
  }
}//object Card()




function createStartingBoard() {
  let r, newCard, index;
  cardBoardArr.length = 0;
  numberOfMoves = 0;
  document.getElementById("moves").innerHTML = numberOfMoves;
  document.getElementById("messages").innerHTML = "";
  for (let i = 100; i <= 600; i += 200) {
    for (let j = 100; j <= 600; j += 200) {
      r = Math.floor((Math.random() * 3) + 1);
      newCard = new Card(j, i, cardStyle[r][0]);
      newCard.generate(cardStyle[r][0], cardStyle[r][1], cardStyle[r][2], cardStyle[r][3], cardStyle[r][4]);
      cardBoardArr.push(newCard);
      index = cardBoardArr.indexOf(newCard);
      newCard.index = index;
    }
  }
}//createCards()





function cardClicked() {
  canvas.addEventListener("click", function(event) {
    for (let j = 0; j < cardBoardArr.length; j++) {
      //Checks if click is on a circle
      if (ctx.isPointInPath(cardBoardArr[j].circle, event.offsetX, event.offsetY) && cardBoardArr[j].num != 0) {
        document.getElementById("messages").innerHTML = "";
        //Checks for selected trait and whether 2 are already selected
        if (!cardBoardArr[j].selected && selectedCardArr.length < 2) {
          cardBoardArr[j].select();
          selectedCardArr.push([cardBoardArr[j], j]);
          if (selectedCardArr.length == 2) {
            if (checkEqualAndAdjacent()) {
              combineCards();
              selectedCardArr.length = 0;
              findEmptyTiles();
            }
          }
        }
        else if (cardBoardArr[j].selected) {
          let clr = findStyle(cardBoardArr[j].num);
          cardBoardArr[j].selected = false;
          ctx.clearRect(tileCoordinates[j][1], tileCoordinates[j][2], 200, 200);
          cardBoardArr[j].generate(cardStyle[clr][0], cardStyle[clr][1], cardStyle[clr][2], cardStyle[clr][3], cardStyle[clr][4]);
          for (let m = 0; m < selectedCardArr.length; m++) {
            if(selectedCardArr[m][1] == j) {
              selectedCardArr.splice(m, 1);
              return;
            }
          } //end for loop
        } //end if (selected)
      } //end circle check
    } //end for loop
  });
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
  let addedCardNumber = selectedCardArr[0][0].num + selectedCardArr[1][0].num;
  let clr = findStyle(addedCardNumber);

  for (let i = 0; i < cardBoardArr.length; i++) {
    if (selectedCardArr[0][1] == i) {
      ctx.clearRect(tileCoordinates[i][1], tileCoordinates[i][2], 200, 200);
      cardBoardArr[i].num = 0;
      cardBoardArr[i].selected = false;
    }
    if (selectedCardArr[1][1] == i) {
      ctx.clearRect(tileCoordinates[i][1], tileCoordinates[i][2], 200, 200);
      cardBoardArr[i].generate(cardStyle[clr][0], cardStyle[clr][1], cardStyle[clr][2], cardStyle[clr][3], cardStyle[clr][4]);
      cardBoardArr[i].num = addedCardNumber;
      cardBoardArr[i].selected = false;
    }
  }
  numberOfMoves++;
  document.getElementById("moves").innerHTML = numberOfMoves;
}//combineCards()




function findEmptyTiles() {
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
    document.getElementById("messages").innerHTML = "Cannot generate a new card. The board is already full!";
    return;
  }

  randomEmptyIndex = Math.floor((Math.random() * emptyTilesArr.length));
  randomIndexOnBoard = emptyTilesArr[randomEmptyIndex].index;
  r = Math.floor((Math.random() * 3) + 1);
  cardBoardArr[randomIndexOnBoard].num = cardStyle[r][0];
  cardBoardArr[randomIndexOnBoard].generate(cardStyle[r][0], cardStyle[r][1], cardStyle[r][2], cardStyle[r][3], cardStyle[r][4]);
}//generateCard()




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
