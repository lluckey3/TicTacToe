const board=document.getElementById("container");
const mode=document.getElementById("mode");

mode.value="2";

mode.onchange=function(){
  game=new Game();
}

class Game{
  cols=3;     //How many colomns
  rows=3;     //How many rows
  cnt;        //cols * rows
  blocks;     //playable spaces
  turnO;      //is it Player O turn
  pTURN=true;
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

    switch(mode.value){
      case "1": console.log("Human vs. Human"); break;
      case "2": console.log("Human vs. Computer"); this.play(2); break;
      case "3": console.log("Human vs. AI"); break;
      case "4": console.log("Computer vs. Computer"); this.play(4);
    }
  }

  async play(val){
    while(this.canPlay){
      if (val==2){
        await this.delay(1000);
        if(!this.pTURN&&this.canPlay){
          this.computerMove();
          this.pTURN=true;
        }
      }
      if (val==4){
        this.computerMove();
        await this.delay(500);
      }
    }
  }

  delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  computerMove(){
    let spaces=this.blocks.map(s=>s.innerText);
    let empty=[];
    for(let i=0; i<this.cnt; i++){
      if(spaces[i]=="")
        empty.push(i)
    }
    let x=Math.floor(Math.random()*empty.length);
    this.setBlock(this.blocks[empty[x]]);
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
      this.pTURN=false;
    }
  }

  setBlock(block){
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

  checkWinner(){
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