import React from 'react';
import './App.css';

function App() {
  return (<div id = 'grid'>
        <div>
    
          <PlusMinus></PlusMinus>
            </div>
            
          </div>
  );
}

function Game(x,y){
  let game = []
  for (let i=0; i<x; i++){
    game.push([])
    for (let l=0;l<y;l++){
      game[i].push({
        clicked: false,
        bomb: Math.random()>0.8? true: false,
        flagged: 0
      })
    }
  }
  return game
}

function PlusMinus(){
  const [size,setSize] = React.useState([5,5])
  const [grid, setGrid] = React.useState(()=>Game(5,5));
  console.log("current size is",size)
  function xdec(){decrease(size,1)}
  function xinc(){increase(size,1)}
  function ydec(){decrease(size,0)}
  function yinc(){increase(size,0)}
  function increase(oldSize,index){
    let newSize = index===1?[oldSize[index-1],oldSize[index]+1]:[oldSize[index]+1,oldSize[index+1]]
     setSize(newSize)
     setGrid(Game(...newSize))
  }
  function decrease(oldSize,index){
    let newSize = index===1?[oldSize[index-1],oldSize[index]-1]:[oldSize[index]-1,oldSize[index+1]]
    setSize(newSize)
    setGrid(Game(...newSize))
  }
  return <div>
    
    <div>
        <button onClick={xdec}class="change">-X</button>
        <button onClick={xinc}class="change">+X</button>
        </div>
        <div>
        <button onClick={ydec}class="change">-Y</button>
        <button onClick={yinc}class="change">+Y</button>
        </div>
        <div><Grid size = {size} setSize = {setSize}setGrid={setGrid} grid={grid}></Grid></div>
    </div>
}

function Grid(props){ 
  const [win,setWin] = React.useState(false)
  function reset(){
    alert("KABOOM");
    gameOver(props.setGrid,props.setSize,setWin,props.size)
  }
  function reset2(){
    gameOver(props.setGrid,props.setSize,setWin,props.size)
  }
  function checkWin(grid){
    for (let row of grid){
      for (let cell of row){
        if (!cell.bomb){
          if (!cell.clicked){return false}
      }
      }
    }
    return true
  }
  return <div>
    
  {props.grid.map((row,rowdex)=>{
    return <div id='row'>
      {
      row.map((cell,celldex)=>{
        function handleClick() {
          props.setGrid(clickReducer(props.grid,celldex,rowdex))
          if (checkWin(clickReducer(props.grid,celldex,rowdex))){
            setWin(true)
          }
        }
        function handleRightClick(e){
          e.preventDefault()
          props.setGrid(clickReducer2(props.grid,celldex,rowdex))
        }
        return <Box 
          win={win}
          setGrid = {props.setGrid}
          clicked={props.grid[rowdex][celldex].clicked} 
          flag={cell.flagged} 
          bomb={cell.bomb} 
          click={cell.bomb?reset:handleClick} 
          rightClick={handleRightClick} 
          number={adjacent(props.grid,celldex,rowdex)}>
        </Box>
        })}
      </div>
  })}
  <div class="winner">{win?"Winner!":null}</div>
  <button class="change" onClick={reset2}>RESET</button>
  </div>
}

function adjacent(grid,x,y){
  let number = 0
  for (let dx = -1; dx <= 1; dx++){
    for (let dy = -1; dy <= 1; dy++){
      if (!grid[y+dy]||!grid[y+dy][x+dx]){continue}
      if (grid[y+dy][x+dx].bomb){
        number ++
      }
    }
  }
  return number
}

function isIsolated(grid,x,y){
  for (let dx = -1; dx <= 1; dx++){
    for (let dy = -1; dy <= 1; dy++){
      if (!grid[y+dy]||!grid[y+dy][x+dx]){continue}
      if (grid[y+dy][x+dx].bomb){
        return false
      }
    }
  }
  return true
}

function cycleFlag(clicked){
  if (clicked===0){
    return null
  }
  if (clicked===1){
    return "|>"
  }
  if (clicked===2){
    return "?"
  }
}

function Box(props){
  function displayNumber(){
    if(props.bomb){return null}
    if (!props.number){return null}
    else{return props.number}
  }
return <div 
id={props.bomb&&props.win?"minebox":"safebox"} 
class = {props.clicked?'white':'blue'} 
onClick={props.click}
onContextMenu={props.rightClick}
>
  {props.clicked?displayNumber():null}
  <div></div>
  <div 
  class='flag'>
    {cycleFlag(props.flag)}
    </div></div>
}

function clickReducer(oldState, x, y) {
  let newState = oldState.map((row,rowdex)=>{
    return row.map((cell,celldex)=>{
      if (rowdex===y&&celldex===x){
        return {...cell, clicked: true}
      }
      else{return cell}
    })
  })
  if (!isIsolated(newState,x,y)){
    return newState
  }
  for (let dx = -1; dx <= 1; dx++){
    for (let dy = -1; dy <= 1; dy++){
      let newX = x+dx
      let newY = y+dy
      if (!newState[newY]||!newState[newY][newX]){continue}
      if (!newState[newY][newX].clicked){
        newState = clickReducer(newState,newX,newY)
      }
    }
  }
  return newState
}

function clickReducer2(oldState, x, y) {
  return oldState.map((row,rowdex)=>{
    return row.map((cell,celldex)=>{
      if (rowdex===y&&celldex===x){
        if (cell.flagged===0||cell.flagged===1){
          return {...cell,flagged:cell.flagged+1}
        }
        else{return {...cell, flagged:0}}
      }
      else{return cell}
    })
  })
}



function gameOver(changeState,changesize,changewin,size) {
  changeState(Game(...size))
  changewin(false)
}






export default App;
