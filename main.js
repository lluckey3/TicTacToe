const board=document.getElementById("container");
const mode=document.getElementById("mode");
const gameBtn=document.getElementById("game");

mode.value="3";

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