const scores={X:1, O:-1, tie: 0};

class TicTacToe{
  rows=3; cols=3;
  n = this.rows*this.cols;
  blocks;           //playable spaces
  WinningPatterns;  //win conditions
  xTurn=false;      //is it the X Player's turn
  canPlay=true;     //is the game going?
  players = ['O','X'];
  state;
  turnCount=0;

  constructor(){
    this.blocks=[];
    this.WinningPatterns=[];
    this.init();
    if(Math.random() > 0.5){
      this.xTurn=true;
    }
    if(this.xTurn){
      console.log(this.players[1],"Start")
    } else {
      console.log(this.players[0],"Start")
    }
  }

  init(){
    this.getWinningPatterns();

    for(let row=0;row<this.rows;row++){
      for(let col=0;col<this.cols;col++){
        let block = document.createElement("button");
        block.classList.add("block");
        block.addEventListener('click', (e)=>this.onBlockClick(block));
        board.appendChild(block);
        this.blocks.push(block);
      }
    }
    this.positionBlocks();

    switch(mode.value){
      case "1": console.log("Human vs. Human"); this.play(1); break;
      case "2": console.log("Human vs. Computer"); this.play(2); break;
      case "3": console.log("Human vs. AI"); this.play(3); break;
      case "4": console.log("Computer vs. Computer"); this.play(4); break;
      case "5": console.log("Human vs. AI+"); this.play(5); break;
    }
  }

  async play(val){
    while(this.canPlay){
      await delay(500);
      if (val==2){
        if(this.xTurn&&this.canPlay){
          this.computerMove(val);
        }
      }
      if (val==3){
        if(this.xTurn&&this.canPlay){
          this.computerMove(val);
        }
      }
      if (val==4){
        await delay(100);
        this.computerMove(val);
      }
      if (val==5){
        if(this.xTurn&&this.canPlay){
          this.computerMove(val);
        }
      }
    }
    if(this.state=="tie"){
      console.log("Match is a Draw");
    } else {
      console.log("Winner is", this.state);
    }
  }

  getWinningPatterns(){
    let pattern = [];
    for(let row=0;row<this.rows;row++){
      pattern = [];
      for(let col=0;col<this.cols;col++){
        pattern.push(col+row*this.cols);
      }
      this.WinningPatterns.push(pattern);
    }
    for(let row=0;row<this.rows;row++){
      pattern = [];
      for(let col=0;col<this.cols;col++){
        pattern.push(row+col*this.rows);
      }
      this.WinningPatterns.push(pattern);
    }

    pattern = [];
    for(let row=0;row<this.rows;row++){
      for(let col=0;col<this.cols;col++){
        if (row == col)
          pattern.push(row+col*this.rows);
      }
    }
    this.WinningPatterns.push(pattern);

    pattern = [];
    for(let row=0;row<this.rows;row++){
      for(let col=0;col<this.cols;col++){
        if ((row+col) == (this.cols)-1)
          pattern.push(col+row*this.cols);
      }
    }
    this.WinningPatterns.push(pattern);
  }

  computerMove(){
    let spaces=this.blocks.map(s=>s.innerText);
    let empty=[];
    for(let i=0; i<spaces.length; i++){
      if(spaces[i]=="")
        empty.push(i)
    }
    let move=Math.floor(Math.random()*empty.length);
    
    if(mode.value==3){
      console.log("AI");
      let bestScore=-Infinity;
      console.time("AI Move");
      for(let space in empty){
        this.blocks[empty[space]].innerText = this.xTurn ? this.players[1]:this.players[0];
        let score = this.minimax(this.blocks,0,!this.xTurn);  // checks the outcome of the next move;
        this.blocks[empty[space]].innerText = "";
        if(score > bestScore){
          bestScore = score;
          move=space;
        }
        let results={space:empty[space], Score:score, BestMove:empty[move]}
        console.log(results);
      }
      console.timeEnd("AI Move");
    }

    if(mode.value==5){
      console.log("AI");
      let bestScore=-Infinity;
      console.time("AI Move");
      for(let space in empty){
        this.blocks[empty[space]].innerText = this.xTurn ? this.players[1]:this.players[0];
        let score = this.minimax(this.blocks,0,-Infinity,Infinity,!this.xTurn);  // checks the outcome of the next move;
        this.blocks[empty[space]].innerText = "";
        if(score > bestScore){
          bestScore = score;
          move=space;
        }
        let results={space:empty[space], Score:score, BestMove:empty[move]}
        console.log(results);
      }
      console.timeEnd("AI Move");
    }
    this.setBlock(this.blocks[empty[move]]);
  }

  //maximizing player is always X, minimizing player is always O
  minimax(board,depth,isMax){
    let depthCheck;
    if(this.rows > 3)
      depthCheck = this.turnCount > this.rows ? this.rows:1;
    else 
      depthCheck = Infinity;

    let result = this.checkWinner(board.map(s=>s.innerText));
    if(result !== null){
      return scores[result];
    }

    if(depth>depthCheck){
      return scores["tie"];
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
  minimax(board,depth,a,b,isMax){
    let depthCheck;
    if(this.rows > 3)
      depthCheck = this.turnCount > this.rows ? this.n:5;
    else 
      depthCheck = Infinity;
    let result = this.checkWinner(board.map(s=>s.innerText));
    if(result !== null){
      return scores[result];
    }

    if(depth>depthCheck){
      return scores["tie"];
    }

    if(isMax){
      let bestScore = -Infinity;
      for(let i=0; i<board.length; i++){
        if(board[i].innerText == ""){
          board[i].innerText = this.players[1];
          let score = this.minimax(board,depth+1,a,b,false);
          board[i].innerText = "";
          bestScore = Math.max(score, bestScore);
          a = Math.max(a, score)
          if(b <= a){break}
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for(let i=0; i<board.length; i++){
        if(board[i].innerText == ""){
          board[i].innerText = this.players[0];
          let score = this.minimax(board,depth+1,a,b,true);
          board[i].innerText = "";
          bestScore = Math.min(score, bestScore);
          b = Math.min(b, score)
          if(b <= a){break}
        }
      }
      return bestScore;
    }
  }

  checkWinner(BLOCKS){
    let winner = null;
    for(let pattern of this.WinningPatterns){
      //console.log(pattern);
      
      let feild = [];
      for(let i=0; i<this.cols; i++){
        feild.push(BLOCKS[pattern[i]]);
      }

      let same= feild.every(val => val == feild[0] && val!="");
      if(same)
        winner = feild[0]
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
  positionBlocks(){
    for(let row=0;row<this.rows;row++){
      for(let col=0;col<this.cols;col++){
        let index = row+col*this.rows;
        let block = this.blocks[index];

        block.style.fontSize = block.clientWidth/this.cols + "vmin";
        block.style.height = board.clientHeight/this.rows + "px";
        block.style.width = board.clientWidth/this.cols + "px";
        console.log()
        block.style.top = (col*block.clientHeight) + (board.clientHeight*((2*this.rows)*0.001)*col) +"px";
        block.style.left = (row*block.clientWidth) + (board.clientWidth*((2*this.cols)*0.001)*row) +"px";
      }
    }
  }
  /* try move block and check if puzzle was solved */
  onBlockClick(block){
    if(this.canPlay){
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
    this.turnCount++;
    block.disabled=true;
    this.state = this.checkWinner(this.blocks.map(s=>s.innerText));
    if(this.state!=null){
      this.canPlay = false;
    }
  }
}