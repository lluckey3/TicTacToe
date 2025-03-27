const board=document.getElementById("container");

class Game{
  cols=3;     //How many colomns
  rows=3;     //How many rows
  cnt;        //cols * rows
  blocks;     //playable spaces
  turnO;      //is it Player O turn
  canPlay=true;

  constructor(){
    this.cnt = this.cols * this.rows;
    this.blocks=[];
    this.turnO=true;
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
      if (this.turnO){
        block.innerText = 'O';
        this.turnO=false;
        block.disabled=true;
        this.checkWinner();
      } else {
        block.innerText = 'X';
        this.turnO=true;
        block.disabled=true;
        this.checkWinner();
      }
    }
  }

  checkWinner(){
    //let win=false;
    for(let pattern of winningPatterns){
      let A = this.blocks[pattern[0]].innerText;
      let B = this.blocks[pattern[1]].innerText;
      let C = this.blocks[pattern[2]].innerText;

      if (A !== "" && B!=="" && C!=="" &&
          A === B && B === C) {
            console.log("Winner is", A);
          this.canPlay = false;
          return;
      }
    }

    if (this.canPlay) {
      const spaces = [...this.blocks].every((block) => block.innerText !== "");
      if (spaces) {
          console.log("Match is a Draw");
      }
    }
  }
}