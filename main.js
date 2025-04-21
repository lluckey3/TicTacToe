const winningPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  //Horizontal
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  //Vertical
  [0, 4, 8], [2, 4, 6]              //Diagonal
];

const board=document.getElementById("container");
const mode=document.getElementById("mode");
const gameBtn=document.getElementById("game");

mode.value="1";

mode.onchange=function(){
  game=new TicTacToe();
}

window.onresize=function(){
  game.positionBlocks();
}

gameBtn.addEventListener('click', (e)=>{game=new TicTacToe()});

/* Driver Code */
var game=new TicTacToe();   // instantiate a new Game

function delay(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}