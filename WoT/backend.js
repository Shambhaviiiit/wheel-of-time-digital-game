const express = require('express');
const path = require('path');
const app = express();
const port = 3100;
const http = require('http')
const server = http.createServer(app)
const  {Server}=require('socket.io');
const { Socket } = require('dgram');
const io = new Server(server,{pingInterval:2000,pingTimeout:5000})//2nd parameter basically is for witing for things to be removed in backend incase of rapid reloads and disconnects
//we do so by checking every 2 seconds if player is valid and even if after 5 seconds it doesn't respond its invalid
// const socket = io()
app.use(express.static('public'));

//console.log(__dirname);
app.get('/', (req, resp) => {
  // console.log(path.join(__dirname, '../index.html'))
  resp.sendFile(path.join(__dirname, 'index.html'));
});

let iter=0
xcoords=[8,11,11,8]
ycoords=[12,12,15,15]
const backEndPlayers={}
io.on('connection',(socket)=>{
  console.log('A user Connected!')
  const playerID = socket.id;
  if(iter>3)
  {
    console.log("more than 4 players!!!!!")
    iter=0
  }
  backEndPlayers[playerID]={
    id:playerID,x:xcoords[iter],y:ycoords[iter],playerNumber:iter
  }
  if(Object.keys(backEndPlayers).length >= 4)
  {
    console.log("Ready to Start the Game for player ", backEndPlayers[playerID]["playerNumber"]+1)
    io.emit('game start')
  }
  else
    console.log("number of players: ", Object.keys(backEndPlayers).length)
  iter+=1
  // console.log(backEndPlayers)
  // console.log(iter)
  //it would have been socket.emit if you just wanted a particular to know
  socket.on('game ready', (isReady)=>{
    // console.log("game is ready anta")
    io.emit('updatePlayers',backEndPlayers)
    // io.emit
  })
  // console.log("elvis bhai")
  // if(iter )
  // socket.on('enemyDead',(val)=>{
  //   socket.emit('addEnemy',val)
  // })

  socket.on('i died', (id)=>{
    io.emit('player died', id)
  })

  socket.on('disconnect',(reason)=>{
    // console.log(reason)
    delete backEndPlayers[playerID]
    io.emit('updatePlayers',backEndPlayers)
  })
  socket.on('updateEnemyPoints', (id, points)=>{
    io.emit('updateEnemyPointsInAll', id, points);
  })
  socket.on('closePortal',({x,y})=>{
    // console.log("BAND karne ki req inbackend")
    // console.log("coordback:"+x+","+y)
    io.emit('updateSpawnPoints',{'x':x,'y':y})
  })
  socket.on('changeImages',({x,y,cond})=>{
    console.log("changImages ki request backend mei aa gyi")
    console.log("coordchangeback:"+x+","+y+";"+cond)
    io.emit('updateImage',{x:x,y:y,cond:cond})
  })
  setInterval(()=>{
    const val=1
    io.emit('addEnemy',val);
  },10000)
})

//with just express it would have been app.listen :D
server.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
