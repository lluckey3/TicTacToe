const board=document.getElementById("container");
//const mode=document.getElementById("mode");
const scores={X:1, O:-1, tie: 0};

mode.value="3";

mode.onchange=function(){
  game=new Game();
}

class Game{
  cols=3;       //How many colomns
  rows=3;       //How many rows
  cnt;          //cols * rows
  blocks;       //playable spaces
  xTurn=false;  //is it the X Player's turn
  canPlay=true; //is the game going?
  marker="O";
  state;

  constructor(){
    this.cnt = this.cols * this.rows;
    this.blocks=[];
    this.init();
  }

  init(){
    for(let y=0;y<this.rows;y++){
      for(let x=0;x<this.cols;x++){
        let blockIdx = x+y*this.cols;
        
        let block = document.createElement("button");
        block.classList.add("block");
        board.appendChild(block);
        this.blocks.push(block);
        this.positionBlock(blockIdx,x,y);
        block.addEventListener('click', (e)=>this.onBlockClick(blockIdx));
      }
    }

    switch(mode.value){
      case "1": console.log("Human vs. Human"); this.play(1); break;
      case "2": console.log("Human vs. Computer"); this.play(2); break;
      case "3": console.log("Human vs. AI"); this.play(3); break;
      case "4": console.log("Computer vs. Computer"); this.play(4);
    }
  }

  async play(val){
    while(this.canPlay){
      if (val==2){
        await this.delay(1000);
        if(!this.xTurn&&this.canPlay){
          this.computerMove(val);
        }
      }
      if (val==3){
        //await this.delay(1000);
        if(!this.xTurn&&this.canPlay){
          this.computerMove(val);
        }
      }
      if (val==4){
        this.computerMove(val);
        await this.delay(500);
      }
    }
    if(this.state=="tie"){
      console.log("Match is a Draw");
    } else {
      console.log("Winner is", this.state);
    }
  }

  delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  computerMove(val){
    let spaces=this.blocks.map(s=>s.innerText);
    let empty=[];
    for(let i=0; i<spaces.length; i++){
      if(spaces[i]=="")
        empty.push(i)
    }
    let move=Math.floor(Math.random()*empty.length);

    let bestScore = -Infinity;
    if(val == 3){
      for(let i=0; i<empty.length; i++){
        let score = this.minmax(i,0,this.xTurn);
        if(score > bestScore){
          bestScore = score;
          move = i;
        }
      }
    }
    //this.xTurn=true;
    this.setBlock(this.blocks[empty[move]]);
  }

  //maximizing player is always X, minimizing player is always O
  minmax(val, depth, isMax){
    let cBlocks = this.blocks.map(s=>s.innerText);
    cBlocks[val]=this.marker;
    let result = this.checkWinner(cBlocks);
    console.log(cBlocks,result);
    //console.log(spaces, cBlocks, depth, isMax, result, scores[result]);

    // Terminal condition
    if(result != null){
      return scores[result];
    }

    if(isMax){
      let bestScore = -Infinity;
    }
    
    return 1;
  }

  /* positions the block at a certain coordinates */
  positionBlock(blockIdx,x,y){
    let block = this.blocks[blockIdx];
    block.style.left = (x*block.clientWidth) + "px";
    block.style.top = (y*block.clientHeight) + "px";
  }

  /* try move block and check if puzzle was solved */
  onBlockClick(blockIdx){
    let block=this.blocks[blockIdx];
    if(this.canPlay){
      this.setBlock(block);
    }
  }

  setBlock(block){
    if(this.xTurn){this.marker="X";} else {this.marker="O";}
    block.innerText = this.marker;
    if (this.xTurn){
      this.xTurn=false;
    } else {
      this.xTurn=true;
    }
    block.disabled=true;
    this.state = this.checkWinner(this.blocks.map(s=>s.innerText));
    if(this.state!=null){
      this.canPlay = false;
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
}