var frontEndPlayer;
var spawnPoints = []
var finalLevels = [levels.Levels.base]
var activeLevel = 0
var deadEnemiesCount = 0
var frontEndPlayers = {}
const socket = io();
class Game {
  constructor() {
    allSprites.destroyEach();//of p5.js library->it reomves all the sprites from the sketch and  helps resetting the game.
    data = finalLevels[activeLevel]
    level = new Level(data.data, data.spawnPoints)
    // frontEndPlayer =new Player({id:socket.id,playerNumber:0,i:8,j:15,arr:level.data})
    socket.on('updatePlayers', (backEndPlayers) => {
      // console.log(backendPlayers)
      for (const id in backEndPlayers) {
        // console.log("id value in GAME.Js:")
        // console.log(id)
        const backEndPlayer = backEndPlayers[id]
        // console.log("backEndPlayerin  game.js:")
        // console.log(backEndPlayer)
        if (!frontEndPlayers[id])//i.e. if the backend player doesn't exist in the frontend
        {
          // console.log("doesnot exist")
          // console.log(frontEndPlayer[id])
          // console.log("naya player banaa rhe hai..")
          frontEndPlayers[id] = new Player({
            playerId: id,
            playerNumber: backEndPlayer.playerNumber,
            i: backEndPlayer.x,
            j: backEndPlayer.y,
            arr: level.data,
          });
          // console.log("naye player ki values:")
          // console.log(frontEndPlayers[id])
        }
        else
        {
          // console.log("exists")
          // console.log(frontEndPlayers[id])
        }

      }
      for (const id in frontEndPlayers) {
        // console.log("extra error handling")
        if (!backEndPlayers[id]) {
          delete frontEndPlayers[id]
        }
      }
      // if(frontEndPlayer == null)
      frontEndPlayer = frontEndPlayers[socket.id]
      // console.log("PURI Array:")
      // console.log(frontEndPlayers)
      // console.log("active player:")
      // console.log(frontEndPlayer)
      // if (this.onFrontEndPlayerReady) {
      //   this.onFrontEndPlayerReady(frontEndPlayer);
      // }
    });
    // socket.on('updatePlayers', (backEndPlayerNew) => {
    //   let id = backEndPlayerNew.id
    //   console.log(id)
    //   frontEndPlayers[id] = new Player({
    //     playerId: id,
    //     playerNumber: backEndPlayerNew.playerNumber,
    //     i: backEndPlayerNew.x,
    //     j: backEndPlayerNew.y,
    //     arr: level.data,
    //   });


    //   for (const id in frontEndPlayers) {
    //     console.log("extra error handling")
    //     console.log(frontEndPlayers)
    //     if (!backEndPlayers[id]) {
    //       delete frontEndPlayers[id]
    //     }
    //   }
    //   // if(frontEndPlayer == null)
    //   frontEndPlayer = frontEndPlayers[socket.id]
    //   console.log("PURI Array:")
    //   console.log(frontEndPlayers)
    //   console.log("active player:")
    //   console.log(frontEndPlayer)
    //   // if (this.onFrontEndPlayerReady) {
    //   //   this.onFrontEndPlayerReady(frontEndPlayer);
    //   // }
    // });
    parr = []
    for (let i = 0; i < level.spawnPoints.length; i++) {
      parr[i] = new Enemy(level.spawnPoints[i][1], level.spawnPoints[i][0], level.data)

    }
    this.ui = createCanvas(innerWidth, innerHeight)
    this.win_sound = loadSound("../Assets/Sounds/win.wav")
  }
  async play() {
    // try {
    var l = level.data.length
    var centery = gb * l / 2
    camera.position.x = 210
    camera.position.y = 332
    background(bgimg)
    level.display()

    level.drawground()
    for (let i = 0; i < parr.length; i++) {
      parr[i].display()
    }

    level.drawWalls()
    fill(255, 250) //color for score of number of enemies killed
    strokeWeight(1)
    stroke(0)
    textSize(gb)

    text("🎯" + deadEnemiesCount + "/" + parr.length, camera.x, camera.y - .45 * height)
    for (const id in frontEndPlayers) {
      frontEndPlayers[id].display();
    }
    if (frontEndPlayer.health <= 0) this.resetGame(0)

    strokeWeight(gb / 10)
    stroke(0);
    noFill();
    ellipse((click.j + 1) * gb, (click.i + 1) * gb, gb / 2, gb / 2);


    if (deadEnemiesCount == parr.length) {
      activeLevel++
      this.resetGame(1)
    }
    // }

    // catch(err) {
    //   console.log("error in async play")
    //   console.log(err)
    // }

  }
  resetGame(state) {
    game = null
    form = null
    form = new Form()
    if (state == 0) {
      form.startButton.html("𝕽𝖊𝖘𝖙𝖆𝖗𝖙 𝕲𝖆𝖒𝖊")
      form.Heading = " You lose\n" + form.Heading
    }
    else if (state == 1 && finalLevels.length > activeLevel) {
      form.startButton.html("𝕹𝖊𝖝𝖙 𝐋𝐞𝐯𝐞𝐥")
      this.win_sound.play()
      form.Heading = " 𝓨𝓸𝓾 𝓦𝓲𝓷\n" + "𝐋𝐞𝐯𝐞𝐥 " + (activeLevel)
      deadEnemiesCount = 0
    }
    else if (state == 1 && finalLevels.length == activeLevel) {
      form.startButton.html("ℜ𝔢𝔰𝔱𝔞𝔯𝔱 𝔉𝔯𝔬𝔪 𝔅𝔢𝔤𝔦𝔫𝔦𝔫𝔤")
      this.win_sound.play()
      win_sound.play()
      form.Heading = " 𝓨𝓸𝓾 𝓦𝓲𝓷\n" + "𝐋𝐞𝐯𝐞𝐥 " + (activeLevel) + "\nGᗩᗰE \nᑕOᗰᑭᒪETE"
      deadEnemiesCount = 0
    }
  }
}
function preload() {
  bgimg = loadImage('../Assets/Images/hooror_bg.jpg')
}