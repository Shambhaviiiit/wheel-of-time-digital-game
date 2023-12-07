var frontEndPlayer;
var spawnPoints = []
var finalLevels = [levels.Levels.base]
var activeLevel = 0
var deadEnemiesCount = 0
var frontEndPlayers = {}
var totalEnemyCount = 0
var playerPoint = 0;
var enemyPoint = 0;
const socket = io();
portalInfo={
    '[1,5]':[[0,4],[0,5],[0,6]],
    '[1,14]':[[0,13],[0,14],[0,15]],
    '[7,1]':[[6,0],[7,0],[8,0]],
    '[7,18]':[[6,19],[7,19],[8,19]],
    '[20,1]':[[19,0],[20,0],[21,0]],
    '[20,18]':[[19,19],[20,19],[21,19]],
    '[26,5]':[[27,4],[27,5],[27,6]],
    '[26,14]':[[27,13],[27,14],[27,15]],
};
class Game {
    constructor() {
        // console.log("game constructinggg")
        allSprites.destroyEach();//of p5.js library->it reomves all the sprites from the sketch and  helps resetting the game.
        data = finalLevels[activeLevel]
        level = new Level(data.data, data.spawnPoints)
        // frontEndPlayer =new Player({id:socket.id,playerNumber:0,i:8,j:15,arr:level.data})
        // this.resourceImage=loadImage('../Assets/Images/yellow_resource.png');
        this.resourceSprites = []
        console.log(this.resourceSprites)
        socket.on('updatePlayers', (backEndPlayers) => {
            for (const id in backEndPlayers) {
                // console.log("id value in GAME.Js:")
                // console.log(id)
                const backEndPlayer = backEndPlayers[id]
                if (!frontEndPlayers[id])//i.e. if the backend player doesn't exist in the frontend
                {
                    frontEndPlayers[id] = new Player({
                        playerId: id,
                        playerNumber: backEndPlayer.playerNumber,
                        i: backEndPlayer.x,
                        j: backEndPlayer.y,
                        arr: level.data,
                    });
                }

            }
            for (const id in frontEndPlayers) {
                game
                if (!backEndPlayers[id]) {
                    delete frontEndPlayers[id]
                }
            }

            this.handleFrontEndPlayer(frontEndPlayers).then(() => {
                // console.log("PURI Array:")
                // console.log(frontEndPlayers)
                // console.log("active player:")
                // console.log(frontEndPlayer)
            });
        });
        socket.on('updateSpawnPoints', ({ x, y }) => {
            // console.log("band karne ki req in frontend")
            // console.log("coordfront:" + x + "," + y)
            for (let q = 0; q < level.spawnPoints.length; q++) {
                if (x == level.spawnPoints[q][0] && y == level.spawnPoints[q][1]) {
                    level.spawnPoints.splice(q, 1);
                    if (level.spawnPoints.length == 0) {
                        activeLevel++;
                        this.resetGame(1);
                    }
                    break;
                }
            }
            let cond=1
            socket.emit('changeImages',({'x':x,'y':y,'cond':cond}))
            // console.log("portal band kar diya successfully!")

        });
        socket.on('updateImage',({x,y,cond})=>{
            console.log("updateImage ki req frontend mei aa gyi")
        if(cond ==1)
        {
            // console.log("portal image change karni hai")
            let coord = [x,y]
            let keyToFind = JSON.stringify(coord)
            console.log(keyToFind)
            let value = portalInfo[keyToFind]
            console.log("Values in tha key:")
            console.log(value)
            for(let z=0;z<3;z++)
            {
                let temp = value[z]
                console.log(level.data[temp[1]])
                level.data[temp[0]][temp[1]]=10
            }
            console.log("updated data ki values:")
            console.log(level.data)
        }
        else if(cond==2)
        {
            let coord = [x,y]
            console.log(coord)
            console.log("mari hui image daal di")
            level.data[coord[0]][coord[1]]=15
            console.log(level.data)
        }
        });
        socket.on('updateEnemyPointsInAll', (id, points) => {
            if (id != socket.id) {
                if (enemyPoint < points)
                    enemyPoint = points;
            }
        })

        socket.on('player died', (id) => {
            if (id != socket.id) {
                if (frontEndPlayer[id]) frontEndPlayer[id].die()
            }
        })


        parr = []
        for (let i = 0; i < level.spawnPoints.length; i++) {
            parr[i] = new Enemy(level.spawnPoints[i][1], level.spawnPoints[i][0], level.data)

        }
        socket.on('addEnemy', (val) => {
            if ((parr.length - deadEnemiesCount) < 14)//maximum at a time can be 10
            {
                let i = parr.length
                let l = spawnPoints.length
                parr[i] = new Enemy(level.spawnPoints[i % 8][1], level.spawnPoints[i % 8][0], level.data)
            }
        })
        this.ui = createCanvas(innerWidth, innerHeight)
        this.win_sound = loadSound("../Assets/Sounds/win.wav")
    }
    async handleFrontEndPlayer(frontEndPlayers) {
        return new Promise((resolve) => {
            frontEndPlayer = frontEndPlayers[socket.id]
            this.loadResource(frontEndPlayer.playerNumber)
            resolve();
        });
    }
    async play() {
        await this.renderGame();
    }
    async renderGame() {
        var l = level.data.length;
        var centery = gb * l / 2;

        // camera.position.x = 330;
        // camera.position.y = 502;
        camera.position.x = width / 5;
        camera.position.y = height / 1.8;
        // camera.position.z = camer;

        background(bgimg);
        level.display();
        level.drawground();
        for (let i = 0; i < parr.length; i++) {
            parr[i].display();
        }

        level.drawWalls();

        fill(255, 250); // color for score of the number of enemies killed
        strokeWeight(1);
        stroke(0);
        textSize(gb);

        // text("🎯" + deadEnemiesCount + "/" + parr.length, camera.x, camera.y - 0.45 * height);
        // text("playerPoints:" + playerPoint + "enemyPoints:" + enemyPoint, camera.x, camera.y - 0.4 * height);

        // Draw player score box
        fill(169, 169, 169);
        rect(camera.x - 0.45 * width, camera.y - 0.45 * height, 0.2 * width, 0.2 * height, 20, 50); // Adjust the position and size as needed
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(46);
        text("Player Score: " + playerPoint, camera.x - 0.35 * width, camera.y - 0.37 * height);

        // Draw enemy score box
        fill(169, 169, 169);
        rect(camera.x + 0.25 * width, camera.y - 0.45 * height, 0.2 * width, 0.2 * height); // Adjust the position and size as needed
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(46);
        text("Enemy Score: " + enemyPoint, camera.x + 0.35 * width, camera.y - 0.37 * height);


        for (const id in frontEndPlayers) {
            frontEndPlayers[id].display();
        }

        if (frontEndPlayer.health <= 0) {
            //have to make changes here
            // console.log("player died")
            // socket.emit("i died", socket.id)
            // frontEndPlayer.die()

            // delete backEndPlayers[socket.id]
            this.resetGame(0);
        }
        // else
        //     console.log("health", frontEndPlayer.health)

        strokeWeight(gb / 10);
        stroke(0);
        noFill();
        ellipse((click.j + 1) * gb, (click.i + 1) * gb, gb / 2, gb / 2);

        if (deadEnemiesCount == parr.length) {
            activeLevel++;
            this.resetGame(1);
        }
        // if (level.spawnPoints.length == 0) {
        //     activeLevel++;
        //     this.resetGame(1);
        // }
        if (enemyPoint > 100) {
            this.resetGame(-1);
        }
        if (this.resourceSprites.length <= 1) {
            this.spawnResources(30)
        }
        this.checkResourceCollision();
    }
    loadResource(playerNumber) {
        switch (playerNumber) {
            case 0:
                this.resourceImage = loadImage("../Assets/Images/red_resource.png");
                break;
            case 1:
                this.resourceImage = loadImage("../Assets/Images/yellow_resource.png");
                break;
            case 2:
                this.resourceImage = loadImage("../Assets/Images/blue_resource.png");
                break;
            case 3:
                this.resourceImage = loadImage("../Assets/Images/green_resource.png");
                break;

            default:
                this.resourceImage = loadImage("../Assets/Images/red_resource.png");
        }
    }
    checkResourceCollision() {
        for (let i = this.resourceSprites.length - 1; i >= 0; i--) {
            let resource = this.resourceSprites[i]
            if (frontEndPlayer.sprite.overlap(resource)) {
                console.log("Player Picked Up a resource")
                this.resourceSprites[i].remove()
                this.resourceSprites.splice(i, 1)
                playerPoint += 1
            }
            for (let j = 0; j < parr.length; j++) {
                if (parr[j].sprite.overlap(resource)) {
                    console.log("Enemy Picked Up a resource")
                    this.resourceSprites[i].remove()
                    this.resourceSprites.splice(i, 1)
                    enemyPoint += 1
                    socket.emit('updateEnemyPoints', socket.id, enemyPoint);
                }
            }

        }
    }
    checkDropLocationCollision() {
        //to be done...
    }
    spawnResources(count) {
        for (let i = 0; i < count; i++) {
            this.spawnResource();
        }
    }
    spawnResource() {
        //take random coordinates for the spawn location
        let randX = floor(random(1, level.data[0].length));
        let randY = floor(random(1, level.data.length));
        // check if there's no wall 
        while (level.data[randY - 1][randX - 1] !== 1) {
            randX = floor(random(1, level.data[0].length));
            randY = floor(random(1, level.data.length));
        }
        let resourceSprite = createSprite(randX * gb, randY * gb, gb, gb)
        resourceSprite.addImage(this.resourceImage)
        resourceSprite.resourceType = 'resource'
        this.resourceSprites.push(resourceSprite);
    }
    resetGame(state) {
        // Reset game logic here
        // console.log("reset game logic")
        // game = null
        gameStart = false
        form = null
        form = new Form()
        for (let i = 0; i < parr.length; i++) {
            parr[i].shoot_sound.setVolume(0.001)
        }
        // console.log("form")
        // console.log(form)
        if (state == 0) {
            // dead but game not over
            console.log(state)
            // form.startButton.size(butto/nWidth, buttonHeight);
            form.show(false)
            form.startButton.style("font-size", gb + "px");
            form.startButton.style("width", gb * 14 + "px");
            form.startButton.style("height", gb * 10 + "px");
            form.startButton.mousePressed(() => { })
            form.startButton.position(width / 2 - gb * 7, camera.y - gb * 5);
            form.startButton.html("You Died<br>Enemy Points " + enemyPoint + "<br>Player Points " + playerPoint)
            // form.startButton = null
            // background(0, 0, 0);
            // fill(255);
            // textSize(46);
            // // form.Heading = " You lose\n" + form.Heading + "\nWait for the others to finish"
            // text("Player Score: " + playerPoint, camera.x - 0.44 * width, camera.y - 0.37 * height);
            // text("Enemy Score: " + enemyPoint, camera.x + 0.45 * width, camera.y - 0.37 * height);
            // gameStart = false
            // form.startButton.show()
            // this.resourceSprites = []
        }
        else if (state == -1) {
            // game over enemies won
            game = null
            form = null
            form = new Form()
            form.startButton.html(" You lose<br>" + form.Heading + "<br>𝕽𝖊𝖘𝖙𝖆𝖗𝖙 𝕲𝖆𝖒𝖊")
            // this.win_sound.play()
            form.Heading = " You lose\n" + form.Heading
            form.show()
            form.startButton.style("font-size", gb + "px");
            form.startButton.style("width", gb * 14 + "px");
            form.startButton.style("height", gb * 10 + "px");
            form.startButton.position(width / 2 - gb * 7, camera.y - gb * 5);
            form.startButton.mousePressed(() => { window.location.reload() })
            this.resourceSprites = []
            playerPoint = 0
            enemyPoint = 0
            deadEnemiesCount = 0
        }
        else if (state == 1 && finalLevels.length == activeLevel) {
            // game = null
            // form = null
            // form = new Form()
            form.show(false)
            form.startButton.style("font-size", gb + "px");
            form.startButton.style("width", gb * 14 + "px");
            form.startButton.style("height", gb * 10 + "px");
            form.startButton.mousePressed(() => {window.location.reload()})
            form.startButton.position(width / 2 - gb * 7, camera.y - gb * 5);
            form.startButton.html("YOU WIN!!<br>ℙ𝕝𝕒𝕪 𝔸𝕘𝕒𝕚𝕟")
            // form.startButton.html("𝕹𝖊𝖝𝖙 𝐋𝐞𝐯𝐞𝐥")
            this.win_sound.play()
            form.Heading = " 𝓨𝓸𝓾 𝓦𝓲𝓷\n" + "𝐋𝐞𝐯𝐞𝐥 " + (activeLevel)
            this.resourceSprites = []
            playerPoint = 0
            enemyPoint = 0
            deadEnemiesCount = 0
        }
        // else if (state == 1 && finalLevels.length == activeLevel) {
        //     // game = null
        //     // form = null
        //     // form = new Form()
        //     form.show(false)
        //     form.startButton.style("font-size", gb + "px");
        //     form.startButton.style("width", gb * 14 + "px");
        //     form.startButton.style("height", gb * 10 + "px");
        //     form.startButton.mousePressed(() => {window.location.reload()})
        //     form.startButton.position(width / 2 - gb * 7, camera.y - gb * 5);
        //     form.startButton.html("ℜ𝔢𝔰𝔱𝔞𝔯𝔱 𝔉𝔯𝔬𝔪 𝔅𝔢𝔤𝔦𝔫𝔦𝔫𝔤")
        //     this.win_sound.play()
        //     win_sound.play()
        //     form.Heading = " 𝓨𝓸𝓾 𝓦𝓲𝓷\n" + "𝐋𝐞𝐯𝐞𝐥 " + (activeLevel) + "\nGᗩᗰE \nᑕOᗰᑭᒪETE"
        //     // form.show()
        //     deadEnemiesCount = 0
        //     this.resourceSprites = []
        //     enemyPoint = 0
        //     playerPoint = 0
        // }
    }
}
function preload() {
    bgimg = loadImage('../Assets/Images/hooror_bg.jpg')
}
