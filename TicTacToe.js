const scores={X:1, O:-1, tie: 0};

class TicTacToe{
  blocks;        //playable spaces
  xTurn=false;   //is it the X Player's turn
  canPlay=true;  //is the game going?
  players = ['O','X'];
  state;

  constructor(){
    this.blocks=[];
    this.init();
    if(Math.random() > 0.5){
      this.xTurn=true;
    }
    if(this.xTurn){
      console.log(this.players[1],"Start")
    } else {
      console.log(this.players[0],"Start")
    }
    this.play();
  }

  init(){
    for(let row=0;row<3;row++){
      for(let col=0;col<3;col++){
        let blockIdx = row+col*3;
        
        let block = document.createElement("button");
        block.classList.add("block");
        block.addEventListener('click', (e)=>this.onBlockClick(block));
        board.appendChild(block);
        this.positionBlock(block,row,col);
        this.blocks.push(block);
      }
    }
  }

  async play(){
    while(this.canPlay){
      await delay(500);
      if(this.xTurn&&this.canPlay){
        this.computerMove();
      }
    }
    if(this.state=="tie"){
      console.log("Match is a Draw");
    } else {
      console.log("Winner is", this.state);
    }
  }

  computerMove(){
    let spaces=this.blocks.map(s=>s.innerText);
    let empty=[];
    for(let i=0; i<spaces.length; i++){
      if(spaces[i]=="")
        empty.push(i)
    }
    let move=Math.floor(Math.random()*empty.length);
    
    console.log("AI");
    let bestScore=-Infinity;
    for(let i=0; i<this.blocks.length; i++){
      if(this.blocks[i].innerText == ""){
        this.blocks[i].innerText = this.players[1];
        let score = this.minimax(this.blocks,0,false);  // checks the outcome of the next move;
        this.blocks[i].innerText = "";
        if(score > bestScore){
          bestScore = score;
          move=i;
        }
        console.log(i,score,move);
      }
    }
    this.setBlock(this.blocks[move]);
  }

  //maximizing player is always X, minimizing player is always O
  minimax(board,depth,isMax){
    let result = this.checkWinner(board.map(s=>s.innerText));
    //console.log("Depth",depth,result);
    if(result !== null){
      return scores[result];
    }

    if(isMax){
      let bestScore = -Infinity;
      for(let i=0; i<board.length; i++){
        if(board[i].innerText == ""){
          board[i].innerText = this.players[1];
          let score = this.minimax(board,depth+1,false);
          board[i].innerText = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for(let i=0; i<board.length; i++){
        if(board[i].innerText == ""){
          board[i].innerText = this.players[0];
          let score = this.minimax(board,depth+1,true);
          board[i].innerText = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  checkWinner(BLOCKS){
    let winner = null;
    for(let pattern of winningPatterns){
      let A = BLOCKS[pattern[0]];
      let B = BLOCKS[pattern[1]];
      let C = BLOCKS[pattern[2]];

      if (A != "" && B!="" && C!="" &&
          A === B && B === C) {
            winner = A;
      }
    }

    if (this.canPlay && winner==null) {
      let spaces = BLOCKS.includes("");
      if (!spaces) {
        winner = "tie";
      }
    }
    return winner;
  }

  /* positions the block at a certain coordinates */
  positionBlock(block,row,col){
    block.style.top = (row*block.clientWidth) + "px";
    block.style.left = (col*block.clientHeight) + "px";
  }
  /* try move block and check if puzzle was solved */
  onBlockClick(block){
    if(this.canPlay&&!this.xTurn){
      this.setBlock(block);
    }
  }
  setBlock(block){
    if (this.xTurn){
      block.innerText = this.players[1];
      this.xTurn=false;
    } else {
      block.innerText = this.players[0];
      this.xTurn=true;
    }
    block.disabled=true;
    this.state = this.checkWinner(this.blocks.map(s=>s.innerText));
    if(this.state!=null){
      this.canPlay = false;
    }
  }
}